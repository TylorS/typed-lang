import { Span } from "../../Span.js";
import { Statement } from "../Statement.js";

export class Block {
  readonly _tag = "Block";

  constructor(
    readonly statements: ReadonlyArray<Statement>,
    readonly span: Span
  ) {}
}
