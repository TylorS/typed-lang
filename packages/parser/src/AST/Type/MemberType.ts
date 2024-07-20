import { Identifier } from "../Nodes/Identifier";
import { PropertyAccess } from "../Nodes/PropertyAccess";
import { Type } from "../Type";

export class MemberType {
  readonly _tag = "MemberType";

  constructor(readonly name: Identifier | PropertyAccess, readonly type: Type) {}
}
