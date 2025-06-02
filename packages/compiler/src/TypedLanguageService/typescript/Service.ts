/**
 * @since 1.0.0
 */
import * as ts from "typescript"
import { createDiagnosticWriter, type DiagnosticWriter } from "./diagnostics.js"
import { Project } from "./Project.js"
import { TsCompiler } from "../../TsCompiler.js"

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
      outDir?: string
      enhanceLanguageServiceHost?: (host: ts.LanguageServiceHost, compiler: TsCompiler) => void
    }
  ): Project {
    return new Project(
      this.compiler,
      this.diagnosticWriter,
      {
        outDir: params.outDir,
        documentRegistry: this.documentRegistry,
        cmdLine,
        enhanceLanguageServiceHost: params.enhanceLanguageServiceHost,
      }
    )
  }
}