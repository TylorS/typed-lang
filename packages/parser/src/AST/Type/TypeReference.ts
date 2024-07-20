import { Span } from "@typed-lang/parser/Span";
import type { Identifier } from "../Nodes/Identifier.js";
import { PropertyAccess } from "../Nodes/PropertyAccess.js";

export class TypeReference {
  readonly _tag = "TypeReference";

  constructor(
    readonly name: Identifier | PropertyAccess,
    readonly typeArguments: ReadonlyArray<TypeReference>,
    readonly span: Span
  ) {}
}
