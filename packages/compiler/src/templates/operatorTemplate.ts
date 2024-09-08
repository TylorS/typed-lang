import { Operator, OperatorKind } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";

export function operatorTemplate(operator: Operator): Interpolation {
  return t.span(operator.span)(operatorKindToText(operator.kind));
}

function operatorKindToText(kind: OperatorKind): string {
  switch (kind) {
    case OperatorKind.Add:
      return "+";
    case OperatorKind.And:
      return "&&";
    case OperatorKind.BitwiseAnd:
      return "&";
    case OperatorKind.BitwiseNot:
      return "~";
    case OperatorKind.BitwiseOr:
      return "|";
    case OperatorKind.BitwiseXor:
      return "^";
    case OperatorKind.Divide:
      return "/";
    case OperatorKind.Equal:
      return "=";
    case OperatorKind.EqualEqual:
      return "==";
    case OperatorKind.EqualEqualEqual:
      return "===";
    case OperatorKind.Exponent:
      return "**";
    case OperatorKind.GreaterThan:
      return ">";
    case OperatorKind.GreaterThanOrEqual:
      return ">=";
    case OperatorKind.LeftShift:
      return "<<";
    case OperatorKind.LessThan:
      return "<";
    case OperatorKind.LessThanOrEqual:
      return "<=";
    case OperatorKind.Modulo:
      return "%";
    case OperatorKind.Multiply:
      return "*";
    case OperatorKind.Not:
      return "!";
    case OperatorKind.NotEqual:
      return "!=";
    case OperatorKind.NotEqualEqual:
      return "!=="; 
    case OperatorKind.Or:
      return "||";
    case OperatorKind.RightShift:
      return ">>";
    case OperatorKind.Subtract:
      return "-";
    case OperatorKind.UnsignedRightShift:
      return ">>>";
    case OperatorKind.TernaryIf:
      return "?";
    case OperatorKind.TernaryElse:
      return ":";
    case OperatorKind.NullishCoalescing:
      return "??";
    case OperatorKind.OptionalChaining:
      return "?.";
    case OperatorKind.InstanceOf:
      return "instanceof";
    case OperatorKind.In:
      return "in";
    case OperatorKind.LogicalAnd:
      return "&&";
  }
}
