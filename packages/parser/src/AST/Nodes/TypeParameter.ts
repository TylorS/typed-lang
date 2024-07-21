import { Span } from "../../Span.js";
import type { Identifier } from "../Nodes/Identifier.js";
import type { Type } from "../Type.js";

export class TypeParameter {
  readonly _tag = "TypeParameter";

  constructor(
    readonly name: Identifier,
    readonly constraint: Type | undefined,
    readonly span: Span
  ) {}
}
