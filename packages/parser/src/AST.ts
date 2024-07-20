import { Span } from "./Span.js";

export type AST =
  | SourceFile
  | Statement
  | DataConstructor
  | TypeParameter
  | Type
  | Field

export class SourceFile {
  readonly _tag = "SourceFile";
  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly statements: ReadonlyArray<Statement>,
    readonly span: Span
  ) {}
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
    readonly span: Span,
    readonly nameSpan: Span
  ) {}
}

export class RecordConstructor {
  readonly _tag = "RecordConstructor";
  constructor(
    readonly name: string,
    readonly fields: ReadonlyArray<NamedField>,
    readonly span: Span,
    readonly nameSpan: Span
  ) {}
}

export type Type = TypeReference | TupleType | RecordType | ArrayType;

export class TypeReference {
  readonly _tag = "TypeReference";
  constructor(
    readonly name: string,
    readonly typeArguments: ReadonlyArray<Type>,
    readonly span: Span
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
    readonly nameSpan: Span
  ) {}
}

export class TypeField {
  readonly _tag = "TypeField";

  constructor(readonly type: Type, readonly span: Span) {}
}

export const isSourceFile = (node: AST): node is SourceFile =>
  node._tag === "SourceFile";

export const isDataDeclaration = (node: AST): node is DataDeclaration =>
  node._tag === "DataDeclaration";

export const isTypeAlias = (node: AST): node is TypeAlias =>
  node._tag === "TypeAlias";

export const isVoidConstructor = (node: AST): node is VoidConstructor =>
  node._tag === "VoidConstructor";

export const isTupleConstructor = (node: AST): node is TupleConstructor =>
  node._tag === "TupleConstructor";

export const isRecordConstructor = (node: AST): node is RecordConstructor =>
  node._tag === "RecordConstructor";

export const isTypeReference = (node: AST): node is TypeReference =>
  node._tag === "TypeReference";

export const isTupleType = (node: AST): node is TupleType =>
  node._tag === "TupleType";

export const isRecordType = (node: AST): node is RecordType =>
  node._tag === "RecordType";

export const isArrayType = (node: AST): node is ArrayType =>
  node._tag === "ArrayType";

export const isNamedField = (node: AST): node is NamedField =>
  node._tag === "NamedField";

export const isTypeField = (node: AST): node is TypeField =>
  node._tag === "TypeField";

export const isType = (node: AST): node is Type =>
  isTypeReference(node) || isTupleType(node) || isRecordType(node) || isArrayType(node);

export const isField = (node: AST): node is Field =>
  isNamedField(node) || isTypeField(node);

export const isTypeParameter = (node: AST): node is TypeParameter =>
  node._tag === "TypeParameter";

export const isStatement = (node: AST): node is Statement =>
  isDataDeclaration(node) || isTypeAlias(node);