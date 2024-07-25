import { Span } from "../../Span.js";
import { Expression } from "../Expression.js";
import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter.js";
import { HigherKindedType } from "../Type.js";

export class InstanceDeclaration {
  readonly _tag = "InstanceDeclaration";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter | HigherKindedType>,
    readonly openBrace: Span,
    readonly fields: ReadonlyArray<InstanceField>,
    readonly closeBrace: Span,
    readonly span: Span,
    readonly exported: Span | undefined
  ) {}
}

export class InstanceField {
  readonly _tag = "InstanceField";
  constructor(
    readonly name: Identifier,
    readonly expression: Expression,
    readonly span: Span
  ) {}
}
