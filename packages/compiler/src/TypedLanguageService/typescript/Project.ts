/**
 * @since 1.0.0
 */

import * as ts from "typescript"
import { TsCompiler } from "../../TsCompiler.js"
import { ExternalFileCache, ProjectFileCache } from "./cache.js"
import type { DiagnosticWriter } from "./diagnostics.js"
import * as path from "node:path"

/**
 * @since 1.0.0
 */
export class Project {
  private cmdLine: ts.ParsedCommandLine

  /**
   * @since 1.0.0
   */
  readonly projectFiles: ProjectFileCache

  /**
   * @since 1.0.0
   */
  readonly externalFiles: ExternalFileCache

  /**
   * @since 1.0.0
   */
  readonly languageService: ts.LanguageService

  /**
   * @since 1.0.0
   */
  readonly program: ts.Program

  /**
   * @since 1.0.0
   */
  readonly typeChecker: ts.TypeChecker

  /**
   * @since 1.0.0
   */
  readonly languageServiceHost: ts.LanguageServiceHost

  constructor(
    readonly compiler: TsCompiler,
    readonly diagnosticWriter: DiagnosticWriter,
    readonly params: {
      rootDir: string
      outDir?: string
      documentRegistry: ts.DocumentRegistry,
      cmdLine: ts.ParsedCommandLine,
      enhanceLanguageServiceHost?: (host: ts.LanguageServiceHost, compiler: TsCompiler) => void
    },

  ) {
    this.cmdLine = params.cmdLine

    this.projectFiles = new ProjectFileCache(params.cmdLine.fileNames)
    this.externalFiles = new ExternalFileCache()

    const languageServiceHost: ts.LanguageServiceHost = (this.languageServiceHost = {
      getCompilationSettings: () => {
        return {
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          ...this.cmdLine.options,
          sourceMap: true,
          declaration: true,
          declarationMap: true,
          rootDir: this.params.rootDir,
          outDir: this.params.outDir ?? this.cmdLine.options.outDir ?? 'dist',
        }
      },
      // getNewLine?(): string;
      // getProjectVersion?(): string;
      getScriptFileNames: () => [...this.projectFiles.getFileNames(), ...this.compiler.getScriptFileNames()],
      getScriptKind: (fileName) => {
        if (this.compiler.isTypedLikeFile(fileName)) {
          return ts.ScriptKind.TS
        }

        if (fileName.endsWith('.tsx')) {
          return ts.ScriptKind.TSX
        }

        if (fileName.endsWith('.ts')) {
          return ts.ScriptKind.TS
        }

        if (fileName.endsWith('.jsx')) {
          return ts.ScriptKind.JSX
        }

        if (fileName.endsWith('.js')) {
          return ts.ScriptKind.JS
        }

        if (fileName.endsWith('.json')) {
          return ts.ScriptKind.JSON
        }

        return ts.ScriptKind.Unknown
      },
      getScriptVersion: (fileName) => this.projectFiles.getVersion(fileName) ?? String(this.compiler.getSnapshot(fileName)?.version ?? 0),
      getScriptSnapshot: (fileName) =>
        this.compiler.isTypedLikeFile(fileName) ? this.compiler.getSnapshot(fileName)?.snapshot : this.projectFiles.getSnapshot(fileName) ?? this.externalFiles.getSnapshot(fileName),
      getProjectReferences: ():
        | ReadonlyArray<ts.ProjectReference>
        | undefined => params.cmdLine.projectReferences,
      // getLocalizedDiagnosticMessages?(): any;
      // getCancellationToken?(): HostCancellationToken;
      getCurrentDirectory: () => process.cwd(),
      getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
      // log: (s: string): void;
      // trace: (s: string): void;
      // error: (s: string): void;
      // useCaseSensitiveFileNames?(): boolean;

      /*
       * LS host can optionally implement these methods to support completions for module specifiers.
       * Without these methods, only completions for ambient modules will be provided.
       */
      readDirectory: ts.sys.readDirectory,
      readFile: ts.sys.readFile,
      realpath: ts.sys.realpath,
      fileExists: ts.sys.fileExists,

      /*
       * LS host can optionally implement these methods to support automatic updating when new type libraries are installed
       */
      // getTypeRootsVersion?(): number;

      /*
       * LS host can optionally implement this method if it wants to be completely in charge of module name resolution.
       * if implementation is omitted then language service will use built-in module resolution logic and get answers to
       * host specific questions using 'getScriptSnapshot'.
       *
       * If this is implemented, `getResolvedModuleWithFailedLookupLocationsFromCache` should be too.
       */
      // resolveModuleNames?(moduleNames: string[], containingFile: string, reusedNames: string[] | undefined, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedModule | undefined)[];
      // getResolvedModuleWithFailedLookupLocationsFromCache?(modulename: string, containingFile: string): ResolvedModuleWithFailedLookupLocations | undefined;
      // resolveTypeReferenceDirectives?(typeDirectiveNames: string[], containingFile: string, redirectedReference: ResolvedProjectReference | undefined, options: CompilerOptions): (ResolvedTypeReferenceDirective | undefined)[];

      /*
       * Required for full import and type reference completions.
       * These should be unprefixed names. E.g. `getDirectories("/foo/bar")` should return `["a", "b"]`, not `["/foo/bar/a", "/foo/bar/b"]`.
       */
      getDirectories: ts.sys.getDirectories,

      /**
       * Gets a set of custom transformers to use during emit.
       */
      // getCustomTransformers?(): CustomTransformers | undefined;

      // isKnownTypesPackageName?(name: string): boolean;
      // installPackage?(options: InstallPackageOptions): Promise<ApplyCodeActionCommandResult>;
      // writeFile?(fileName: string, content: string): void;

      // getParsedCommandLine?(fileName: string): ParsedCommandLine | undefined;

      directoryExists: ts.sys.directoryExists
    })

    if (params.enhanceLanguageServiceHost) {
      params.enhanceLanguageServiceHost(languageServiceHost, this.compiler)
    }

    this.languageService = ts.createLanguageService(
      languageServiceHost,
      params.documentRegistry
    )
    this.program = this.languageService.getProgram()!
    this.typeChecker = this.program.getTypeChecker()
  }

