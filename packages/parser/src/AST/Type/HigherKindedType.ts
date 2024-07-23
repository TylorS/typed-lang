import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { Span } from "../../Span.js";
import { Type } from "../Type.js";

export class HigherKindedType {
  readonly _tag = "HigherKindedType";

  constructor(
    readonly name: Identifier,
    readonly parameters: ReadonlyArray<TypeParameter | HigherKindedType>,
    readonly constraint: Type | undefined,
    readonly span: Span
  ) {}
}
