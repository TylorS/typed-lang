import { BrandDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";
import { typeTemplate } from "./typeTemplate.js";

export function brandDeclarationTemplate(
  decl: BrandDeclaration
): Interpolation {
  const Branded = t.import("@typed-lang/typedlib", "Branded");

  return t.span(decl.span)(
    Branded.asNamedImport(),
    typeAliasTemplate({
      name: decl.name,
      types: [
        t`${Branded}<${typeTemplate(decl.type)}, "${t.identifier(decl.name)}">`,
      ],
      exported: decl.exported,
    }),
    t.newLine(),
    decl.exported ? t.span(decl.exported)`export ` : t``,
    t`const ${t.identifier(decl.name)} = ${Branded}<${t.identifier(decl.name)}>()`
  );
}
