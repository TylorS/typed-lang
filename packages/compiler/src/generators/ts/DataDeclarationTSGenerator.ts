import { codeGen } from "../../CodeGenerator.js";
import { isDataDeclaration } from "@typed-lang/parser";
import { DataDeclarationTypeAliasGenerator } from "../shared/DataDeclarationTypeAliasGenerator.js";
import { DataDeclarationInterfaceGenerator } from "../shared/DataDeclarationInterfaceGenerators.js";
import { DataDeclarationConstructorGenerator } from "./DataDeclarationConstructorGenerator.js";
import { DataDeclarationGuardGenerator } from "./DataDeclarationGuardGenerator.js";

export class DataDeclarationTSGenerator extends codeGen(
  isDataDeclaration,
  (rootCtx, decl) =>
    rootCtx.modules.runModule(
      decl.name,
      (ctx) => {
        ctx.modules.run(DataDeclarationTypeAliasGenerator, decl);
        ctx.modules.addNewLine(2);
        ctx.modules.run(DataDeclarationInterfaceGenerator, decl);
        ctx.modules.addNewLine(2);
        ctx.modules.run(DataDeclarationConstructorGenerator, decl);
        ctx.modules.addNewLine(2);
        ctx.modules.run(DataDeclarationGuardGenerator, decl);
      },
      decl.nameSpan.start
    )
) {}
