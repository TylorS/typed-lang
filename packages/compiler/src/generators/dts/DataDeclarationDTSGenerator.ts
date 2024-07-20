import {
  DataConstructor,
  DataDeclaration,
  Field,
  NamedField,
  RecordConstructor,
  RecordType,
  Span,
  TupleConstructor,
  TypeParameter,
  VoidConstructor,
} from "@typed-lang/parser";
import {
  MappedDocumentGenerator,
  Module,
} from "../../MappedDocumentGenerator.js";
import { addDataDeclarationTypeAlias } from "../shared/addDataDeclarationTypeAlias.js";
import { addTypeParameters } from "../shared/addTypeParameters.js";
import { getTypeParametersFromFields } from "../shared/getTypeParametersFromFields.js";
import { addField } from "../shared/addFields.js";
import { forEachNodeNewLine, forEachNodeSeparator } from "../shared/utils.js";
import { addType } from "../shared/addType.js";

export function dataDeclarationDtsGenerator(module: Module, decl: DataDeclaration) {
  module.addText(`export declare namespace `);
  module.addText(decl.name, { span: decl.nameSpan, name: decl.name });
  module.addText(` {`);
  module.addNewLine();

  module.withIdent(() => {
    addDataDeclarationTypeAlias(module, decl);
    module.addNewLine();
    forEachNodeNewLine(module, decl.constructors, 2, (constructor) =>
      dataConstructorDtsGenerator(module, constructor)
    );
    module.addNewLine(2);
    addDataDeclarationGuardsDTS(module, decl);
  });

  module.addText(`}`);
  module.addNewLine();
}

export function dataConstructorDtsGenerator(
  module: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorDtsConstructor(module, constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return addFieldsConstructorDtsConstructor(module, constructor);
  }
}

function addVoidConstructorDtsConstructor(
  module: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  module.addText(
    `export declare const ${constructor.name}: ${constructor.name}`,
    {
      span: constructor.span,
      name: constructor.name,
    }
  );
}

function addFieldsConstructorDtsConstructor(
  module: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor
) {
  module.withSpan(
    {
      span: constructor.span,
    },
    (gen) => {
      gen.addText(`export declare const `);
      gen.addText(constructor.name, {
        span: constructor.nameSpan,
        name: constructor.name,
      });
      gen.addText(`: `);
      const typeParams = getTypeParametersFromFields(constructor.fields);
      addTypeParameters(gen, typeParams);
      gen.addText(`(`);

      if (constructor._tag === "TupleConstructor") {
        addFieldsTupleFunctionParameters(gen, constructor.fields);
      } else {
        addFieldsRecordFunctionParameters(gen, constructor.fields);
      }

      gen.addText(`) => ${constructor.name}`);
      addTypeParameters(gen, typeParams);
    }
  );
}

function addFieldsTupleFunctionParameters(
  ctx: MappedDocumentGenerator,
  fields: ReadonlyArray<Field>
) {
  forEachNodeSeparator(ctx, fields, `, `, (f, i) => addField(ctx, f, i, false));
}

function addFieldsRecordFunctionParameters(
  ctx: MappedDocumentGenerator,
  fields: ReadonlyArray<NamedField>
) {
  ctx.addText(`params: `);

  addType(
    ctx,
    new RecordType(
      fields,
      new Span(fields[0].span.start, fields[fields.length - 1].span.end)
    )
  );
}

export function addDataDeclarationGuardsDTS(module: MappedDocumentGenerator, decl: DataDeclaration) {
  addDataConstructorGuards(module, decl);
  module.addNewLine(2);
  addDataDeclarationGuard(module, decl);
  module.addNewLine();
}

function addDataConstructorGuards(module: MappedDocumentGenerator, decl: DataDeclaration) {
  forEachNodeNewLine(module, decl.constructors, 2, (c) => {
    addDataConstructorGuard(module, c, decl);
  });
}

function addDataConstructorGuard(
  module: MappedDocumentGenerator,
  constructor: DataConstructor,
  decl: DataDeclaration
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorGuard(module, constructor, decl);
    case "TupleConstructor":
    case "RecordConstructor":
      return addParameterizedConstructorGuard(module, constructor, decl);
  }
}

function addVoidConstructorGuard(
  module: MappedDocumentGenerator,
  constructor: VoidConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  module.withSpan({ span: decl.span }, (gen) => {
    gen.addText(`export declare const `);
    gen.addText(`is${constructor.name}`, {
      span: constructor.span,
      name: `is${constructor.name}`,
    });
    gen.addText(`: `);
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`(`);
    gen.addText(`${valueName}`, {
      span: constructor.span,
      name: valueName,
    });
    gen.addText(`: `);
    gen.addText(`${decl.name}`, {
      span: decl.nameSpan,
      name: decl.name,
    });
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`) => `);
    gen.addText(`${valueName} is ${constructor.name}`);
  });
}

const uncapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

function addParameterizedConstructorGuard(
  module: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  module.withSpan({ span: constructor.span }, (gen) => {
    gen.addText(`export declare const `);
    gen.addText(`is${constructor.name}`, {
      span: constructor.span,
      name: `is${constructor.name}`,
    });
    gen.addText(`: `);
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`(`);
    gen.addText(`${valueName}: `);
    gen.addText(decl.name, {
      span: decl.nameSpan,
      name: decl.name,
    })
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`) => `);
    gen.addText(`${valueName} is ${constructor.name}`);
    addTypeParameters(gen, getTypeParametersFromFields(constructor.fields));
  });
}

function addDataDeclarationGuard(module: MappedDocumentGenerator, decl: DataDeclaration) {
  const valueName = `u`;

  module.withSpan({ span: decl.span }, (gen) => { 
    gen.addText(`export declare const `);
    gen.addText(`is${decl.name}`, {
      span: decl.nameSpan,
      name: `is${decl.name}`,
    });
    gen.addText(`: `);
    gen.addText(`(`);
    gen.addText(`${valueName}: unknown`);
    gen.addText(`) => ${valueName} is `);
    gen.addText(`${decl.name}`, { span: decl.nameSpan });
    addTypeParameters(
      gen,
      decl.typeParameters.map((tp) => new TypeParameter(`unknown`, tp.span))
    );
  })
}
