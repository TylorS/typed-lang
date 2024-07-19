import { Field, NamedField, TypeField } from "@typed-lang/parser";
import { MappedDocumentGenerator } from "../../MappedDocumentGenerator.js";
import { forEachNodeNewLine } from "./utils.js";
import { addType } from "./addType.js";

export function addFields(
  ctx: MappedDocumentGenerator,
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
  ctx: MappedDocumentGenerator,
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
  ctx: MappedDocumentGenerator,
  field: NamedField,
  name: string,
  isReadonly: boolean
) {
  ctx.withSpan({
    span: field.span,
  }, (gen) => { 
    if (isReadonly) gen.addText(`readonly `);
    gen.addText(name, {
      span: field.nameSpan,
      name: field.name,
    });
    gen.addText(`: `);
    addType(gen, field.type)
  })
}

function addTypeField(
  ctx: MappedDocumentGenerator,
  field: TypeField,
  name: string,
  isReadonly: boolean
) {
  ctx.withSpan({
    span: field.span,
  }, (gen) => { 
    if (isReadonly) gen.addText(`readonly `);
    gen.addText(name, {
      span: field.span,
    });
    gen.addText(`: `);
    addType(gen, field.type)
  })
}
