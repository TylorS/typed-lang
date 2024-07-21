import { Span } from "../../Span.js";
import { Expression } from "../Expression.js";
import { Identifier } from "../Nodes/Identifier.js";
import { Type } from "../Type.js";

export class VariableDeclaration {
  readonly _tag = "VariableDeclaration";

  constructor(
    readonly name: Identifier | Destructure,
    readonly typeAnnotation: Type | null,
    readonly expression: Expression,
    readonly span: Span,
    readonly exported: Span | null
  ) {}
}

export type Destructure = TupleDestructure | RecordDestructure;

export class TupleDestructure {
  readonly _tag = "TupleDestructure";
  constructor(
    readonly fields: ReadonlyArray<Identifier>,
    readonly span: Span
  ) {}
}

export class RecordDestructure {
  readonly _tag = "RecordDestructure";
  constructor(
    readonly fields: ReadonlyArray<Identifier>,
    readonly span: Span
  ) {}
}
