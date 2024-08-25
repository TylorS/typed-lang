import { Span } from "../../Span.js";

export class Identifier {
  readonly _tag = "Identifier";

  constructor(
    readonly text: string,
    readonly span: Span
  ) { }
  
  toString() {
    return this.text;
  }
}