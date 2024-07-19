import { codeGen, CodeGeneratorContext } from "../../CodeGenerator.js";
import { DataConstructor, isDataDeclaration, RecordConstructor, TupleConstructor, VoidConstructor } from "@typed-lang/parser";
import { addTypeParameters, getTypeParametersFromFields } from "./utils.js";

export class DataDeclarationTypeAliasGenerator extends codeGen(
  isDataDeclaration,
  (ctx, decl) => {
    ctx.modules.addSegment(`export type `, decl.span.start);
    ctx.modules.addSegment(
      decl.name,
      decl.nameSpan.start,
      decl.name,
      ctx.content(decl.nameSpan)
    );

    addTypeParameters(ctx, decl.typeParameters);

    ctx.modules.addSegment(` =`, decl.equalsSpan.start, undefined, ctx.content(decl.equalsSpan));
    ctx.modules.addNewLine();

    ctx.identation.with(() =>
      addDataConstructorTypeReferences(ctx, decl.constructors)
    );
  }
) {}

function addDataConstructorTypeReferences(
  ctx: CodeGeneratorContext,
  constructors: ReadonlyArray<DataConstructor>
) {
  if (constructors.length === 1) {
    addDataConstructorTypeReference(ctx, constructors[0]);
  } else {
    ctx.modules.addSegment(`| `, constructors[0].span.start);
    ctx.identation.with(() =>
      addDataConstructorTypeReference(ctx, constructors[0])
    );

    for (let i = 1; i < constructors.length; i++) {
      ctx.modules.addNewLine();
      ctx.modules.addSegment(`| `, constructors[i].span.start);
      ctx.identation.with(() =>
        addDataConstructorTypeReference(ctx, constructors[i])
      );
    }
  }
}

function addDataConstructorTypeReference(
  ctx: CodeGeneratorContext,
  constructor: DataConstructor
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorTypeReference(ctx, constructor);
    case "TupleConstructor":
      return addTupleConstructorTypeReference(ctx, constructor);
    case "RecordConstructor":
      return addRecordConstructorTypeReference(ctx, constructor);
  }
}

function addVoidConstructorTypeReference(
  ctx: CodeGeneratorContext,
  constructor: VoidConstructor
) {
  ctx.modules.addSegment(`${constructor.name}`, constructor.span.start);
}

function addTupleConstructorTypeReference(
  ctx: CodeGeneratorContext,
  constructor: TupleConstructor
) {
  ctx.modules.addSegment(`${constructor.name}`, constructor.span.start);
  addTypeParameters(ctx, getTypeParametersFromFields(constructor.fields));
}

function addRecordConstructorTypeReference(
  ctx: CodeGeneratorContext,
  constructor: RecordConstructor
) {
  ctx.modules.addSegment(`${constructor.name}`, constructor.span.start);
  addTypeParameters(ctx, getTypeParametersFromFields(constructor.fields));
}