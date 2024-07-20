import { Span } from "../../Span.js";
import { Identifier } from "../Nodes/Identifier.js";
import { Type } from "../Type.js";

export class TypeAliasDeclaration {
  readonly _tag = "TypeAlias";

  constructor(
    readonly name: Identifier,
    readonly type: Type,
    readonly span: Span,
    readonly exported: Span | null
  ) {}
}