  getFileNames() {
    return Array.from(new Set([...this.projectFiles.getFileNames(), ...this.compiler.getScriptFileNames()]))
  }

  /**
   * @since 1.0.0
   */
  addFile(filePath: string) {
    if (this.compiler.isTypedLikeFile(filePath)) {
      const typedSnapshot = this.compiler.compile(filePath, ts.sys.readFile(filePath)!)
      this.projectFiles.set(typedSnapshot.fileName, typedSnapshot.snapshot)
    } else {
      this.projectFiles.getSnapshot(filePath)
    }
    return this.program.getSourceFile(filePath)!
  }

  /**
   * @since 1.0.0
   */
  setFile(fileName: string, snapshot: ts.IScriptSnapshot): void {
    this.projectFiles.set(fileName, snapshot)
  }

  /**
   * @since 1.0.0
   */
  getSnapshot(filePath: string) {
    return this.languageServiceHost.getScriptSnapshot(filePath)
  }
  /**
   * @since 1.0.0
   */
  getType(node: ts.Node): ts.Type {
    return this.typeChecker.getTypeAtLocation(node)
  }
  /**
   * @since 1.0.0
   */
  getSymbol(node: ts.Node): ts.Symbol | undefined {
    return this.typeChecker.getSymbolAtLocation(node)
  }
  /**
   * @since 1.0.0
   */
  getFileDiagnostics(fileName: string): ReadonlyArray<ts.Diagnostic> {
    return [
      ...this.languageService.getSyntacticDiagnostics(fileName),
      ...this.languageService.getSemanticDiagnostics(fileName),
      ...this.languageService.getSuggestionDiagnostics(fileName)
    ]
  }
  /**
   * @since 1.0.0
   */
  validateFile(fileName: string): boolean {
    const diagnostics = this.getFileDiagnostics(fileName).filter(
      (d) => d.category !== ts.DiagnosticCategory.Suggestion
    )
    if (Array.isArray(diagnostics) && diagnostics.length > 0) {
      diagnostics.forEach((d) => this.diagnosticWriter.print(d))
      return false
    }
    return true
  }
  /**
   * @since 1.0.0
   */
  emitFile(fileName: string): Array<ts.OutputFile> {
    const output = this.languageService.getEmitOutput(fileName)
    if (!output || output.emitSkipped) {
      this.validateFile(fileName)
      return []
    }

    return output.outputFiles.map((f) => {
      // Re-map the sourcemaps to the .typed source files
      if (f.name.endsWith('.typed.js.map') || f.name.endsWith('.typed.d.ts.map')) {
        const outDir = this.languageServiceHost.getCompilationSettings().outDir!
        const relativeName = path.relative(outDir, f.name)
        const relativeTypedName = relativeName.replace(/\.typed.+/, '.typed')
        const typedName = this.compiler.toTypedFileName(path.join(this.params.rootDir, relativeTypedName))
        const typedSnapshot = this.compiler.getSnapshot(typedName)!
        const oldMap = typedSnapshot.map
        const newMap = JSON.parse(f.text)
        const remappedMap = this.compiler.remapSourceMap(oldMap, newMap)
        return {
          ...f,
          text: remappedMap
        }
      }

      return f
    })
  }

  emit() {
    const outputFiles: ts.OutputFile[] = []

    for (const fileName of this.getFileNames()) {
      outputFiles.push(...this.emitFile(fileName))
    }

    return outputFiles
  }
  /**
   * @since 1.0.0
   */
  dispose(): void {
    this.languageService.dispose()

    // @ts-expect-error `languageService` cannot be used after calling dispose
    this.languageService = null
  }
}