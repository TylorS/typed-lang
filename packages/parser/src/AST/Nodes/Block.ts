import { Span } from "../../Span.js";
import { Expression } from "../Expression.js";
import { Statement } from "../Statement.js";

export class Block {
  readonly _tag = "Block";

  constructor(
    readonly statements: ReadonlyArray<Statement | ReturnStatement>,
    readonly span: Span
  ) {}
}

export class ReturnStatement {
  readonly _tag = "ReturnStatement";

  constructor(readonly keyword: Span, readonly expression: Expression) {}
}
