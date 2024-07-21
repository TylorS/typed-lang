import { Span } from "@typed-lang/parser/Span";
import type { Type } from "../Type.js";

export class TupleType {
  readonly _tag = "TupleType";

  constructor(
    readonly members: ReadonlyArray<Type | RestType>,
    readonly span: Span
  ) {}
}

export class RestType {
  readonly _tag = "RestType";

  constructor(public readonly element: Type, public readonly span: Span) {}
}
