import { Span } from "@typed-lang/parser/Span";
import type { Type } from "../Type.js";

export class ArrayType {
  readonly _tag = "ArrayType";

  constructor(
    readonly element: Type,
    readonly span: Span
  ) {}
}