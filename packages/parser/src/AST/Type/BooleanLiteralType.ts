import { Span } from "../../Span.js";

export class BooleanLiteralType {
  readonly _tag = "BooleanLiteralType";

  constructor(readonly value: boolean, readonly span: Span) {}
}
