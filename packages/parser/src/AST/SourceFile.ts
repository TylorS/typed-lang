import { Span } from "../Span.js";
import { Statement } from "./Statement.js";

export class SourceFile {
  readonly _tag = "SourceFile";

  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly statements: readonly Statement[],
    readonly span: Span
  ) {}
}