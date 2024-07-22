import { Type, TypeReference } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { identiferOrPropertyAccess } from "./identifierOrPropertyAccessTemplate.js";

export function typeTemplate(type: Type): Interpolation {
  switch (type._tag) {
    case "AnyType":
      return t.span(type.span)(`any`);
    case "ArrayType":
      return t.span(type.span)(t`ReadonlyArray<${typeTemplate(type.element)}>`);
    case "BooleanType":
      return t.span(type.span)(t`boolean`);
    case "BigIntType":
      return t.span(type.span)(t`bigint`);
    case "BooleanLiteralType":
      return t.span(type.span)(t`${String(type.value)}`);
    case "DateType":
      return t.span(type.span)(t`Date`);
    case "FunctionKeywordType":
      return t.span(type.span)(t`Function`);
    case "MapType":
      return t.span(type.span)(t`ReadonlyMap<${typeTemplate(type.key)}, ${typeTemplate(
        type.value
      )}>`);
    case "NeverType":
      return t.span(type.span)(t`never`);
    case "NullType":
      return t.span(type.span)(t`null`);
    case "NumberType":
      return t.span(type.span)(t`number`);
    case "NumericLiteralType":
      return t.span(type.span)(t`${String(type.value)}`);
    case "ObjectType":
      return t.span(type.span)(t`object`);
    case "SetType":
      return t.span(type.span)(t`ReadonlySet<${typeTemplate(type.value)}>`);
    case "StringType":
      return t.span(type.span)(t`string`);
    case "StringLiteralType":
      return t.span(type.span)(t`${JSON.stringify(type.text)}`);
    case "SymbolType":
      return t.span(type.span)(t`symbol`);
    case "TypeReference":
      return typeReferenceTemplate(type);
    case "UndefinedType":
      return t.span(type.span)(t`undefined`);
    case "UnknownType":
      return t.span(type.span)(t`unknown`);
    case "VoidType":
      return t.span(type.span)(t`void`);
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
  return t.span(type.span)(t`${identiferOrPropertyAccess(type.name)}${typeArgumentsTemplate(
    type.typeArguments
  )}`);
}

export function typeArgumentsTemplate(
  typeArguments: ReadonlyArray<Type>
): Interpolation {
  if (typeArguments.length === 0) {
    return "";
  }
  return t`<${typeArguments.map(typeTemplate)}>`;
}
