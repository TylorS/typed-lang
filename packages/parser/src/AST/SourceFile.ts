import { Span } from "../Span.js";
import { Declaration } from "./Declaration.js";

export class SourceFile {
  readonly _tag = "SourceFile";

  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly declarations: readonly Declaration[],
    readonly span: Span
  ) {}
}
