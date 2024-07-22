import { Span } from "../../Span.js";
import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { Type } from "../Type.js";

export class TypeAliasDeclaration {
  readonly _tag = "TypeAliasDeclaration";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly type: Type,
    readonly span: Span,
    readonly exported: Span | undefined
  ) {}
}
