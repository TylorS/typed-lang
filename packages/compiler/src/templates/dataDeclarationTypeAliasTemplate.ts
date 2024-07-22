import {
  DataConstructor,
  DataDeclaration,
  Field,
  Identifier,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { getTypeParametersFromFields } from "../generators/shared/getTypeParametersFromFields.js";
import { typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { interfaceTemplate } from "./interfaceTemplate.js";
import { typeAliasTemplate } from "./typeAliasTemplate.js";

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
      decl.constructors.map(constructorInterfaceDeclarationTemplate)
    ),
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
        typeParametersTemplate(getTypeParametersFromFields(constructor.fields))
      );
  }
}

function constructorInterfaceDeclarationTemplate(
  constructor: DataConstructor
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
        typeParams: getTypeParametersFromFields(constructor.fields),
        fields: [
          [`_tag`, t`"${t.identifier(constructor.name)}"`],
          ...constructor.fields.map(
            (f) => [getFieldName(f), typeTemplate(f.value)] as const
          ),
        ],
      });
  }
}

function getFieldName(field: Field): string | Identifier {
  switch (field._tag) {
    case "NamedField":
      return field.name;
    case "PositionalField":
      return "arg" + field.index;
  }
}
