import { Span } from "../../Span.js";

export class Identifier {
  readonly _tag = "Identifier";

  constructor(
    readonly name: string,
    readonly span: Span
  ) {}
}