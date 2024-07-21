import { Identifier } from "../Nodes/Identifier.js";
import { PropertyAccess } from "../Nodes/PropertyAccess.js";
import { Type } from "../Type.js";
import { Span } from "../../Span.js";

export class MemberType {
  readonly _tag = "MemberType";

  constructor(
    readonly name: Identifier | PropertyAccess,
    readonly type: Type,
    readonly span: Span
  ) {}
}
