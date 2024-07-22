import {
  DataConstructor,
  DataDeclaration,
  Field,
  Span,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields.js";

export function dataDeclarationConstructorsTemplate(
  decl: DataDeclaration
): Interpolation {
  return t.intercolate(t.newLine(2))(
    decl.constructors.map((c) => constructorTemplate(c, decl.exported))
  );
}

function constructorTemplate(
  constructor: DataConstructor,
  exported: Span | undefined
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return t.span(constructor.span)(
        exported ? t`${t.span(exported)(`export`)} ` : "",
        t`const `,
        t.identifier(constructor.name),
        t`: `,
        t.identifier(constructor.name),
        t` = { _tag: "${t.identifier(constructor.name)}" }`
      );
    case "TupleConstructor":
      return t.span(constructor.span)(
        exported ? t`${t.span(exported)(`export`)} ` : "",
        t`const `,
        t.identifier(constructor.name),
        t` = `,
        typeParametersTemplate(getTypeParametersFromFields(constructor.fields)),
        t`(`,
        t.intercolate(`, `)(
          constructor.fields.map(
            (f) => t`${getFieldName(f)}: ${typeTemplate(f.value)}`
          )
        ),
        t`): `,
        t.identifier(constructor.name),
        typeParametersTemplate(getTypeParametersFromFields(constructor.fields)),
        t` => ({`,
        t.ident(
          t.newLine(),
          t`_tag: "${t.identifier(constructor.name)}",`,
          t.newLine(),
          t.intercolate([",", t.newLine()])(
            ...constructor.fields.map(getFieldName)
          )
        ),
        t.newLine(),
        t`})`
      );
    case "RecordConstructor":
      return t.span(constructor.span)(
        exported ? t`${t.span(exported)(`export`)} ` : "",
        `const `,
        t.identifier(constructor.name),
        ` = `,
        typeParametersTemplate(getTypeParametersFromFields(constructor.fields)),
        t`(`,
        t.intercolate(`, `)(
          constructor.fields.map(
            (f) => t`${getFieldName(f)}: ${typeTemplate(f.value)}`
          )
        ),
        `): `,
        t.identifier(constructor.name),
        typeParametersTemplate(getTypeParametersFromFields(constructor.fields)),
        ` => ({`,
        t.ident(
          t.newLine(),
          t`_tag: "${t.identifier(constructor.name)}"`,
          constructor.fields.length > 0 ? [t`,`, t.newLine()] : t``,
          t.intercolate([",", t.newLine()])(
            constructor.fields.map(
              (f) => t`${t.identifier(f.name)}: ${getFieldName(f)}`
            )
          )
        ),
        t.newLine(),
        t`})`
      );
  }
}

function getFieldName(field: Field): Interpolation {
  if (field._tag === "NamedField") {
    return t.identifier(field.name);
  } else {
    return t`arg${String(field.index)}`;
  }
}
