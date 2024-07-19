
import {
  DataConstructor,
  RecordConstructor,
  TupleConstructor,
  VoidConstructor,
} from "@typed-lang/parser";
import { MappedDocumentGenerator } from "../../MappedDocumentGenerator.js";
import { addTypeParameters } from "./addTypeParameters.js";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields.js";
import { addFields } from "./addFields.js";

export function addDataConstructorInterfaceDeclaration(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorInterface(gen, constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return addFieldsConstructorInterface(gen, constructor);
  }
}

function addVoidConstructorInterface(
  gen: MappedDocumentGenerator,
  constructor: VoidConstructor
) {
  gen.addText(`export interface `);
  gen.addText(constructor.name, { span: constructor.span });
  gen.addText(` {`);
  gen.addNewLine();
  gen.withIdent(() => {
    gen.addText(`readonly _tag: ` )
    gen.addText(`"${constructor.name}"`, {
      span: constructor.span,
      name: constructor.name
    });
  });
  gen.addNewLine();
  gen.addText(`}`);
}

function addFieldsConstructorInterface(
  gen: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor
) {
  gen.addText(`export interface `);
  gen.addText(constructor.name, { span: constructor.span });
  addTypeParameters(gen, getTypeParametersFromFields(constructor.fields));
  gen.addText(` {`);
  gen.addNewLine();
  gen.withIdent(() => {
    gen.addText(`readonly _tag: `);
    gen.addText(`"${constructor.name}"`, {
      span: constructor.nameSpan,
      name: constructor.name,
    });
    gen.addNewLine();
    addFields(gen, constructor.fields, true);
  });
  gen.addNewLine();
  gen.addText(`}`);
}
