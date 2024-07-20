import { Span } from "../../Span.js";

export class NumericLiteralType {
  readonly _tag = "NumericLiteralType";

  constructor(readonly value: number, readonly span: Span) {}
}