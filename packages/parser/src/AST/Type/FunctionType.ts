import { Field } from "../Nodes/Field.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { Span } from "../../Span.js";
import { Type } from "../Type.js";

export class FunctionType {
  readonly _tag = "FunctionType";

  constructor(
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly parameters: ReadonlyArray<Field>,
    readonly returnType: Type,
    readonly span: Span
  ) {}
}