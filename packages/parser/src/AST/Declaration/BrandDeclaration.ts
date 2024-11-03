import type { Span } from "../../Span.js";
import type { Identifier } from "../Nodes/Identifier.js";
import type { Type } from "../Type.js";

export class BrandDeclaration {
  readonly _tag = "BrandDeclaration";

  constructor(
    readonly name: Identifier,
    readonly equals: Span,
    readonly type: Type,
    readonly span: Span,
    readonly exported: Span | undefined
  ) {}
}
