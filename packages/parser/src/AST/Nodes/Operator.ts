import { Span } from "../../Span.js";

export enum OperatorKind {
  Add = "Add",
  Subtract = "Subtract",
  Multiply = "Multiply",
  Divide = "Divide",
  Exponent = "Exponent",
  Modulo = "Modulo",
  Equal = "Equal",
  EqualEqual = "EqualEqual",
  EqualEqualEqual = "EqualEqualEqual",
  NotEqual = "NotEqual",
  NotEqualEqual = "NotEqualEqual",
  LessThan = "LessThan",
  LessThanOrEqual = "LessThanOrEqual",
  GreaterThan = "GreaterThan",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  And = "And",
  LogicalAnd = "LogicalAnd",
  Or = "Or",
  Not = "Not",
  BitwiseAnd = "BitwiseAnd",
  BitwiseOr = "BitwiseOr",
  BitwiseXor = "BitwiseXor",
  BitwiseNot = "BitwiseNot",
  LeftShift = "LeftShift",
  RightShift = "RightShift",
  UnsignedRightShift = "UnsignedRightShift",
}

export class Operator {
  readonly _tag = "Operator";

  constructor(public kind: OperatorKind, readonly span: Span) {}
}
