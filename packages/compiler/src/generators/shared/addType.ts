import {
  ArrayType,
  RecordType,
  TupleType,
  Type,
  TypeReference,
} from "@typed-lang/parser";
import { MappedDocumentGenerator } from "../../MappedDocumentGenerator.js";
import { forEachNodeSeparator } from "./utils.js";
import { addFields } from "./addFields.js";

export function addType(gen: MappedDocumentGenerator, type: Type) {
  switch (type._tag) {
    case "TypeReference":
      return addTypeReference(gen, type);
    case "TupleType":
      return addTupleType(gen, type);
    case "RecordType":
      return addRecordType(gen, type);
    case "ArrayType":
      return addArrayType(gen, type);
  }
}

export function addTypeArguments(
  gen: MappedDocumentGenerator,
  typeArguments: ReadonlyArray<Type>
) {
  if (typeArguments.length === 0) return;

  gen.addText(`<`);

  forEachNodeSeparator(gen, typeArguments, `, `, (typeArgument) => {
    addType(gen, typeArgument);
  });

  gen.addText(`>`);
}

function addTypeReference(gen: MappedDocumentGenerator, type: TypeReference) {
  gen.addText(type.name, {
    span: type.span,
    name: type.name,
  });
  addTypeArguments(gen, type.typeArguments);
}

function addTupleType(gen: MappedDocumentGenerator, type: TupleType) {
  gen.withSpan(
    {
      span: type.span,
    },
    (gen) => {
      gen.addText(`[`);
      addFields(gen, type.fields, true);
      gen.addText(`]`);
    }
  );
}

function addRecordType(gen: MappedDocumentGenerator, type: RecordType) {
  gen.withSpan(
    {
      span: type.span,
    },
    (gen) => {
      gen.addText(`{ `);
      addFields(gen, type.fields, true);
      gen.addText(` }`);
    }
  );
}

function addArrayType(gen: MappedDocumentGenerator, type: ArrayType) {
  gen.withSpan(
    {
      span: type.span,
    },
    (gen) => {
      gen.addText(`Array<`);
      addType(gen, type.element);
      gen.addText(`>`);
    }
  );
}
