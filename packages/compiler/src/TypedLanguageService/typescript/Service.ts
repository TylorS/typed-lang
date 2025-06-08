/**
 * @since 1.0.0
 */
import * as ts from "typescript"
import { createDiagnosticWriter, type DiagnosticWriter } from "./diagnostics.js"
import { Project } from "./Project.js"
import { TsCompiler } from "../../TsCompiler.js"
import * as path from "node:path"
import { getCanonicalFileName } from "./util.js"

/**
 * @since 1.0.0
 */
export class Service {
  /**
   * @since 1.0.0
   */
  readonly documentRegistry: ts.DocumentRegistry
  /**
   * @since 1.0.0
   */
  readonly diagnosticWriter: DiagnosticWriter

  constructor(readonly compiler: TsCompiler, readonly params: {
    write?: (message: string) => void
  }) {
    this.documentRegistry = ts.createDocumentRegistry()
    this.diagnosticWriter = createDiagnosticWriter(params.write)
  }

  /**
   * @since 1.0.0
   */
  openProject(
    cmdLine: ts.ParsedCommandLine,
    params: {
      rootDir?: string
      outDir?: string
    }
  ): Project {
    return new Project(
      this.compiler,
      this.diagnosticWriter,
      {
        rootDir: params.rootDir ?? cmdLine.options.rootDir ?? process.cwd(),
        outDir: params.outDir,
        documentRegistry: this.documentRegistry,
        cmdLine,
        enhanceLanguageServiceHost: (host, compiler) => {
          const originalResolveModuleNameLiterals = host.resolveModuleNameLiterals?.bind(host)

          function resolveTypedModuleNameLiteral(moduleLiteral: string, containingFile: string): ts.ResolvedModuleWithFailedLookupLocations {
            const absolutePath = path.resolve(path.dirname(containingFile), moduleLiteral)

            return {
              resolvedModule: {
                resolvedFileName: compiler.getVirtualFileName(absolutePath),
                extension: ts.Extension.Ts,
                isExternalLibraryImport: false,
              },
            }
          }

          const moduleResolutionCache = ts.createModuleResolutionCache(host.getCurrentDirectory(), getCanonicalFileName)

          host.resolveModuleNameLiterals = (moduleLiterals, containingFile, redirectedReference, options, containingSourceFile, reusedNames) => {
            return moduleLiterals.flatMap(moduleLiteral => {
              if (compiler.isTypedLikeFile(moduleLiteral.text)) {
                return [resolveTypedModuleNameLiteral(moduleLiteral.text, containingFile)]
              }

              if (originalResolveModuleNameLiterals) {
                return originalResolveModuleNameLiterals(moduleLiterals, containingFile, redirectedReference, options, containingSourceFile, reusedNames)
              }

              return ts.resolveModuleName(moduleLiteral.text, containingFile, options, host, moduleResolutionCache, redirectedReference)
            })
          }
        },
      }
    )
  }
}