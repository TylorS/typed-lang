import {
  DataConstructor,
  DataDeclaration,
  Field,
  Identifier,
  RecordConstructor,
  TupleConstructor,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { getTypeParametersFromFields } from "../generators/shared/getTypeParametersFromFields.js";
import { typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { interfaceTemplate } from "./interfaceTemplate.js";

export function dataDeclarationTypeAliasTemplate(
  decl: DataDeclaration
): Interpolation {
  return t.span(decl.span)(
    `export type `,
    t.identifier(decl.name),
    typeParametersTemplate(decl.typeParameters),
    ` =`,
    t.ident(
      t.newLine(),
      t.intercolate(t.newLine())(...decl.constructors.map(constructorTemplate))
    ),
    t.newLine(2),
    t.intercolate(t.newLine(2))(
      decl.constructors.map(constructorInterfaceDeclarationTemplate)
    ),
    t.newLine()
  );
}

function constructorTemplate(constructor: DataConstructor): Interpolation {
  switch (constructor._tag) {
    case "VoidConstructor":
      return voidConstructorTemplate(constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return fieldsConstructorTemplate(constructor);
  }
}

function voidConstructorTemplate(constructor: DataConstructor): Interpolation {
  return t.span(constructor.span)(t`| ${t.identifier(constructor.name)}`);
}

function fieldsConstructorTemplate(
  constructor: TupleConstructor | RecordConstructor
): Interpolation {
  return t.span(constructor.span)(
    t`| `,
    t.identifier(constructor.name),
    typeParametersTemplate(getTypeParametersFromFields(constructor.fields))
  );
}

function constructorInterfaceDeclarationTemplate(
  constructor: DataConstructor
): Interpolation {
  switch (constructor._tag) {
    case "VoidConstructor":
      return voidConstructorInterfaceDeclarationTemplate(constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return fieldsConstructorInterfaceDeclarationTemplate(constructor);
  }
}

function voidConstructorInterfaceDeclarationTemplate(
  constructor: DataConstructor
): Interpolation {
  return interfaceTemplate({
    name: constructor.name,
    span: constructor.span,
    fields: [[`_tag`, t`"${t.identifier(constructor.name)}"`]],
  });
}

function fieldsConstructorInterfaceDeclarationTemplate(
  constructor: TupleConstructor | RecordConstructor
): Interpolation {
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

function getFieldName(field: Field): string | Identifier {
  switch (field._tag) {
    case "NamedField":
      return field.name;
    case "PositionalField":
      return "arg" + field.index;
  }
}
