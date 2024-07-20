import { Span } from "../../Span.js";
import { Block } from "../Nodes/Block.js";
import { NamedField } from "../Nodes/Field.js";
import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { Type } from "../Type.js";

export class FunctionDeclaration {
  readonly _tag = "FunctionDeclaration";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly parameters: ReadonlyArray<NamedField>,
    readonly returnType: Type | null,
    readonly block: Block,
    readonly exported: Span | null
  ) {}
}
