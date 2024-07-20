import { Span } from "@typed-lang/parser/Span";

export type BuiltinType =
  | AnyType
  | BigIntType
  | BooleanType
  | DateType
  | FunctionKeywordType
  | NeverType
  | NullType
  | NumberType
  | ObjectType
  | StringType
  | SymbolType
  | UndefinedType
  | UnknownType
  | VoidType;

export class StringType {
  readonly _tag = "StringType";
  constructor(readonly span: Span) {}
}

export class NumberType {
  readonly _tag = "NumberType";
  constructor(readonly span: Span) {}
}

export class BooleanType {
  readonly _tag = "BooleanType";
  constructor(readonly span: Span) {}
}

export class NullType {
  readonly _tag = "NullType";
  constructor(readonly span: Span) {}
}

export class UndefinedType {
  readonly _tag = "UndefinedType";
  constructor(readonly span: Span) {}
}

export class VoidType {
  readonly _tag = "VoidType";
  constructor(readonly span: Span) {}
}

export class AnyType {
  readonly _tag = "AnyType";
  constructor(readonly span: Span) {}
}

export class NeverType {
  readonly _tag = "NeverType";
  constructor(readonly span: Span) {}
}

export class UnknownType {
  readonly _tag = "UnknownType";
  constructor(readonly span: Span) {}
}

export class SymbolType {
  readonly _tag = "SymbolType";
  constructor(readonly span: Span) {}
}

export class BigIntType {
  readonly _tag = "BigIntType";
  constructor(readonly span: Span) {}
}

export class ObjectType {
  readonly _tag = "ObjectType";
  constructor(readonly span: Span) {}
}

export class FunctionKeywordType {
  readonly _tag = "FunctionKeywordType";
  constructor(readonly span: Span) {}
}

export class DateType {
  readonly _tag = "DateType";
  constructor(readonly span: Span) {}
}
