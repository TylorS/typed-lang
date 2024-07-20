import { Span } from "../../Span.js";
import { Expression } from "../Expression.js";
import { Identifier } from "./Identifier.js";

export type Literal =
  | StringLiteral
  | NumberLiteral
  | BooleanLiteral
  | ArrayLiteral
  | RecordLiteral
  | NullLiteral
  | UndefinedLiteral

export class StringLiteral {
  readonly _tag = "StringLiteral";

  constructor(readonly value: string, readonly span: Span) {}
}

export class NumberLiteral {
  readonly _tag = "NumberLiteral";

  constructor(readonly value: number, readonly span: Span) {}
}

export class BooleanLiteral {
  readonly _tag = "BooleanLiteral";

  constructor(readonly value: boolean, readonly span: Span) {}
}

export class ArrayLiteral {
  readonly _tag = "ArrayLiteral";

  constructor(readonly values: readonly Expression[], readonly span: Span) {}
}

export class RecordLiteral {
  readonly _tag = "RecordLiteral";

  constructor(readonly fields: readonly RecordField[], readonly span: Span) {}
}

export class RecordField {
  readonly _tag = "RecordField";

  constructor(
    readonly name: Identifier,
    readonly value: Expression,
    readonly span: Span
  ) {}
}

export class NullLiteral {
  readonly _tag = "NullLiteral";

  constructor(readonly span: Span) {}
}

export class UndefinedLiteral {
  readonly _tag = "UndefinedLiteral";

  constructor(readonly span: Span) {}
}