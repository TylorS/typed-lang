import { Span } from "../Span.js";
import { Destructure } from "./Declaration/VariableDeclaration.js";
import { Expression } from "./Expression.js";
import { Block } from "./Nodes/Block.js";
import { Identifier } from "./Nodes/Identifier.js";

export type ControlFlow =
  | IfStatement
  | WhileStatement
  | ForOfStatement
  | BreakStatement
  | ContinueStatement
  | ReturnStatement;

export class IfStatement {
  readonly _tag = "IfStatement";

  constructor(
    readonly ifBlock: IfBlock,
    readonly elseIfBlocks: ReadonlyArray<ElseIfBlock>,
    readonly elseBlock: ElseBlock | undefined,
    readonly span: Span
  ) {}
}

export class IfBlock {
  readonly _tag = "ElseIfBlock";

  constructor(
    readonly keyword: Span,
    readonly condition: Expression,
    readonly block: Block,
    readonly span: Span
  ) {}
}

export class ElseIfBlock {
  readonly _tag = "ElseIfBlock";

  constructor(
    readonly elseKeyword: Span,
    readonly ifKeyword: Span,
    readonly condition: Expression,
    readonly block: Block,
    readonly span: Span
  ) {}
}

export class ElseBlock {
  readonly _tag = "ElseBlock";

  constructor(
    readonly keyword: Span,
    readonly block: Block,
    readonly span: Span
  ) {}
}

export class WhileStatement {
  readonly _tag = "WhileStatement";

  constructor(
    readonly keyword: Span,
    readonly condition: Expression,
    readonly block: Block,
    readonly span: Span
  ) {}
}

export class ForOfStatement {
  readonly _tag = "ForOfStatement";

  constructor(
    readonly keyword: Span,
    readonly name: Identifier | Destructure,
    readonly iterable: Expression,
    readonly block: Block,
    readonly span: Span
  ) {}
}

export class BreakStatement {
  readonly _tag = "BreakStatement";

  constructor(readonly span: Span) {}
}

export class ContinueStatement {
  readonly _tag = "ContinueStatement";

  constructor(readonly span: Span) {}
}

export class ReturnStatement {
  readonly _tag = "ReturnStatement";

  constructor(
    readonly keyword: Span,
    readonly expression: Expression,
    readonly span: Span
  ) {}
}
