import { Identifier, Span, TypeParameter } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";

export function typeAliasTemplate(params: {
  readonly name: Identifier;
  readonly types: readonly Interpolation[];
  readonly typeParams?: ReadonlyArray<TypeParameter>;
  readonly exported?: Span;
}): ReadonlyArray<Interpolation> {
  return [
    params.exported ? t`${t.span(params.exported)(`export`)} ` : ``,
    `type `,
    t.identifier(params.name),
    params.typeParams ? typeParametersTemplate(params.typeParams) : ``,
    ` =`,
    params.types.length === 1
      ? [` `, params.types[0]]
      : t.ident(
          t.newLine(),
          `| `,
          t.intercolate([t.newLine(), `| `])(params.types)
        ),
  ];
}
