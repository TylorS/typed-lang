import {
  BrandedType,
  FunctionType,
  HigherKindedType,
  RecordType,
  RestType,
  TupleType,
  Type,
  TypeReference,
} from "@typed-lang/parser";
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
      return t.span(type.span)(
        t`ReadonlyMap<${typeTemplate(type.key)}, ${typeTemplate(type.value)}>`
      );
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
      return brandedTypeTemplate(type);
    case "FunctionType":
      return functionTypeTemplate(type);
    case "HigherKindedType":
      return higherKindedTypeTemplate(type);
    case "RecordType":
      return recordTypeTemplate(type);
    case "RestType":
      return restTypeTemplate(type);
    case "TupleType":
      return tupleTypeTemplate(type);
    default:
      throw new Error(`Unhandled type: ${JSON.stringify(type, null, 2)}`);
  }
}

function typeReferenceTemplate(type: TypeReference): Interpolation {
  return t.span(type.span)(
    t`${identiferOrPropertyAccess(type.name)}${typeArgumentsTemplate(
      type.typeArguments
    )}`
  );
}

function brandedTypeTemplate(type: BrandedType): Interpolation {
  return t.span(type.span)(t``);
}

function functionTypeTemplate(type: FunctionType): Interpolation {
  return t.span(type.span)(t``);
}

function higherKindedTypeTemplate(type: HigherKindedType): Interpolation {
  return t.span(type.span)(t``);
}

function recordTypeTemplate(type: RecordType): Interpolation {
  return t.span(type.span)(t``);
}

function restTypeTemplate(type: RestType): Interpolation {
  return t.span(type.span)(t``);
}

function tupleTypeTemplate(type: TupleType): Interpolation {
  return t.span(type.span)(t``);
}

export function typeArgumentsTemplate(
  typeArguments: ReadonlyArray<Type>
): Interpolation {
  if (typeArguments.length === 0) {
    return "";
  }
  return t`<${typeArguments.map(typeTemplate)}>`;
}
