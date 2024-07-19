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
    case "RecordConstructor":
      return compileFieldsConstructorConstructor(ctx, constructor);
  }
}

function compileVoidConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: VoidConstructor
) {
  ctx.modules.addSegment(
    `export declare const ${constructor.name}: ${constructor.name}`,
    constructor.span.start
  );
}

function compileFieldsConstructorConstructor(
  ctx: CodeGeneratorContext,
  constructor: TupleConstructor | RecordConstructor
) {
  ctx.modules.addSegment(
    `export declare const ${constructor.name}: `,
    constructor.span.start
  );
  const typeParams = getTypeParametersFromFields(constructor.fields);
  addTypeParameters(ctx, typeParams);
  ctx.modules.addSegment(`(`);
  if (constructor._tag === "TupleConstructor") {
    addFieldsTupleFunctionParameters(ctx, constructor.fields);
  } else {
    addFieldsRecordFunctionParameters(ctx, constructor.fields);
  }
  ctx.modules.addSegment(`) => `);
  ctx.modules.addSegment(`${constructor.name}`, constructor.span.start);
  addTypeParameters(ctx, typeParams);
}

function addFieldsTupleFunctionParameters(
  ctx: CodeGeneratorContext,
  fields: ReadonlyArray<Field>
) {
  forEachNodeSeparator(ctx, fields, `, `, (f, i) =>
    addField(ctx, f, i, false)
  );
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
