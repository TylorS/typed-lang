import { Identifier } from "../Nodes/Identifier";
import { TypeParameter } from "../Nodes/TypeParameter";
import { Span } from "../../Span.js";

export class HigherKindedType {
  readonly _tag = "HigherKindedType";

  constructor(
    readonly name: Identifier,
    readonly parameters: ReadonlyArray<TypeParameter>,
    readonly span: Span
  ) {}
}
