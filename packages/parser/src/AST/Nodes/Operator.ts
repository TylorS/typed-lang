import { Span } from "../../Span.js";

export enum OperatorKind {
  Add = "Add",
  Subtract = "Subtract",
  Multiply = "Multiply",
  Divide = "Divide",
  Exponent = "Exponent",
  Modulo = "Modulo",
  Equal = "Equal",
  NotEqual = "NotEqual",
  LessThan = "LessThan",
  LessThanOrEqual = "LessThanOrEqual",
  GreaterThan = "GreaterThan",
  GreaterThanOrEqual = "GreaterThanOrEqual",
  And = "And",
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