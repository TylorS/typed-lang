import { TypeClassDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";
import { typeTemplate } from "./typeTemplate.js";

export function typeClassDeclarationTemplate(
  decl: TypeClassDeclaration
): Interpolation {
  return t.many(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    t`interface `,
    t.identifier(decl.name),
    typeParametersTemplate(decl.typeParameters.flatMap(unwrapHkt), {
      parameterVariance: true,
      functionDefaultValue: false,
      constants: false,
    }),
    t` {`,
    t.newLine(),
    t.indent(
      t.intercolate(`,\n`)(
        ...decl.fields.map(({ name, value }) =>
          value
            ? t`${t.identifier(name)}: ${typeTemplate(value)}`
            : t.identifier(name)
        )
      )
    ),
    t.newLine(),
    t`}`
  );
}
