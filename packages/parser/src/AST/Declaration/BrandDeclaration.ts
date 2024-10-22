import { Span } from "../../Span.js";
import { Identifier } from "../Nodes/Identifier.js";
import { Type } from "../Type.js";

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
