import {
  DataConstructor,
  DataDeclaration,
  Identifier,
  TypeParameter,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields.js";

export function dataDeclarationGuardsTemplate(
  decl: DataDeclaration
): Interpolation {
  return t.span(decl.span)(
    t.intercolate(t.newLine(2))(
      ...decl.constructors.map((c) => constructorGuardTemplate(c, decl)),
      declarationGuardTemplate(decl)
    )
  );
}

function declarationGuardTemplate(decl: DataDeclaration): Interpolation {
  return t.span(decl.span)(
    t.namedImport(`@typed-lang/typedlib`, `hasProperty`),
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    t`const `,
    t.span(decl.name.span)(`is${capitalize(decl.name.text)}`),
    ` = `,
    t`(value: unknown): value is ${t.identifier(
      decl.name
    )}${typeParametersTemplate(
      decl.typeParameters.map(
        (param) =>
          new TypeParameter(
            new Identifier("unknown", param.name.span),
            param.constraint,
            param.span,
            param.variance
          )
      ),
      {
        parameterVariance: false,
        functionDefaultValue: false,
        constants: false,
      }
    )} => {`,
    t.newLine(),
    t.indent(
      t`if (!${t.import(
        "@typed-lang/typedlib",
        "hasProperty"
      )}(value, "_tag")) return false;`,
      t.newLine(),
      `switch (value._tag) {`,
      t.newLine(),
      t.indent(
        t.intercolate(t.newLine())(
          ...decl.constructors.map((c) => `case "${c.name.text}":`),
          t.indent(t`return true`),
          `default: return false;`
        )
      ),
      t.newLine(),
      `}`
    ),
    t.newLine(),
    `}`
  );
}

function constructorGuardTemplate(
  constructor: DataConstructor,
  decl: DataDeclaration
): Interpolation {
  const paramName = decl.name.text.toLowerCase();

  return t.span(constructor.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    t`const `,
    t.span(constructor.name.span)(`is${capitalize(constructor.name.text)}`),
    ` = `,
    typeParametersTemplate(decl.typeParameters, {
      parameterVariance: false,
      functionDefaultValue: true,
      constants: true,
    }),
    t`(${paramName}: ${t.identifier(decl.name)}${typeParametersTemplate(
      decl.typeParameters,
      {
        parameterVariance: false,
        functionDefaultValue: false,
        constants: false,
      }
    )}): `,
    t`${paramName} is ${t.identifier(constructor.name)}${typeParametersTemplate(
      getTypeParameters(constructor),
      {
        parameterVariance: false,
        functionDefaultValue: false,
        constants: false,
      }
    )}`,
    t` => `,
    t`${paramName}._tag === "${constructor.name.text}"`
  );
}

function getTypeParameters(constructor: DataConstructor): TypeParameter[] {
  switch (constructor._tag) {
    case "VoidConstructor":
      return [];
    case "TupleConstructor":
    case "RecordConstructor":
      return getTypeParametersFromFields(constructor.fields);
  }
}

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
