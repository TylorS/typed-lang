import { ArrayType } from "./Type/ArrayType.js";
import { BooleanLiteralType } from "./Type/BooleanLiteralType.js";
import { BrandedType } from "./Type/BrandedType.js";
import { BuiltinType } from "./Type/BuiltInTypes.js";
import { FunctionType } from "./Type/FunctionType.js";
import { HigherKindedType } from "./Type/HigherKindedType.js";
import { MapType } from "./Type/MapType.js";
import { NumericLiteralType } from "./Type/NumericLiteralType.js";
import { RecordType } from "./Type/RecordType.js";
import { SetType } from "./Type/SetType.js";
import { StringLiteralType } from "./Type/StringLiteralType.js";
import { TupleType } from "./Type/TupleType.js";
import { TypeReference } from "./Type/TypeReference.js";

export type Type =
  | ArrayType
  | BooleanLiteralType
  | BrandedType
  | BuiltinType
  | FunctionType
  | HigherKindedType
  | MapType
  | NumericLiteralType
  | RecordType
  | SetType
  | StringLiteralType
  | TupleType
  | TypeReference;

