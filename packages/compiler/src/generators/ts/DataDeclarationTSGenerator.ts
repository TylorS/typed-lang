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
import { addField, getFieldName } from "../shared/addFields.js";
import { forEachNodeNewLine, forEachNodeSeparator } from "../shared/utils.js";
import { addType } from "../shared/addType.js";
import {
  addDataDeclarationGuardsDTS,
  dataConstructorDtsGenerator,
} from "../dts/dataDeclarationDtsGenerator.js";

export function dataDeclarationTsGenerator(
  module: Module,
  decl: DataDeclaration
) {
  const baseModName =
    module.fileName.replace(module.extension, "") + "." + decl.name;

  module.addModule(
    baseModName + module.extension,
    decl.span,
    (gen) => {
      addDataDeclarationTypeAlias(gen, decl);
      gen.addNewLine();
      forEachNodeNewLine(gen, decl.constructors, 2, (constructor) =>
        dataConstructorTsGenerator(gen, constructor)
      );
      gen.addNewLine(2);
      addDataDeclarationGuards(gen, decl);
    },
    true
  );

  module.addModule(
    baseModName + ".d.ts",
    decl.span,
    (gen) => {
      addDataDeclarationTypeAlias(gen, decl);
      gen.addNewLine();
      forEachNodeNewLine(gen, decl.constructors, 2, (constructor) =>
        dataConstructorDtsGenerator(gen, constructor)
      );
      gen.addNewLine(2);
      addDataDeclarationGuardsDTS(gen, decl);
    },
    false
  );
}

function dataConstructorTsGenerator(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorTsConstructor(gen, constructor);
    case "TupleConstructor":
    case "RecordConstructor":
      return addFieldsConstructorTsConstructor(gen, constructor);
  }
}

function addVoidConstructorTsConstructor(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor
) {
  gen.addText(
    `export const ${constructor.name}: ${constructor.name} = { _tag: "${constructor.name}" }`,
    {
      span: constructor.span,
      name: constructor.name,
    }
  );
}

function addFieldsConstructorTsConstructor(
  gen: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor
) {
  gen.withSpan(
    {
      span: constructor.span,
    },
    (gen) => {
      gen.addText(`export const `);
      gen.addText(constructor.name, {
        span: constructor.nameSpan,
        name: constructor.name,
      });
      gen.addText(` = `);
      const typeParams = getTypeParametersFromFields(constructor.fields);
      addTypeParameters(gen, typeParams);
      gen.addText(`(`);

      if (constructor._tag === "TupleConstructor") {
        addFieldsTupleFunctionParameters(gen, constructor.fields);
      } else {
        addFieldsRecordFunctionParameters(gen, constructor.fields);
      }

      gen.addText(`): ${constructor.name}`);
      addTypeParameters(gen, typeParams);
      gen.addText(` => ({`);
      gen.addNewLine();
      gen.withIdent(() => {
        gen.addText(`_tag: `);
        gen.addText(`"${constructor.name}"`, {
          span: constructor.nameSpan,
          name: constructor.name,
        });
        gen.addText(`,`);
        gen.addNewLine();

        forEachNodeNewLine(gen, constructor.fields, 1, (field, i) => {
          const name = getFieldName(field, i);
          gen.addText(`${name}`);

          if (i < constructor.fields.length - 1) {
            gen.addText(`,`);
          }

          gen.addNewLine();
        });
      });
      gen.addText(`})`);
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

function addDataDeclarationGuards(
  gen: MappedDocumentGenerator,
  decl: DataDeclaration
) {
  addDataConstructorGuards(gen, decl);
  gen.addNewLine(2);
  addDataDeclarationGuard(gen, decl);
  gen.addNewLine();
}

function addDataConstructorGuards(
  gen: MappedDocumentGenerator,
  decl: DataDeclaration
) {
  forEachNodeNewLine(gen, decl.constructors, 2, (c) => {
    addDataConstructorGuard(gen, c, decl);
  });
}

function addDataConstructorGuard(
  gen: MappedDocumentGenerator,
  constructor: DataConstructor,
  decl: DataDeclaration
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorGuard(gen, constructor, decl);
    case "TupleConstructor":
    case "RecordConstructor":
      return addParameterizedConstructorGuard(gen, constructor, decl);
  }
}

function addVoidConstructorGuard(
  gen: MappedDocumentGenerator,
  constructor: VoidConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  gen.withSpan({ span: constructor.span }, (gen) => {
    gen.addText(`export const `);
    gen.addText(`is${constructor.name} = `);
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`(`);
    gen.addText(`${valueName}`);
    gen.addText(`: `);
    gen.addText(`${decl.name}`, {
      span: decl.nameSpan,
      name: decl.name,
    });
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`): `);
    gen.addText(`${valueName} is ${constructor.name}`);
    gen.addText(` => `);
    gen.addText(`${valueName}._tag === "${constructor.name}"`);
  });
}

const uncapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

function addParameterizedConstructorGuard(
  gen: MappedDocumentGenerator,
  constructor: TupleConstructor | RecordConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  gen.withSpan({ span: constructor.span }, (gen) => {
    gen.addText(`export const `);
    gen.addText(`is${constructor.name}`, {
      span: constructor.span,
      name: `is${constructor.name}`,
    });
    gen.addText(` = `);
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`(`);
    gen.addText(`${valueName}: `);
    gen.addText(decl.name, {
      span: decl.nameSpan,
      name: decl.name,
    });
    addTypeParameters(gen, decl.typeParameters);
    gen.addText(`): `);
    gen.addText(`${valueName} is ${constructor.name}`);
    addTypeParameters(gen, getTypeParametersFromFields(constructor.fields));
    gen.addText(` => `);
    gen.addText(`${valueName}._tag === "${constructor.name}"`);
  });
}

function addDataDeclarationGuard(
  gen: MappedDocumentGenerator,
  decl: DataDeclaration
) {
  const valueName = `u`;

  gen.withSpan({ span: decl.span }, (gen) => {
    gen.addText(`export const `);
    gen.addText(`is${decl.name}`, {
      span: decl.nameSpan,
      name: `is${decl.name}`,
    });
    gen.addText(` = `);
    gen.addText(`(`);
    gen.addText(`${valueName}: unknown`);
    gen.addText(`): ${valueName} is `);
    gen.addText(`${decl.name}`, { span: decl.nameSpan });
    addTypeParameters(
      gen,
      decl.typeParameters.map((tp) => new TypeParameter(`unknown`, tp.span))
    );
    gen.addText(` =>`);
    gen.addNewLine();

    gen.withIdent(() => {
      gen.addText(`typeof ${valueName} === "object" &&`);
      gen.addNewLine();
      gen.withIdent(() => {
        gen.addText(`${valueName} !== null &&`);
        gen.addNewLine();
        gen.addText(`"_tag" in ${valueName} &&`);
        gen.addNewLine();
        gen.addText(`(`);
        forEachNodeSeparator(gen, decl.constructors, ` || `, (c) => {
          gen.addText(`${valueName}._tag === `);
          gen.addText(`"${c.name}"`, {
            span: getConstructorNameSpan(c),
            name: c.name,
          });
        });

        gen.addText(`)`);
      });
    });
  });
}

function getConstructorNameSpan(constructor: DataConstructor): Span {
  switch (constructor._tag) {
    case "VoidConstructor":
      return constructor.span;
    case "TupleConstructor":
    case "RecordConstructor":
      return constructor.nameSpan;
  }
}
