import { CompilerService, DTS } from "@typed-lang/compiler";
import { dirname, resolve } from "path";
import * as ts from "typescript";

function languageServicePlugin({ typescript }: { typescript: typeof ts }) {
  return {
    create(info: ts.server.PluginCreateInfo) {
      const logger = createLogger(info);
      const service = new CompilerService(DTS, ".d.ts", info.project);

      const resolveModuleNameLiterals =
        info.languageServiceHost.resolveModuleNameLiterals?.bind(
          info.languageServiceHost
        );
      info.languageServiceHost.resolveModuleNameLiterals = (
        moduleNames,
        containingFile,
        redirectedReference,
        options,
        containingSourceFile,
        reusedNames
      ) => {
        logger.log(
          `Resolving module names ${moduleNames
            .map((x) => x.getText())
            .join(", ")} from ${containingFile}`
        );

        const typedModuleNames = moduleNames.filter((moduleName) =>
          isTypedModuleName(removeQuotes(moduleName.getText()))
        );
        if (typedModuleNames.length > 0) {
          const nonTypedModuleNames = moduleNames.filter(
            (moduleName) =>
              !isTypedModuleName(removeQuotes(moduleName.getText()))
          );
          const nonTypedModules =
            resolveModuleNameLiterals?.(
              nonTypedModuleNames,
              containingFile,
              redirectedReference,
              options,
              containingSourceFile,
              reusedNames
            ) ?? [];

          const typedModules = typedModuleNames.map((identifier) => {
            const text = removeQuotes(identifier.getText());
            const moduleName = resolve(dirname(containingFile), text);

            return {
              resolvedModule: {
                extension: ts.Extension.Dts,
                isExternalLibraryImport: false,
                resolvedFileName: moduleName,
                failedLookupLocations: [],
                isDeclarationFile: true,
              },
            };
          });

          logger.log(`Resolved ${typedModules.length} typed modules`);

          return [...nonTypedModules, ...typedModules];
        }

        return (
          resolveModuleNameLiterals?.(
            moduleNames,
            containingFile,
            redirectedReference,
            options,
            containingSourceFile,
            reusedNames
          ) ?? []
        );
      };

      const resolveModuleNames =
        info.languageServiceHost.resolveModuleNames?.bind(
          info.languageServiceHost
        );

      info.languageServiceHost.resolveModuleNames = (
        moduleNames,
        containingFile,
        reusedNames,
        redirectedReference,
        options
      ) => {
        logger.log(
          `Resolving module names ${moduleNames.join(
            ", "
          )} from ${containingFile}`
        );

        const typedModuleNames = moduleNames.filter((moduleName) =>
          isTypedModuleName(moduleName)
        );
        if (typedModuleNames.length > 0) {
          const nonTypedModuleNames = moduleNames.filter(
            (moduleName) => !isTypedModuleName(moduleName)
          );
          const nonTypedModules =
            resolveModuleNames?.(
              nonTypedModuleNames,
              containingFile,
              reusedNames,
              redirectedReference,
              options
            ) ?? [];

          const typedModules = typedModuleNames.map((moduleName) => {
            const newModuleName = moduleName + ".d.ts";

            logger.log(`Resolving ${moduleName} to ${newModuleName}`);

            return {
              extension: ts.Extension.Dts,
              isExternalLibraryImport: false,
              resolvedFileName: newModuleName,
              isDeclarationFile: true,
            };
          });

          logger.log(`Resolved ${typedModules.length} typed modules`);

          return [...nonTypedModules, ...typedModules];
        }

        return (
          resolveModuleNames?.(
            moduleNames,
            containingFile,
            reusedNames,
            redirectedReference,
            options
          ) ?? []
        );
      };

      const getScriptKind = info.languageServiceHost.getScriptKind?.bind(
        info.languageServiceHost
      );

      info.languageServiceHost.getScriptKind = (fileName) => {
        logger.log(`Getting script kind for ${fileName}`);
        if (isTypedModuleName(fileName) || isTypedModuleDts(fileName)) {
          return typescript.ScriptKind.TS;
        }

        return getScriptKind?.(fileName) ?? ts.ScriptKind.Unknown;
      };

      const getScriptFileNames =
        info.languageServiceHost.getScriptFileNames.bind(
          info.languageServiceHost
        );

      info.languageServiceHost.getScriptFileNames = () => {
        logger.log("Getting script file names");
        const fileNames = getScriptFileNames();
        return [...fileNames, ...service.getScriptFileNames()];
      };

      const getScriptVersion = info.languageServiceHost.getScriptVersion?.bind(
        info.languageServiceHost
      );

      info.languageServiceHost.getScriptVersion = (fileName) => {
        logger.log("Getting script version for " + fileName);

        if (service.has(fileName)) {
          return service.getScriptVersion(fileName);
        }

        return getScriptVersion(fileName);
      };

      const getScriptSnapshot = info.languageServiceHost.getScriptSnapshot.bind(
        info.languageServiceHost
      );

      info.languageServiceHost.getScriptSnapshot = (fileName) => {
        if (service.has(fileName)) {
          logger.log(`Getting script snapshot for ${fileName}`);
          return service.getSnapshot(fileName)!.snapshot;
        } else if (isTypedModuleName(fileName)) {
          const contents = ts.sys.readFile(fileName, "utf-8")!;
          const { snapshot } = service.compile(fileName, contents);

          return snapshot;
        }

        return getScriptSnapshot(fileName);
      };

      return info.languageService;
    },
    getExternalFiles(project: ts.server.ConfiguredProject) {
      return project.getFileNames().filter(isTypedModuleDts);
    },
  };
}

function isTypedModuleName(moduleName: string) {
  return moduleName.endsWith(".typed");
}

function isTypedModuleDts(fileName: string) {
  return fileName.endsWith(".typed.d.ts");
}

interface Logger {
  log: (message: string) => void;
  error: (error: unknown) => void;
}

const createLogger = (info: ts.server.PluginCreateInfo): Logger => {
  const log = (message: string) => {
    info.project.projectService.logger.info(
      `[@typed-lang/ts-plugin] ${message}`
    );
  };
  const error = (error: unknown) => {
    log(`Failed with error: ${error as string}`);
  };

  return {
    log,
    error,
  };
};

function removeQuotes(text: string) {
  return text.replace(/['"]/g, "");
}

export = languageServicePlugin;
