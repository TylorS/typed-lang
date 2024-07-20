import { Span } from "@typed-lang/parser/Span";
import { Type } from "../Type";

export class MapType {
  readonly _tag = "MapType";

  constructor(
    readonly key: Type,
    readonly value: Type,
    readonly span: Span,
  ) {}
}