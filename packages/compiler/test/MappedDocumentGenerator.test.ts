import { DataDeclaration, parse } from "@typed-lang/parser";
import { describe, it } from "vitest";
import { generateModule } from "../src/MappedDocumentGenerator";
import { compileModule } from "../src/ModuleCompiler";
import { writeFileSync } from "node:fs";
import * as templates from "../src/templates/index";
import { t, templateToString } from "../src/Template";

describe("MappedDocumentGenerator", () => {
  const fileName = "test.typed";
  const extension = ".ts";
  const outputFileName = fileName + extension;
  const code = `export data Maybe<A> = Nothing | Just(value: A)`;
  const sourceFile = parse(fileName, code);
  const decl = sourceFile.declarations[0] as DataDeclaration;
  const module = generateModule(sourceFile, extension, "single");
  const template = [
    templates.dataDeclarationTypeAliasTemplate(decl),
    t.newLine(),
    templates.dataDeclarationConstructorsTemplate(decl)
  ]

  console.log(templateToString(template));

  it("does things", () => {
    module.runInterpolation(template);
    const compiled = compileModule(module);
    const output = compiled[outputFileName];

    writeFileSync(outputFileName, output.code);
    writeFileSync(outputFileName + ".map", JSON.stringify(output.map));
  });
});
