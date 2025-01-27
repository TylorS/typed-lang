import { Span } from "../Span.js";
import { Operator } from "./Nodes/Operator.js";
import { Identifier } from "./Nodes/Identifier.js";
import { Literal } from "./Nodes/Literal.js";
import { HigherKindedType, Type } from "./Type.js";
import { TypeParameter } from "./Nodes/TypeParameter.js";
import { NamedField } from "./Nodes/Field.js";
import { Block } from "./Nodes/Block.js";

export type Expression =
  | UnaryExpression
  | BinaryExpression
  | FunctionCall
  | Identifier
  | Literal
  | ParenthesizedExpression
  | MemberExpression
  | FunctionExpression
  | MatchExpression;

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
    readonly right: Expression,
    readonly span: Span
  ) {}
}

export class FunctionCall {
  readonly _tag = "FunctionCall";

  constructor(
    readonly callee: Expression,
    readonly typeArguments: readonly Type[],
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
    readonly questionMark: Span | null,
    readonly dot: Span,
    readonly property: Identifier,
    readonly span: Span
  ) {}
}

export class FunctionExpression {
  readonly _tag = "FunctionExpression";

  constructor(
    readonly name: Identifier | null,
    readonly typeParameters: ReadonlyArray<TypeParameter | HigherKindedType>,
    readonly parameters: ReadonlyArray<NamedField>,
    readonly returnType: Type | null,
    readonly block: Block | Expression,
    readonly span: Span
  ) {}
}

export class MatchExpression {
  readonly _tag = "MatchExpression";

  constructor(
    readonly matching: Expression,
    readonly cases: readonly MatchCase[],
    readonly span: Span
  ) {}
}

export class MatchCase {
  readonly _tag = "MatchCase";

  constructor(
    readonly pattern: Pattern,
    readonly body: Block | Expression,
    readonly span: Span
  ) {}
}

export type Pattern = Identifier | Literal | ArrayPattern;

export class ArrayPattern {
  readonly _tag = "ArrayPattern";

  constructor(readonly elements: readonly Pattern[], readonly span: Span) {}
}
