import { Type, TypeReference } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { identiferOrPropertyAccess } from "./identifierOrPropertyAccessTemplate.js";

export function typeTemplate(type: Type): Interpolation {
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

export function typeArgumentsTemplate(
  typeArguments: ReadonlyArray<Type>
): Interpolation {
  if (typeArguments.length === 0) {
    return "";
  }
  return t`<${typeArguments.map(typeTemplate)}>`;
}
