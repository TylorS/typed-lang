import {
  isDataDeclaration,
  DataConstructor,
  TupleConstructor,
  RecordConstructor,
  VoidConstructor,
} from "@typed-lang/parser";
import { codeGen, CodeGeneratorContext } from "../../CodeGenerator.js";
import { addFields, addTypeParameters, forEachNodeNewLine, getTypeParametersFromFields } from "./utils.js";

export class DataDeclarationInterfaceGenerator extends codeGen(
  isDataDeclaration,
  (ctx, decl) => {
    addDataConstructorInterfaces(ctx, decl.constructors);
  }
) {}

function addDataConstructorInterfaces(
  ctx: CodeGeneratorContext,
  constructors: ReadonlyArray<DataConstructor>
) {
  forEachNodeNewLine(ctx, constructors, 2, (c) =>
    compileDataConstructorInterface(ctx, c)
  );
}

function compileDataConstructorInterface(
  ctx: CodeGeneratorContext,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorInterface(ctx, constructor);
    case "TupleConstructor":
      return compileTupleConstructorInterface(ctx, constructor);
    case "RecordConstructor":
      return compileRecordConstructorInterface(ctx, constructor);
  }
}

function compileVoidConstructorInterface(
  ctx: CodeGeneratorContext,
  constructor: VoidConstructor
) {
  ctx.modules.addSegment(
    `export interface ${constructor.name} {`,
    constructor.span.start
  );
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `readonly _tag: "${constructor.name}"`,
      constructor.span.start
    );
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, constructor.span.end);
}

function compileTupleConstructorInterface(
  ctx: CodeGeneratorContext,
  constructor: TupleConstructor
) {
  ctx.modules.addSegment(
    `export interface ${constructor.name}`,
    constructor.span.start
  );
  addTypeParameters(ctx, getTypeParametersFromFields(constructor.fields));
  ctx.modules.addSegment(` {`);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `readonly _tag: "${constructor.name}"`,
      constructor.span.start
    );
    ctx.modules.addNewLine();

    addFields(ctx, constructor.fields, true);
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, constructor.span.end);
}

function compileRecordConstructorInterface(
  ctx: CodeGeneratorContext,
  constructor: RecordConstructor
) {
  ctx.modules.addSegment(
    `export interface ${constructor.name}`,
    constructor.span.start
  );
  addTypeParameters(ctx, getTypeParametersFromFields(constructor.fields));
  ctx.modules.addSegment(` {`);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `readonly _tag: "${constructor.name}"`,
      constructor.span.start
    );
    ctx.modules.addNewLine();

    addFields(ctx, constructor.fields, true);
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, constructor.span.end);
}
