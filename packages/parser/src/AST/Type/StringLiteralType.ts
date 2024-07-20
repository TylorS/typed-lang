import { Span } from "../../Span.js";

export class StringLiteralType {
  readonly _tag = "StringLiteralType";

  constructor(readonly text: string, readonly span: Span) {}
}