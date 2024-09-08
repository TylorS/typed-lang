import {
  DataConstructor,
  DataDeclaration,
  Field,
  Identifier,
  TypeParameter,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { interfaceTemplate } from "./interfaceTemplate.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields.js";

export function dataDeclarationTypeAliasTemplate(
  decl: DataDeclaration
): Interpolation {
  return [
    typeAliasTemplate({
      name: decl.name,
      types: decl.constructors.map(constructorTemplate),
      typeParams: decl.typeParameters,
      exported: decl.exported,
    }),
    t.newLine(2),
    t.intercolate(t.newLine(2))(
      decl.constructors.map((c) =>
        constructorInterfaceDeclarationTemplate(c, decl)
      )
    ),
    t.newLine(),
  ];
}

function constructorTemplate(constructor: DataConstructor): Interpolation {
  switch (constructor._tag) {
    case "VoidConstructor":
      return t.identifier(constructor.name);
    case "TupleConstructor":
    case "RecordConstructor":
      return t.span(constructor.span)(
        t.identifier(constructor.name),
        typeParametersTemplate(
          getTypeParametersFromFields(constructor.fields),
          {
            parameterVariance: false,
            functionDefaultValue: false,
            constants: false,
          }
        )
      );
  }
}

function constructorInterfaceDeclarationTemplate(
  constructor: DataConstructor,
  decl: DataDeclaration
): Interpolation {
  switch (constructor._tag) {
    case "VoidConstructor":
      return interfaceTemplate({
        name: constructor.name,
        span: constructor.span,
        fields: [[`_tag`, t`"${t.identifier(constructor.name)}"`]],
      });
    case "TupleConstructor":
    case "RecordConstructor":
      return interfaceTemplate({
        name: constructor.name,
        span: constructor.span,
        typeParams: getTypeParametersFromFields(constructor.fields).map(
          (typeParam) =>
            new TypeParameter(
              typeParam.name,
              typeParam.constraint,
              typeParam.span,
              typeParam.variance ??
                decl.typeParameters.find(
                  (tp) => tp.name.text === typeParam.name.text
                )?.variance
            )
        ),
        fields: [
          [`_tag`, t`"${t.identifier(constructor.name)}"`],
          ...constructor.fields.map((f) => {
            const name = getFieldName(f).toString();

            return [
              name,
              f.value === undefined ? name : typeTemplate(f.value),
            ] as const;
          }),
        ],
      });
  }
}

function getFieldName(field: Field): Identifier {
  switch (field._tag) {
    case "NamedField":
      return field.name;
    case "PositionalField":
      return new Identifier(`arg${field.index}`, field.span);
  }
}
