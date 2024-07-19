import { codeGen, CodeGeneratorContext } from "../../CodeGenerator.js";
import {
  DataConstructor,
  Field,
  isDataDeclaration,
  NamedField,
  RecordConstructor,
  RecordType,
  Span,
  TupleConstructor,
  VoidConstructor,
} from "@typed-lang/parser";
import {
  addField,
  addType,
  addTypeParameters,
  forEachNodeNewLine,
  forEachNodeSeparator,
  getFieldName,
  getTypeParametersFromFields,
} from "../shared/utils.js";

export class DataDeclarationConstructorGenerator extends codeGen(
  isDataDeclaration,
  (ctx, decl) => {
    addDataConstructorConstructors(ctx, decl.constructors);
  }
) {}

function addDataConstructorConstructors(
  ctx: CodeGeneratorContext,
  constructors: ReadonlyArray<DataConstructor>
) {
  forEachNodeNewLine(ctx, constructors, 2, (c) =>
    compileDataConstructorConstructor(ctx, c)
  );
}

function compileDataConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorConstructor(ctx, constructor);
    case "TupleConstructor":
      return compileTupleConstructorConstructor(ctx, constructor);
    case "RecordConstructor":
      return compileRecordConstructorConstructor(ctx, constructor);
  }
}

function compileVoidConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: VoidConstructor
) {
  ctx.modules.addSegment(
    `export const ${constructor.name}: ${constructor.name} = { _tag: "${constructor.name}" }`,
    constructor.span.start
  );
}

function compileTupleConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: TupleConstructor
) {
  ctx.modules.addSegment(
    `export const ${constructor.name} = `,
    constructor.span.start
  );
  const typeParams = getTypeParametersFromFields(constructor.fields);
  addTypeParameters(ctx, typeParams);
  ctx.modules.addSegment(`(`);
  addFieldsTupleFunctionParameters(ctx, constructor.fields);
  ctx.modules.addSegment(`)`);
  ctx.modules.addSegment(`: ${constructor.name}`, constructor.span.start);
  addTypeParameters(ctx, typeParams);
  ctx.modules.addSegment(` => ({`, constructor.span.start);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `_tag: "${constructor.name}",`,
      constructor.span.start
    );
    ctx.modules.addNewLine();
    for (let i = 0; i < constructor.fields.length; i++) {
      const field = constructor.fields[i];
      const name = getFieldName(field, i);
      ctx.modules.addSegment(`${name},`, field.span.start);
      ctx.modules.addNewLine();
    }
  });
  ctx.modules.addSegment(`})`, constructor.span.end);
}

function compileRecordConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: RecordConstructor
) {
  ctx.modules.addSegment(
    `export const ${constructor.name} = `,
    constructor.span.start
  );
  const typeParams = getTypeParametersFromFields(constructor.fields);
  addTypeParameters(ctx, typeParams);
  ctx.modules.addSegment(`(`);
  addFieldsRecordFunctionParameters(ctx, constructor.fields);
  ctx.modules.addSegment(`)`);
  ctx.modules.addSegment(`: ${constructor.name}`, constructor.span.start);
  addTypeParameters(ctx, typeParams);
  ctx.modules.addSegment(` => ({`, constructor.span.start);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `_tag: "${constructor.name}",`,
      constructor.span.start
    );
    ctx.modules.addNewLine();
    for (let i = 0; i < constructor.fields.length; i++) {
      const field = constructor.fields[i];
      const name = getFieldName(field, i);
      ctx.modules.addSegment(`${name},`, field.span.start);
      ctx.modules.addNewLine();
    }
  });
  ctx.modules.addSegment(`})`, constructor.span.end);
}

function addFieldsTupleFunctionParameters(
  ctx: CodeGeneratorContext,
  fields: ReadonlyArray<Field>
) {
  forEachNodeSeparator(ctx, fields, `, `, (f, i) => addField(ctx, f, i, false));
}

function addFieldsRecordFunctionParameters(
  ctx: CodeGeneratorContext,
  fields: ReadonlyArray<NamedField>
) {
  ctx.modules.addSegment(`params: `);

  addType(
    ctx,
    new RecordType(
      fields,
      new Span(fields[0].span.start, fields[fields.length - 1].span.end)
    )
  );
}

