import { Identifier, Span, TypeParameter } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";

export function interfaceTemplate({
  name,
  span,
  typeParams = [],
  fields = [],
}: {
  readonly name: Identifier;
  readonly span: Span;
  readonly typeParams?: readonly TypeParameter[];
  readonly fields?: readonly InterfaceField[];
}): Interpolation {
  return t.span(span)(
    t`export interface ${t.identifier(name)}`,
    typeParametersTemplate(typeParams),
    t` {`,
    t.ident(
      t.newLine(),
      t.intercolate(t.newLine())(
        fields.map(([name, type]) =>
          typeof name === "string"
            ? t`readonly ${name}: ${type}`
            : t`readonly ${t.identifier(name)}: ${type}`
        )
      )
    ),
    t.newLine(),
    t`}`
  );
}

type InterfaceField = readonly [string | Identifier, Interpolation];
