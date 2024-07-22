import { DataDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { dataDeclarationTypeAliasTemplate } from "./dataDeclarationTypeAliasTemplate";
import { dataDeclarationConstructorsTemplate } from "./dataDeclarationConstructorsTemplate";

export function dataDeclarationTemplate(decl: DataDeclaration): Interpolation { 
  return t.span(decl.span)(
    dataDeclarationTypeAliasTemplate(decl),
    t.newLine(),
    dataDeclarationConstructorsTemplate(decl),
  )
}