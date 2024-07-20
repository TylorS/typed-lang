import { Span } from "../../Span.js";
import { Identifier } from "./Identifier.js";
import { Type } from "../Type.js";

export type Field =
  | NamedField
  | PositionalField;

export class NamedField {
  readonly _tag = "NamedField";

  constructor(
    readonly name: Identifier,
    readonly value: Type,
    readonly span: Span
  ) {}
}

export class PositionalField {
  readonly _tag = "PositionalField";

  constructor(
    readonly index: number,
    readonly value: Type,
    readonly span: Span
  ) {}
}