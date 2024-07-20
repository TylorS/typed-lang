import { Span } from "../../Span.js";
import { Identifier } from "./Identifier.js";

export class PropertyAccess {
  readonly _tag = "PropertyAccess";

  constructor(
    readonly left: Identifier,
    readonly dot: Span,
    readonly right: Identifier | PropertyAccess,
  ) {}
}
