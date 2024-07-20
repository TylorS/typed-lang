import { Identifier } from "../Nodes/Identifier";

export class BrandedType {
  readonly _tag = "BrandedType";

  constructor(
    readonly name: Identifier,
    readonly brands: ReadonlyArray<Identifier>
  ) {}
}
