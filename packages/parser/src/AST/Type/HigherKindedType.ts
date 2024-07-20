import { Identifier } from "../Nodes/Identifier";
import { TypeParameter } from "../Nodes/TypeParameter";

export class HigherKindedType {
  readonly _tag = "HigherKindedType";

  constructor(
    readonly name: Identifier,
    readonly parameters: ReadonlyArray<TypeParameter>
  ) {}
}
