import { Span } from "../../Span";
import { Identifier } from "../Nodes/Identifier.js";
import { TypeParameter } from "../Nodes/TypeParameter";
import { Field, NamedField } from "../Nodes/Field";

export class DataDeclaration {
  readonly _tag = "DataDeclaration";

  constructor(
    readonly name: Identifier,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly equals: Span,
    readonly constructors: Array<DataConstructor>,
    readonly span: Span,
    readonly exported: Span | undefined
  ) {}
}

export type DataConstructor =
  | VoidConstructor
  | TupleConstructor
  | RecordConstructor;

export class VoidConstructor {
  readonly _tag = "VoidConstructor";
  constructor(readonly name: Identifier, readonly span: Span) {}
}

export class TupleConstructor {
  readonly _tag = "TupleConstructor";
  constructor(
    readonly name: Identifier,
    readonly fields: ReadonlyArray<Field>,
    readonly span: Span
  ) {}
}

export class RecordConstructor {
  readonly _tag = "RecordConstructor";
  constructor(
    readonly name: Identifier,
    readonly fields: ReadonlyArray<NamedField>,
    readonly span: Span
  ) {}
}
