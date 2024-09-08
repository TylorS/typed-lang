import {
  DataConstructor,
  DataDeclaration,
  TypeParameter,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template";
import {
  typeParametersTemplate,
  typeParameterTemplate,
} from "./typeParametersTemplate";
import { unwrapHkt } from "./unwrapHKT";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields";

export function dataDeclarationMatchTemplate(
  decl: DataDeclaration
): Interpolation {
  const paramName = decl.name.text.toLowerCase();
  const typeParams = decl.typeParameters.flatMap(unwrapHkt);
  const typeParamsForReturnTypes = Array.from(
    { length: decl.constructors.length },
    (_, i) => `Return${i + 1}`
  );

  return t.span(decl.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    `function match`,
    t`<${t.intercolate(", ")(
      ...typeParams.map((typeParam) =>
        typeParameterTemplate(typeParam, {
          parameterVariance: false,
          functionDefaultValue: false,
          constants: false,
        })
      ),
      ...typeParamsForReturnTypes.map((typeParam) => `const ${typeParam}`)
    )}>`,
    t`(`,
    t`${paramName}: ${t.identifier(decl.name)}${typeParametersTemplate(
      decl.typeParameters,
      {
        parameterVariance: false,
        functionDefaultValue: false,
        constants: false,
      }
    )}, `,
    t`matchers: {`,
    t.newLine(),
    t.indent(
      t.intercolate(",\n")(
        ...decl.constructors.map((ctor, i) =>
          matcherTemplate(ctor, typeParamsForReturnTypes[i])
        )
      )
    ),
    t.newLine(),
    t`}`,
    t`): ${t.intercolate(" | ")(...typeParamsForReturnTypes)} {`,
    t.newLine(),
    t.indent(t`return ;(matchers as any)[${paramName}._tag](${paramName})`),
    t.newLine(),
    t`}`
  );
}

function matcherTemplate(
  ctor: DataConstructor,
  returnType: string
): Interpolation {
  const paramName = ctor.name.text.toLowerCase();

  return t.many(
    t`${t.identifier(ctor.name)}: (`,
    t`${paramName}: `,
    t.identifier(ctor.name),
    typeParametersTemplate(getTypeParameters(ctor), {
      parameterVariance: false,
      functionDefaultValue: false,
      constants: false,
    }),
    t`) => `,
    t`${returnType}`
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
