import { SourceFile } from "@typed-lang/parser";
import { Module } from "../../MappedDocumentGenerator.js";

import { dataDeclarationTsGenerator } from "./dataDeclarationTsGenerator.js";
import { forEachNodeNewLine } from "../shared/utils.js";

export function tsSourceFileGenerator(
  module: Module,
  sourceFile: SourceFile
): void {
  forEachNodeNewLine(module, sourceFile.statements, 2, (statement) => { 
    switch (statement._tag) {
      case "DataDeclaration":
        return dataDeclarationTsGenerator(module, statement);
      default:
        throw new Error(`Unsupported statement type: ${statement._tag}`);
    }
  })
}
