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
    `export function is${constructor.name}`,
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
  ctx.modules.addSegment(` {`, constructor.span.start);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `return ${valueName}._tag === "${constructor.name}"`,
      constructor.span.start
    );
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, constructor.span.end);
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
    `export function is${constructor.name}`,
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
  ctx.modules.addSegment(` {`, constructor.span.start);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(
      `return ${valueName}._tag === "${constructor.name}"`,
      constructor.span.start
    );
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, constructor.span.end);
}

function addDataDeclarationGuard(
  ctx: CodeGeneratorContext,
  decl: DataDeclaration
) {
  const valueName = `u`;
  ctx.modules.addSegment(`export function `, decl.span.start);
  ctx.modules.addSegment(`is${decl.name}`, decl.nameSpan.start);
  ctx.modules.addSegment(`(${valueName}: unknown): ${valueName} is `);
  ctx.modules.addSegment(`${decl.name}`, decl.nameSpan.start);
  addTypeParameters(ctx, decl.typeParameters.map(
    (tp) => new TypeParameter(`unknown`, tp.span)
  ));
  ctx.modules.addSegment(` {`);
  ctx.modules.addNewLine();
  ctx.identation.with(() => {
    ctx.modules.addSegment(`return typeof ${valueName} === "object" &&`);
    ctx.modules.addNewLine();
    ctx.identation.with(() => {
      ctx.modules.addSegment(`${valueName} !== null &&`);
      ctx.modules.addNewLine();
      ctx.modules.addSegment(`"_tag" in ${valueName} &&`);
      ctx.modules.addNewLine();
      ctx.modules.addSegment(`(`);
      addConstructorChecks(ctx, valueName, decl.constructors);
      ctx.modules.addSegment(`)`);
    });
  });
  ctx.modules.addNewLine();
  ctx.modules.addSegment(`}`, decl.nameSpan.end);
}

function addConstructorChecks(
  ctx: CodeGeneratorContext,
  valueName: string,
  constructors: ReadonlyArray<DataConstructor>
) {
  if (constructors.length === 1) {
    return addConstructorCheck(ctx, valueName, constructors[0]);
  }

  addConstructorCheck(ctx, valueName, constructors[0]);

  for (let i = 1; i < constructors.length; i++) {
    ctx.modules.addSegment(` || `);
    addConstructorCheck(ctx, valueName, constructors[i]);
  }
}

function addConstructorCheck(
  ctx: CodeGeneratorContext,
  valueName: string,
  constructor: DataConstructor
) {
  ctx.modules.addSegment(
    `${valueName}._tag === "${constructor.name}"`,
    constructor.span.start
  );
}
