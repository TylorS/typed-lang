import { DtsCompiler } from "@typed-lang/compiler";
import { dirname, resolve } from "path";
import * as ts from "typescript";

function languageServicePlugin({ typescript }: { typescript: typeof ts }) {
  return {
    create(info: ts.server.PluginCreateInfo) {
      const logger = createLogger(info);
      const service = new DtsCompiler(info.project);

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
            .map((x) => x.getText(containingSourceFile))
            .join(", ")} from ${containingFile}`
        );

        const typedModuleNames = moduleNames.filter((moduleName) =>
          isTypedModuleName(
            removeQuotes(moduleName.getText(containingSourceFile))
          )
        );
        if (typedModuleNames.length > 0) {
          const nonTypedModuleNames = moduleNames.filter(
            (moduleName) =>
              !isTypedModuleName(
                removeQuotes(moduleName.getText(containingSourceFile))
              )
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
            const text = removeQuotes(identifier.getText(containingSourceFile));
            const moduleName = resolve(dirname(containingFile), text).replace(
              ".js",
              ".ts"
            );

            return {
              resolvedModule: {
                extension: ts.Extension.Ts,
                isExternalLibraryImport: false,
                resolvedFileName: moduleName + ".d.ts",
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

        if (isTypedModuleDts(fileName)) {
          return service.getScriptVersion(fileName.replace(".d.ts", ""));
        }

        return getScriptVersion(fileName);
      };

      const getScriptSnapshot = info.languageServiceHost.getScriptSnapshot.bind(
        info.languageServiceHost
      );

      info.languageServiceHost.getScriptSnapshot = (fileName) => {
        logger.log(`Getting script snapshot for ${fileName}`);

        try {
          if (service.has(fileName)) {
            return service.getSnapshot(fileName)!.snapshot;
          } else if (isTypedModuleName(fileName)) {
            const contents = ts.sys.readFile(fileName, "utf-8")!;
            const { snapshot } = service.compile(fileName, contents);

            return snapshot;
          } else if (isTypedModuleDts(fileName)) {
            const fileNameWithoutDts = fileName.replace(".d.ts", "");
            if (service.has(fileNameWithoutDts)) {
              return service.getSnapshot(fileNameWithoutDts)!.snapshot;
            } else {
              const contents = ts.sys.readFile(fileName, "utf-8")!;
              const { snapshot } = service.compile(
                fileNameWithoutDts,
                contents
              );

              return snapshot;
            }
          }

          return getScriptSnapshot(fileName);
        } catch (error) {
          logger.log(`Failed to get script snapshot for ${fileName}`);
          return getScriptSnapshot(fileName);
        }
      };

      const originalReadFile = info.project.projectService.host.readFile.bind(
        info.project.projectService.host
      );
      info.project.projectService.host.readFile = (fileName, encoding) => {
        if (isTypedModuleDts(fileName)) {
          const fileNameWithoutDts = fileName.replace(".d.ts", "");
          if (service.has(fileNameWithoutDts)) {
            return service.getSnapshot(fileNameWithoutDts)!.getText();
          }
        }

        return originalReadFile(fileName, encoding);
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
