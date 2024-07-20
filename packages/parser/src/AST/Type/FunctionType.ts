import { NamedField } from "../Nodes/Field.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";

export class FunctionType {
  readonly _tag = "FunctionType";

  constructor(
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly parameters: ReadonlyArray<NamedField>,
    readonly returnType: TypeParameter,
  ) { }
}