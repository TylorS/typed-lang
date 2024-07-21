import { Span } from "../../Span.js";
import { Identifier } from "../Nodes/Identifier.js";

export class BrandedType {
  readonly _tag = "BrandedType";

  constructor(
    readonly name: Identifier,
    readonly brands: ReadonlyArray<Identifier>,
    readonly span: Span
  ) {}
}
