import { Span } from "../../Span.js";
import { NamedField } from "../Nodes/Field.js";
import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { HigherKindedType } from "../Type.js";

export class TypeClassDeclaration {
  readonly _tag = "TypeClassDeclaration";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter | HigherKindedType>,
    readonly openBrace: Span,
    readonly fields: ReadonlyArray<NamedField>,
    readonly closeBrace: Span,
    readonly span: Span,
    readonly exported: Span | undefined
  ) {}
}
