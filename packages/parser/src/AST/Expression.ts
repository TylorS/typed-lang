import { Span } from "../Span.js";
import { Operator } from "./Nodes/Operator.js";
import { Identifier } from "./Nodes/Identifier.js";
import { Literal } from "./Nodes/Literal.js";
import { TypeReference } from "./Type/TypeReference.js";

export type Expression =
  | UnaryExpression
  | BinaryExpression
  | FunctionCall
  | Identifier
  | Literal
  | ParenthesizedExpression
  | MemberExpression

export class UnaryExpression { 
  readonly _tag = "UnaryExpression";

  constructor(
    readonly operator: Operator,
    readonly argument: Expression,
    readonly span: Span
  ) {}
}

export class BinaryExpression {
  readonly _tag = "BinaryExpression";

  constructor(
    readonly operator: Operator,
    readonly left: Expression,
    readonly right: Expression
  ) {}
}

export class FunctionCall {
  readonly _tag = "FunctionCall";

  constructor(
    readonly callee: Expression,
    readonly typeArguments: readonly TypeReference[],
    readonly parameters: readonly Expression[],
    readonly span: Span
  ) {}
}

export class ParenthesizedExpression {
  readonly _tag = "ParenthesizedExpression";

  constructor(
    readonly openParen: Span,
    readonly expression: Expression,
    readonly closeParen: Span,
    readonly span: Span
  ) {}
}

export class MemberExpression {
  readonly _tag = "MemberExpression";

  constructor(
    readonly object: Expression,
    readonly dot: Span,
    readonly property: Identifier
  ) {}
}