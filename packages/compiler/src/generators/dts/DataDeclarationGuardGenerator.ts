import { codeGen, CodeGeneratorContext } from "../../CodeGenerator.js";
import {
  DataConstructor,
  DataDeclaration,
  isDataDeclaration,
  RecordConstructor,
  TupleConstructor,
  TypeParameter,
  VoidConstructor,
} from "@typed-lang/parser";
import {
  addTypeParameters,
  forEachNodeNewLine,
  getTypeParametersFromFields,
} from "../shared/utils.js";

export class DataDeclarationGuardGenerator extends codeGen(
  isDataDeclaration,
  addDataDeclarationGuards
) {}

function addDataDeclarationGuards(
  ctx: CodeGeneratorContext,
  decl: DataDeclaration
) {
  addDataConstructorGuards(ctx, decl);
  ctx.modules.addNewLine(2);
  addDataDeclarationGuard(ctx, decl);
  ctx.modules.addNewLine();
}

function addDataConstructorGuards(
  ctx: CodeGeneratorContext,
  decl: DataDeclaration
) {
  forEachNodeNewLine(ctx, decl.constructors, 2, (c) => { 
    addDataConstructorGuard(ctx, c, decl);
  })
}

function addDataConstructorGuard(
  ctx: CodeGeneratorContext,
  constructor: DataConstructor,
  decl: DataDeclaration
) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return addVoidConstructorGuard(ctx, constructor, decl);
    case "TupleConstructor":
    case "RecordConstructor":
      return addParameterizedConstructorGuard(ctx, constructor, decl);
  }
}

function addVoidConstructorGuard(
  ctx: CodeGeneratorContext,
  constructor: VoidConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  ctx.modules.addSegment(
    `export declare function is${constructor.name}`,
    constructor.span.start
  );
  addTypeParameters(ctx, decl.typeParameters);
  ctx.modules.addSegment(`(`);
  ctx.modules.addSegment(`${valueName}`, constructor.span.start);
  ctx.modules.addSegment(`: `);
  ctx.modules.addSegment(`${decl.name}`, decl.nameSpan.start);
  addTypeParameters(ctx, decl.typeParameters);
  ctx.modules.addSegment(`): `, constructor.span.start);
  ctx.modules.addSegment(
    `${valueName} is ${constructor.name}`,
    constructor.span.start
  );
}

const uncapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

function addParameterizedConstructorGuard(
  ctx: CodeGeneratorContext,
  constructor: TupleConstructor | RecordConstructor,
  decl: DataDeclaration
) {
  const valueName = uncapitalize(decl.name);

  ctx.modules.addSegment(
    `export declare function is${constructor.name}`,
    constructor.span.start
  );
  addTypeParameters(ctx, decl.typeParameters);
  ctx.modules.addSegment(`(`);
  ctx.modules.addSegment(`${valueName}`, constructor.span.start);
  ctx.modules.addSegment(`: `, constructor.span.start);
  ctx.modules.addSegment(`${decl.name}`, decl.nameSpan.start);
  addTypeParameters(ctx, decl.typeParameters);
  ctx.modules.addSegment(`): `, constructor.span.start);
  ctx.modules.addSegment(
    `${valueName} is ${constructor.name}`,
    constructor.span.start
  );
  addTypeParameters(ctx, getTypeParametersFromFields(constructor.fields));
}

function addDataDeclarationGuard(
  ctx: CodeGeneratorContext,
  decl: DataDeclaration
) {
  const valueName = `u`;
  ctx.modules.addSegment(`export declare function `, decl.span.start);
  ctx.modules.addSegment(`is${decl.name}`, decl.nameSpan.start);
  ctx.modules.addSegment(`(${valueName}: unknown): ${valueName} is `);
  ctx.modules.addSegment(`${decl.name}`, decl.nameSpan.start);
  addTypeParameters(ctx, decl.typeParameters.map(
    (tp) => new TypeParameter(`unknown`, tp.span)
  ));
}