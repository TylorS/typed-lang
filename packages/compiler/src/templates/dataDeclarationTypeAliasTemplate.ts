import {
  DataConstructor,
  DataDeclaration,
  Field,
  Identifier,
  PropertyAccess,
  RecordConstructor,
  TupleConstructor,
  Type,
  TypeParameter,
  TypeReference,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { getTypeParametersFromFields } from "../generators/shared/getTypeParametersFromFields.js";

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
      t.intercolate(t.newLine())(decl.constructors.map(constructorTemplate))
    ),
    t.newLine(2),
    t.intercolate(t.newLine(2))(
      decl.constructors.map(constructorInterfaceDeclarationTemplate)
    )
  );
}

function typeParametersTemplate(
  typeParameters: ReadonlyArray<TypeParameter>
): Interpolation {
  if (typeParameters.length === 0) {
    return "";
  }
  return t`<${typeParameters.map(typeParameterTemplate)}>`;
}

function typeParameterTemplate(typeParameter: TypeParameter): Interpolation {
  return t.span(typeParameter.span)`${typeParameter.name.text}`;
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
  return t`| ${t.span(constructor.name.span)`${constructor.name.text}`}`;
}

function fieldsConstructorTemplate(
  constructor: TupleConstructor | RecordConstructor
): Interpolation {
  return t`| ${t.span(
    constructor.name.span
  )`${constructor.name.text}`}${typeParametersTemplate(
    getTypeParametersFromFields(constructor.fields)
  )}`;
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
  return t.span(constructor.span)(
    t`export interface ${t.identifier(constructor.name)} {`,
    t.ident(t.newLine(), t`readonly _tag: "${constructor.name.text}";`),
    t.newLine(),
    t`}`,
  );
}

function fieldsConstructorInterfaceDeclarationTemplate(
  constructor: TupleConstructor | RecordConstructor
): Interpolation {
  return t.span(constructor.span)(
    t`export interface `,
    t.identifier(constructor.name),
    t`${typeParametersTemplate(
      getTypeParametersFromFields(constructor.fields)
    )} {`,
    t.ident(
      t.newLine(),
      t`readonly _tag: "${constructor.name.text}"`,
      t.newLine(),
      t.intercolate(t.newLine())(
        ...constructor.fields.map(
          (f) =>
            t`readonly ${getFieldName(f)}: ${typeTemplate(f.value)}`
        )
      )
    ),
    t.newLine(),
    t`}`,
    t.newLine()
  );
}

function getFieldName(field: Field): string {
  switch (field._tag) {
    case "NamedField":
      return field.name.text;
    case "PositionalField":
      return "arg" + field.index;
  }
}

function typeTemplate(type: Type): Interpolation {
  switch (type._tag) {
    case "AnyType":
      return t`any`;
    case "ArrayType":
      return t`ReadonlyArray<${typeTemplate(type.element)}>`;
    case "BooleanType":
      return t`boolean`;
    case "BigIntType":
      return t`bigint`;
    case "BooleanLiteralType":
      return t`${String(type.value)}`;
    case "DateType":
      return t`Date`;
    case "FunctionKeywordType":
      return t`Function`;
    case "MapType":
      return t`ReadonlyMap<${typeTemplate(type.key)}, ${typeTemplate(
        type.value
      )}>`;
    case "NeverType":
      return t`never`;
    case "NullType":
      return t`null`;
    case "NumberType":
      return t`number`;
    case "NumericLiteralType":
      return t`${String(type.value)}`;
    case "ObjectType":
      return t`object`;
    case "SetType":
      return t`ReadonlySet<${typeTemplate(type.value)}>`;
    case "StringType":
      return t`string`;
    case "StringLiteralType":
      return t`${JSON.stringify(type.text)}`;
    case "SymbolType":
      return t`symbol`;
    case "TypeReference":
      return typeReferenceTemplate(type);
    case "UndefinedType":
      return t`undefined`;
    case "UnknownType":
      return t`unknown`;
    case "VoidType":
      return t`void`;
    case "BrandedType":
    case "FunctionType":
    case "HigherKindedType":
    case "RecordType":
    case "RestType":
    case "TupleType":
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
}

function typeReferenceTemplate(type: TypeReference): Interpolation {
  return t`${identiferOrPropertyAccess(type.name)}${typeArgumentsTemplate(
    type.typeArguments
  )}`;
}

function identiferOrPropertyAccess(ident: Identifier | PropertyAccess): Interpolation {
  switch (ident._tag) {
    case "Identifier":
      return t.identifier(ident);
    case "PropertyAccess":
      return t`${ident.left.text + "."}${identiferOrPropertyAccess(ident.right)}`;
  }
}

function typeArgumentsTemplate(
  typeArguments: ReadonlyArray<Type>
): Interpolation {
  if (typeArguments.length === 0) {
    return "";
  }
  return t`<${typeArguments.map(typeTemplate)}>`;
}
