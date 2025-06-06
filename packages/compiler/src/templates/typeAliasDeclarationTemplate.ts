import { TypeAliasDeclaration } from "@typed-lang/parser";
import { Interpolation } from "../Template.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";
import { HktsByName, typeTemplate } from "./typeTemplate.js";

export function typeAliasDeclarationTemplate(
  decl: TypeAliasDeclaration,
  hktsByName?: HktsByName
): Interpolation {
  return typeAliasTemplate({
    name: decl.name,
    typeParams: decl.typeParameters,
    types: [typeTemplate(decl.type, hktsByName)],
    exported: decl.exported,
  });
}
