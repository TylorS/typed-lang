import { DataDeclaration, parse } from "@typed-lang/parser";
import { describe, it } from "vitest";
import { generateModule } from "../src/MappedDocumentGenerator";
import { compileModule } from "../src/ModuleCompiler";
import { writeFileSync } from "node:fs";
import { addDataDeclarationTypeAlias } from "../src/generators/shared/addDataDeclarationTypeAlias";

describe("MappedDocumentGenerator", () => {
  const fileName = "test.typed";
  const extension = ".d.ts";
  const outputFileName = fileName + extension;
  const code = `data Maybe<A> = Nothing | Just(value: A)`;
  const sourceFile = parse(fileName, code);
  const decl = sourceFile.statements[0] as DataDeclaration;
  const module = generateModule(sourceFile, extension);

  it("does things", () => {
    addDataDeclarationTypeAlias(module, decl);

    const compiled = compileModule(module);
    const output = compiled[outputFileName];

    writeFileSync(outputFileName, output.code);
    writeFileSync(outputFileName + ".map", JSON.stringify(output.map));
  });
});
