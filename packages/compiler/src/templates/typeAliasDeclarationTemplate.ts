import { TypeAliasDeclaration } from "@typed-lang/parser";
import { Interpolation } from "../Template.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";
import { typeTemplate } from "./typeTemplate.js";

export function typeAliasDeclarationTemplate(
  decl: TypeAliasDeclaration
): Interpolation {
  return typeAliasTemplate({
    name: decl.name,
    typeParams: decl.typeParameters,
    types: [typeTemplate(decl.type)],
    exported: decl.exported,
  });
}
