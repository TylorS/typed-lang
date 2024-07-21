import { Span } from "../Span.js";
import { Operator } from "./Nodes/Operator.js";
import { Identifier } from "./Nodes/Identifier.js";
import { Literal } from "./Nodes/Literal.js";
import { Type } from "./Type.js";
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
  | FunctionExpression;

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
    readonly dot: Span,
    readonly property: Identifier,
    readonly span: Span
  ) {}
}

export class FunctionExpression {
  readonly _tag = "FunctionExpression";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly parameters: ReadonlyArray<NamedField>,
    readonly returnType: Type | null,
    readonly block: Block,
    readonly span: Span,
    readonly exported: Span | null
  ) {}
}
