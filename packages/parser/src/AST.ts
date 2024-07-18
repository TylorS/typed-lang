import { Span } from "./Token.js";

export class SourceFile {
  readonly _tag = "SourceFile";
  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly statements: ReadonlyArray<Statement>
  ) { }
}

export type Statement = DataDeclaration | TypeAlias;

export class DataDeclaration {
  readonly _tag = "DataDeclaration";

  constructor(
    readonly name: string,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly constructors: ReadonlyArray<DataConstructor>,
    readonly span: Span,
    readonly nameSpan: Span,
    readonly equalsSpan: Span
  ) {}
}

export class TypeAlias {
  readonly _tag = "TypeAlias";

  constructor(
    readonly name: string,
    readonly typeParameters: ReadonlyArray<TypeParameter>,
    readonly type: Type,
    readonly span: Span
  ) {}
}

export class TypeParameter {
  readonly _tag = "TypeParameter";
  constructor(readonly name: string, readonly span: Span) {}
}

export type DataConstructor =
  | VoidConstructor
  | TupleConstructor
  | RecordConstructor;

export class VoidConstructor {
  readonly _tag = "VoidConstructor";
  constructor(readonly name: string, readonly span: Span) {}
}

export class TupleConstructor {
  readonly _tag = "TupleConstructor";
  constructor(
    readonly name: string,
    readonly fields: ReadonlyArray<Field>,
    readonly span: Span
  ) {}
}

export class RecordConstructor {
  readonly _tag = "RecordConstructor";
  constructor(
    readonly name: string,
    readonly fields: ReadonlyArray<NamedField>,
    readonly span: Span
  ) {}
}

export type Type = TypeReference | TupleType | RecordType;

export class TypeReference {
  readonly _tag = "TypeReference";
  constructor(
    readonly name: string,
    readonly typeArguments: ReadonlyArray<Type>,
    readonly span: Span,
  ) {}
}

export class TupleType {
  readonly _tag = "TupleType";
  constructor(readonly fields: ReadonlyArray<Field>, readonly span: Span) {}
}

export class RecordType {
  readonly _tag = "RecordType";
  constructor(
    readonly fields: ReadonlyArray<NamedField>,
    readonly span: Span
  ) {}
}

export class ArrayType {
  readonly _tag = "ArrayType";
  constructor(readonly element: Type, readonly span: Span) {}
}

export type Field = TypeField | NamedField;

export class NamedField {
  readonly _tag = "NamedField";

  constructor(
    readonly name: string,
    readonly type: Type,
    readonly span: Span,
    readonly nameSpan: Span,
  ) {}
}

export class TypeField {
  readonly _tag = "TypeField";

  constructor(readonly type: Type, readonly span: Span) {}
}
