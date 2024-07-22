import { ImportDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";

export function importDeclarationTemplate(
  decl: ImportDeclaration
): Interpolation {
  switch (decl.imports._tag) {
    case "NamedImports":
      return t.span(decl.span)(
        t`import { `,
        t.intercolate(`, `)(
          decl.imports.imports.map((i) =>
            i.alias
              ? t`${t.identifier(i.name)} as ${t.identifier(i.alias)}`
              : t.identifier(i.name)
          )
        ),
        t` } from `,
        t.span(decl.moduleSpecifier.span)(`${decl.moduleSpecifier.value}`)
      );
    case "NamespaceImport":
      return t.span(decl.span)(
        t`import * as `,
        t.identifier(decl.imports.name),
        t` from `,
        t.span(decl.moduleSpecifier.span)(`${decl.moduleSpecifier.value}`)
      );
  }
}
