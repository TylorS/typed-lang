import { Declaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { functionDeclarationTemplate } from "./functionDeclarationTemplate.js";
import { dataDeclarationTemplate } from "./dataDeclarationTemplate.js";
import { variableDeclarationTemplate } from "./variableDeclarationTemplate.js";
import { brandDeclarationTemplate } from "./brandDeclarationTemplate.js";
import { importDeclarationTemplate } from "./importDeclarationTemplate.js";
import { typeAliasDeclarationTemplate } from "./typeAliasDeclarationTemplate.js";
import { typeClassDeclarationTemplate } from "./typeClassDeclarationTemplate.js";

export function declarationTemplate(decl: Declaration): Interpolation {
  switch (decl._tag) {
    case "BrandDeclaration":
      return brandDeclarationTemplate(decl);
    case "Comment":
      return t.span(decl.span)(decl.text);
    case "DataDeclaration":
      return dataDeclarationTemplate(decl);
    case "FunctionDeclaration":
      return functionDeclarationTemplate(decl);
    case "ImportDeclaration":
      return importDeclarationTemplate(decl);
    case "TypeAliasDeclaration":
      return typeAliasDeclarationTemplate(decl);
    case "TypeClassDeclaration":
      return typeClassDeclarationTemplate(decl);
    case "VariableDeclaration":
      return variableDeclarationTemplate(decl);
  }
}
