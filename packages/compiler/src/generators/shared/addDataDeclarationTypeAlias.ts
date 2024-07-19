import {
  DataConstructor,
  DataDeclaration,
  RecordConstructor,
  TupleConstructor,
} from "@typed-lang/parser";
import { MappedDocumentGenerator } from "../../MappedDocumentGenerator.js";
import { addTypeParameters } from "./addTypeParameters.js";
import { forEachNodeNewLine } from "./utils.js";
import { getTypeParametersFromFields } from "./getTypeParametersFromFields.js";
import { addDataConstructorInterfaceDeclaration } from "./addDataConstructorInterfaceDeclaration.js";

export function addDataDeclarationTypeAlias(
  gen: MappedDocumentGenerator,
  decl: DataDeclaration
) {
  gen.withSpan(
    {
      span: decl.span,
      name: decl.name,
    },
    (gen) => {
      gen.addText(`export type `);
      gen.addText(decl.name, { span: decl.nameSpan, name: decl.name });
      addTypeParameters(gen, decl.typeParameters);
      gen.addText(` `);
      gen.addText(`=`, { span: decl.equalsSpan });
      gen.addNewLine();

      gen.withIdent(() => {
        forEachNodeNewLine(gen, decl.constructors, 1, (constructor) =>
          addDataConstructorTypeReference(gen, constructor)
        );
      });

      gen.addNewLine(2);

      forEachNodeNewLine(gen, decl.constructors, 2, (constructor) =>
        addDataConstructorInterfaceDeclaration(gen, constructor)
      );

      gen.addNewLine();
    }
  );
}

function addDataConstructorTypeReference(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorTypeReference(gen, constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return addFieldsConstructorTypeReference(gen, constructor);
  }
}

function addVoidConstructorTypeReference(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  gen.addText(`| `);
  gen.addText(`${constructor.name}`, {
    span: constructor.span,
    name: constructor.name,
  });
}

function addFieldsConstructorTypeReference(
  gen: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor
) {
  gen.addText(`| `);
  gen.addText(`${constructor.name}`, {
    span: constructor.nameSpan,
    name: constructor.name,
  });
  addTypeParameters(gen, getTypeParametersFromFields(constructor.fields));
}
