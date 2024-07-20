import { Span } from "../../Span.js";
import { Type } from "../Type.js";

export class SetType {
  readonly _tag = "SetType";

  constructor(readonly value: Type, readonly span: Span) {}
}