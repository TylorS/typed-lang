import { SourceFile } from "@typed-lang/parser";
import { Module } from "../../MappedDocumentGenerator.js";

import { dataDeclarationDtsGenerator } from "./dataDeclarationDtsGenerator.js";
import { forEachNodeNewLine } from "../shared/utils.js";

export function dtsSourceFileGenerator(
  module: Module,
  sourceFile: SourceFile
): void {
  forEachNodeNewLine(module, sourceFile.statements, 2, (statement) => { 
    switch (statement._tag) {
      case "DataDeclaration":
        return dataDeclarationDtsGenerator(module, statement);
      default:
        throw new Error(`Unsupported statement type: ${statement._tag}`);
    }
  })
}
