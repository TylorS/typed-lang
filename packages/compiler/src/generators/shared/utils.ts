import {
  ArrayType,
  Field,
  NamedField,
  RecordType,
  TupleType,
  Type,
  TypeField,
  TypeParameter,
  TypeReference,
} from "@typed-lang/parser";
import { CodeGeneratorContext } from "../../CodeGenerator.js";

export function addTypeParameters(
  ctx: CodeGeneratorContext,
  typeParameters: ReadonlyArray<TypeParameter>
) {
  if (typeParameters.length === 0) return;

  ctx.modules.addSegment(`<`);

  forEachNodeSeparator(ctx, typeParameters, `, `, (typeParameter) => {
    ctx.modules.addSegment(
      typeParameter.name,
      typeParameter.span.start,
      typeParameter.name,
      ctx.content(typeParameter.span)
    );
  });

  ctx.modules.addSegment(`>`);
}

export function getTypeParametersFromFields(fields: ReadonlyArray<Field>) {
  const typeParameters: TypeReference[] = [];

  for (const field of fields) {
    typeParameters.push(...getTypeReferencesFromType(field.type));
  }

  return typeParameters.map((t) => new TypeParameter(t.name, t.span));
}

export function getTypeReferencesFromType(type: Type): TypeReference[] {
  switch (type._tag) {
    case "TypeReference":
      return [type];
    case "TupleType":
      return type.fields.flatMap((f) => getTypeReferencesFromType(f.type));
    case "RecordType":
      return type.fields.flatMap((f) => getTypeReferencesFromType(f.type));
    case "ArrayType":
      return getTypeReferencesFromType(type.element);
  }
}

export function addFields(
  ctx: CodeGeneratorContext,
  fields: ReadonlyArray<Field>,
  isReadonly: boolean
) {
  forEachNodeNewLine(ctx, fields, 1, (field, i) => {
    addField(ctx, field, i, isReadonly);
  });
}

export function getFieldName(field: Field, i: number) {
  switch (field._tag) {
    case "NamedField":
      return field.name;
    case "TypeField":
      return `arg${i}`;
  }
}

export function addField(
  ctx: CodeGeneratorContext,
  field: Field,
  i: number,
  isReadonly: boolean
) {
  const name = getFieldName(field, i);
  switch (field._tag) {
    case "NamedField":
      return addNamedField(ctx, field, name, isReadonly);
    case "TypeField":
      return addTypeField(ctx, field, name, isReadonly);
  }
}

function addNamedField(
  ctx: CodeGeneratorContext,
  field: NamedField,
  name: string,
  isReadonly: boolean
) {
  ctx.modules.addSegment(`${isReadonly ? `readonly ` : ''}${name}: `, field.nameSpan.start);
  addType(ctx, field.type);
}

function addTypeField(
  ctx: CodeGeneratorContext,
  field: TypeField,
  name: string,
  isReadonly: boolean
) {
  ctx.modules.addSegment(`${isReadonly ? `readonly ` : ''}${name}: `, field.type.span.start);
  addType(ctx, field.type);
}

export function addType(ctx: CodeGeneratorContext, type: Type) {
  switch (type._tag) {
    case "TypeReference":
      return addTypeReference(ctx, type);
    case "TupleType":
      return addTupleType(ctx, type);
    case "RecordType":
      return addRecordType(ctx, type);
    case "ArrayType":
      return addArrayType(ctx, type);
  }
}

function addTypeReference(ctx: CodeGeneratorContext, type: TypeReference) {
  ctx.modules.addSegment(type.name, type.span.start);
  addTypeArguments(ctx, type.typeArguments);
}

function addTupleType(ctx: CodeGeneratorContext, type: TupleType) {
  ctx.modules.addSegment(`[`, type.span.start);
  addFields(ctx, type.fields, true);
  ctx.modules.addSegment(`]`, type.span.end);
}

function addRecordType(ctx: CodeGeneratorContext, type: RecordType) {
  ctx.modules.addSegment(`{ `, type.span.start);
  if (type.fields.length > 1) {
    ctx.identation.with(() => {
      ctx.modules.addNewLine();
      addFields(ctx, type.fields, true);
    });
    ctx.modules.addNewLine();
  } else {
    addField(ctx, type.fields[0], 0, true);
  }

  ctx.modules.addSegment(` }`, type.span.end);
}

function addArrayType(ctx: CodeGeneratorContext, type: ArrayType) {
  ctx.modules.addSegment(`Array<`, type.span.start);
  addType(ctx, type.element);
  ctx.modules.addSegment(`>`, type.span.end);
}

export function addTypeArguments(
  ctx: CodeGeneratorContext,
  typeArguments: ReadonlyArray<Type>
) {
  if (typeArguments.length === 0) return;

  ctx.modules.addSegment(`<`);

  forEachNodeSeparator(ctx, typeArguments, `, `, (typeArgument) => {
    addType(ctx, typeArgument);
  });

  ctx.modules.addSegment(`>`);
}

export function forEachNodeNewLine<T>(
  ctx: CodeGeneratorContext,
  nodes: ReadonlyArray<T>,
  newLines: number,
  fn: (node: T, index: number) => void
) {
  if (nodes.length === 0) return;
  fn(nodes[0], 0);
  if (nodes.length === 1) {
    return;
  }

  for (let i = 1; i < nodes.length; i++) {
    ctx.modules.addNewLine(newLines);
    fn(nodes[i], i);
  }
}

export function forEachNodeSeparator<T>(
  ctx: CodeGeneratorContext,
  nodes: ReadonlyArray<T>,
  separator: string,
  fn: (node: T, index: number) => void
) {
  if (nodes.length === 0) return;

  fn(nodes[0], 0);

  if (nodes.length > 1) {
    for (let i = 1; i < nodes.length; i++) {
      ctx.modules.addSegment(separator);
      fn(nodes[i], i);
    }
  }
}
