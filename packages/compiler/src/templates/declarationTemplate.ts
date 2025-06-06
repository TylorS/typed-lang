import { Declaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { functionDeclarationTemplate } from "./functionDeclarationTemplate.js";
import { dataDeclarationTemplate } from "./dataDeclarationTemplate.js";
import { variableDeclarationTemplate } from "./variableDeclarationTemplate.js";
import { brandDeclarationTemplate } from "./brandDeclarationTemplate.js";
import { importDeclarationTemplate } from "./importDeclarationTemplate.js";
import { typeAliasDeclarationTemplate } from "./typeAliasDeclarationTemplate.js";
import { typeClassDeclarationTemplate } from "./typeClassDeclarationTemplate.js";
import { instanceDeclarationTemplate } from "./instanceDeclarationTemplate.js";
import { HktsByName } from "./typeTemplate.js";

export function declarationTemplate(decl: Declaration, hktsByName?: HktsByName): Interpolation {
  switch (decl._tag) {
    case "BrandDeclaration":
      return brandDeclarationTemplate(decl);
    case "Comment":
      return t.span(decl.span)(decl.text);
    case "DataDeclaration":
      return dataDeclarationTemplate(decl);
    case "FunctionDeclaration":
      return functionDeclarationTemplate(decl, hktsByName);
    case "ImportDeclaration":
      return importDeclarationTemplate(decl);
    case "TypeAliasDeclaration":
      return typeAliasDeclarationTemplate(decl, hktsByName);
    case "TypeClassDeclaration":
      return typeClassDeclarationTemplate(decl, hktsByName);
    case "VariableDeclaration":
      return variableDeclarationTemplate(decl, hktsByName);
    case "InstanceDeclaration":
      return instanceDeclarationTemplate(decl, hktsByName);
  }
}
