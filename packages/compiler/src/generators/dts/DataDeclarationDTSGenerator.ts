import { codeGen, CodeGeneratorContext } from "../../CodeGenerator.js";
import {
  DataDeclaration,
  isDataDeclaration,
} from "@typed-lang/parser";
import { DataDeclarationTypeAliasGenerator } from "../shared/DataDeclarationTypeAliasGenerator.js";
import { DataDeclarationInterfaceGenerator } from "../shared/DataDeclarationInterfaceGenerators.js";
import { DataDeclarationConstructorGenerator } from "./DataDeclarationConstructorGenerator.js";
import { DataDeclarationGuardGenerator } from "./DataDeclarationGuardGenerator.js";

export class DataDeclarationDTSGenerator extends codeGen(
  isDataDeclaration,
  (ctx, decl) => {
    openNamespace(ctx, decl);
    ctx.identation.with(() => {
      ctx.modules.run(DataDeclarationTypeAliasGenerator, decl);
      ctx.modules.addNewLine(2);
      ctx.modules.run(DataDeclarationInterfaceGenerator, decl);
      ctx.modules.addNewLine(2);
      ctx.modules.run(DataDeclarationConstructorGenerator, decl);
      ctx.modules.addNewLine(2);
      ctx.modules.run(DataDeclarationGuardGenerator, decl);
    });
    closeNamespace(ctx, decl);
  }
) {}

const openNamespace = (ctx: CodeGeneratorContext, decl: DataDeclaration) => {
  ctx.modules.addSegment(`export declare namespace `, decl.span.start);
  ctx.modules.addSegment(
    decl.name,
    decl.nameSpan.start,
    decl.name,
    ctx.content(decl.nameSpan)
  );
  ctx.modules.addSegment(` {`);
  ctx.modules.addNewLine();
};

const closeNamespace = (ctx: CodeGeneratorContext, decl: DataDeclaration) => {
  ctx.modules.addSegment(`}`, decl.span.end);
  ctx.modules.addNewLine();
};
