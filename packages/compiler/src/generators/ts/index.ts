import { DataDeclaration, SourceFile } from "@typed-lang/parser";
import {
  MappedDocumentGenerator,
  Module,
} from "../../MappedDocumentGenerator.js";

import { dataDeclarationTsGenerator } from "./dataDeclarationTSGenerator.js";
import { forEachNodeNewLine } from "../shared/utils.js";
import { dirname, relative } from "path";

export function tsSourceFileGenerator(
  module: Module,
  sourceFile: SourceFile,
  config: {
    dataDeclarationOutputMode: "sub" | "root";
  }
): void {
  forEachNodeNewLine(module, sourceFile.statements, 2, (statement) => {
    switch (statement._tag) {
      case "DataDeclaration":
        return dataDeclarationTsGenerator(
          module,
          statement,
          config.dataDeclarationOutputMode
        );
      default:
        throw new Error(`Unsupported statement type: ${statement._tag}`);
    }
  });

  module.addModule(
    module.fileName.replace(".ts", ".d.ts"),
    sourceFile.span,
    (gen) => {
      forEachNodeNewLine(module, sourceFile.statements, 2, (statement) => {
        switch (statement._tag) {
          case "DataDeclaration":
            return dataDeclarationRexportDtsGenerator(gen, statement, module);
          default:
            throw new Error(`Unsupported statement type: ${statement._tag}`);
        }
      });
    },
    false
  );
}

function dataDeclarationRexportDtsGenerator(
  gen: MappedDocumentGenerator,
  decl: DataDeclaration,
  module: Module
) {
  gen.withSpan({ span: decl.span }, (gen) => {
    const baseModule = module.fileName.replace(".ts", "");
    const importName = ensureRelative(
      module.fileName,
      baseModule + "." + decl.name + ".js"
    );

    gen.addText(`export * as `);
    gen.addText(decl.name, { span: decl.nameSpan, name: decl.name });
    gen.addText(` from '`);
    gen.addText(importName);
    gen.addText(`'`);
  });
}

function ensureRelative(from: string, to: string): string {
  const rel = relative(dirname(from), to);

  if (rel.startsWith(".")) return rel;

  return `./${rel}`;
}
