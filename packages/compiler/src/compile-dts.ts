import {
  DataConstructor,
  DataDeclaration,
  Field,
  RecordConstructor,
  SourceFile,
  Statement,
  TupleConstructor,
  TypeAlias,
  VoidConstructor,
} from "@typed-lang/parser";
import { ident } from "./utils.js";
import {
  compileDataConstructorInterface,
  compileDataDeclarationType,
  compileRecordConstructorFunctionParameters,
  compileTupleConstructorFunctionParameters,
  compileType,
  compileTypeParameters,
} from "./compile-shared.js";

export function compileDts(file: SourceFile): string {
  return file.statements.map(compileStatement).join("\n");
}

function compileStatement(statement: Statement): string {
  switch (statement._tag) {
    case "DataDeclaration":
      return compileDataDeclarationStatement(statement);
    case "TypeAlias":
      return compileTypeAliasStatement(statement);
  }
}

function compileDataDeclarationStatement(declaration: DataDeclaration): string {
  return `export declare namespace ${declaration.name} {
${ident(compileDataDeclarationType(declaration))}

${ident(
  declaration.constructors
    .map((constructor) => compileDataConstructorInterface(constructor))
    .join("\n")
)}
${ident(
  declaration.constructors
    .map((constructor) => compileDataConstructorConstructor(constructor))
    .join("\n")
)}
}`;
}

function compileConstructorTypeParameters(fields: readonly Field[]): string {
  const str = fields
    .flatMap((f) => (f.type._tag === "TypeReference" ? [f.type.name] : []))
    .join(", ");

  if (str.length > 0) {
    return `<${str}>`;
  }

  return str;
}

function compileTypeAliasStatement(alias: TypeAlias): string {
  return `export type ${alias.name}${compileTypeParameters(
    alias.typeParameters
  )} = ${compileType(alias.type)}`;
}

function compileDataConstructorConstructor(
  constructor: DataConstructor
): string {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorConstructor(constructor);
    case "TupleConstructor":
      return compileTupleConstructorConstructor(constructor);
    case "RecordConstructor":
      return compileRecordConstructorConstructor(constructor);
  }
}

function compileVoidConstructorConstructor(
  constructor: VoidConstructor
): string {
  return `export const ${constructor.name}: ${constructor.name}`;
}

function compileTupleConstructorConstructor(
  constructor: TupleConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileTupleConstructorFunctionParameters(
    constructor.fields
  );

  return `export const ${constructor.name}: ${typeParams}(${functionParams}) => ${returnType}`;
}

function compileRecordConstructorConstructor(
  constructor: RecordConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileRecordConstructorFunctionParameters(
    constructor.fields
  );
  return `export const ${constructor.name}: ${typeParams}(${functionParams}) => ${returnType}`;
}
