import { BrandDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";
import { typeTemplate } from "./typeTemplate";

export function brandDeclarationTemplate(
  decl: BrandDeclaration
): Interpolation {
  return t.span(decl.span)(
    t.namedImport("@typed-lang/typedlib", "Branded"),
    typeAliasTemplate({
      name: decl.name,
      types: [
        t`Branded<${typeTemplate(decl.type)}, "${t.identifier(decl.name)}">`,
      ],
      exported: decl.exported,
    })
  );
}
