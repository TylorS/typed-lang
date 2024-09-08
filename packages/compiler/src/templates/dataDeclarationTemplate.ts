import { DataDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { dataDeclarationTypeAliasTemplate } from "./dataDeclarationTypeAliasTemplate";
import { dataDeclarationConstructorsTemplate } from "./dataDeclarationConstructorsTemplate";
import { dataDeclarationGuardsTemplate } from "./dataDeclarationGuardsTemplate.js";
import { dataDeclarationMatchTemplate } from "./dataDeclarationMatchTemplate.js";

export function dataDeclarationTemplate(decl: DataDeclaration): Interpolation { 
  return t.span(decl.span)(
    dataDeclarationTypeAliasTemplate(decl),
    t.newLine(),
    dataDeclarationConstructorsTemplate(decl),
    t.newLine(2),
    dataDeclarationGuardsTemplate(decl),
    t.newLine(2),
    dataDeclarationMatchTemplate(decl)
  )
}