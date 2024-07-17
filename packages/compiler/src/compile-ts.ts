import {
  DataDeclaration,
  RecordConstructor,
  SourceFile,
  Statement,
  TupleConstructor,
  TypeAlias,
} from "@typed-lang/parser";
import * as ts from "typescript";
import {
  compileConstructorTypeParameters,
  compileDataConstructorInterface,
  compileDataDeclarationType,
  compileRecordConstructorFunctionParameters,
  compileTupleConstructorFunctionParameters,
  compileType,
  compileTypeParameters,
  getFieldName,
} from "./compile-shared.js";
import { ident } from "./utils.js";
import { dirname, join, relative } from "node:path";

export type CompileOutput = {
  readonly root: ts.SourceFile;
  readonly modules: ReadonlyArray<ts.SourceFile>;
};

type CompiledModule = {
  readonly name: string;
  readonly source: ts.SourceFile;
};

export function compileTs(file: SourceFile): CompileOutput {
  const modules = file.statements.map(compileStatementToModule(file.fileName));
  const root = ts.createSourceFile(
    file.fileName,
    modules.map(compileModuleRexport(file.fileName)).join("\n"),
    ts.ScriptTarget.ES2022
  );

  return { root, modules: modules.map((m) => m.source) };
}

function compileModuleRexport(rootFileName: string) {
  return (module: CompiledModule) => {
    const relativePath = relative(
      dirname(rootFileName),
      module.source.fileName
    );
    const moduleName = join(".", relativePath).replace(/\.ts$/, "");
    return `export * as ${module.name} from "./${moduleName}.js"`;
  };
}

function compileStatementToModule(rootFileName: string) {
  return (statement: Statement): CompiledModule => {
    switch (statement._tag) {
      case "DataDeclaration":
        return compileDataDeclarationStatement(rootFileName, statement);
      case "TypeAlias":
        return compileTypeAliasStatement(statement);
    }
  };
}
function compileDataDeclarationStatement(
  rootFileName: string,
  declaration: DataDeclaration
): CompiledModule {
  const type = compileDataDeclarationType(declaration);
  const interfaces = declaration.constructors.map(
    compileDataConstructorInterface
  );
  const constructors = declaration.constructors.map(
    compileDataConstructorConstructor
  );
  const source = ts.createSourceFile(
    `${rootFileName}.${declaration.name}.ts`,
    `${type}\n${interfaces.join("\n")}\n${constructors.join("\n")}`,
    ts.ScriptTarget.ES2022
  );

  return { name: declaration.name, source };
}

function compileTypeAliasStatement(alias: TypeAlias): CompiledModule {
  const type = compileType(alias.type);

  const source = ts.createSourceFile(
    `${alias.name}.ts`,
    `export type ${alias.name}${compileTypeParameters(
      alias.typeParameters
    )} = ${type}`,
    ts.ScriptTarget.ES2022
  );

  return { name: alias.name, source };
}

function compileDataConstructorConstructor(
  constructor: DataDeclaration["constructors"][number]
): string {
  switch (constructor._tag) {
    case "VoidConstructor":
      return `export const ${constructor.name}: ${constructor.name} = { _tag: "${constructor.name}" }`;
    case "TupleConstructor":
      return compileTupleConstructorConstructor(constructor);
    case "RecordConstructor":
      return compileRecordConstructorConstructor(constructor);
  }
}

function compileTupleConstructorConstructor(
  constructor: TupleConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileTupleConstructorFunctionParameters(
    constructor.fields
  );
  const functionParamNames = constructor.fields.map(getFieldName);

  return `export const ${
    constructor.name
  } = ${typeParams}(${functionParams}): ${returnType} => ({
  _tag: "${constructor.name}",
${ident(functionParamNames.join(",\n"))}
})`;
}

function compileRecordConstructorConstructor(
  constructor: RecordConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileRecordConstructorFunctionParameters(
    constructor.fields
  );

  return `export const ${constructor.name} = ${typeParams}(${functionParams}): ${returnType} => ({
  _tag: "${constructor.name}",
  ...params,
})`;
}
