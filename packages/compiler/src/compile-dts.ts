import {
  DataConstructor,
  DataDeclaration,
  Field,
  NamedField,
  RecordConstructor,
  RecordType,
  SourceFile,
  Statement,
  TupleConstructor,
  TupleType,
  Type,
  TypeAlias,
  TypeParameter,
  TypeReference,
  VoidConstructor,
} from "@typed/parser";

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

// Add identation to all new lines
function ident(str: string): string {
  return str
    .split("\n")
    .map((s) => `  ${s}`)
    .join("\n");
}

function compileDataDeclarationType(declaration: DataDeclaration): string {
  let str = `export type ${declaration.name}`;

  str += compileTypeParameters(declaration.typeParameters);

  if (declaration.constructors.length === 1) {
    str += ` = ${compileDataConstructorTypeReference(
      declaration.constructors[0]
    )}`;
  } else {
    str +=
      ` =` +
      ident(
        "\n| " +
          declaration.constructors
            .map(compileDataConstructorTypeReference)
            .join("\n| ")
      );
  }

  return str;
}

function compileDataConstructorTypeReference(constructor: DataConstructor) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorTypeReference(constructor);
    case "TupleConstructor":
      return compileTupleConstructorTypeReference(constructor);
    case "RecordConstructor":
      return compileRecordConstructorTypeReference(constructor);
  }
}

function compileVoidConstructorTypeReference(
  constructor: VoidConstructor
): string {
  return `${constructor.name}`;
}

function compileTupleConstructorTypeReference(
  constructor: TupleConstructor
): string {
  let str = `${constructor.name}`;

  const typeParams: string[] = [];

  for (const field of constructor.fields) {
    if (field.type._tag === "TypeReference") {
      typeParams.push(field.type.name);
    }
  }

  if (typeParams.length > 0) {
    str += `<${typeParams.join(", ")}>`;
  }

  return str;
}

function compileRecordConstructorTypeReference(
  constructor: RecordConstructor
): string {
  let str = `${constructor.name}`;

  const typeParams: string[] = [];

  for (const field of constructor.fields) {
    if (field.type._tag === "TypeReference") {
      typeParams.push(field.type.name);
    }
  }

  if (typeParams.length > 0) {
    str += `<${typeParams.join(", ")}>`;
  }

  return str;
}

function compileDataConstructorInterface(constructor: DataConstructor): string {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorInterface(constructor);
    case "TupleConstructor":
      return compileTupleConstructorInterface(constructor);
    case "RecordConstructor":
      return compileRecordConstructorInterface(constructor);
  }
}

function compileVoidConstructorInterface(constructor: VoidConstructor): string {
  let str = `export interface ${constructor.name} {\n`;
  str += `  readonly _tag: '${constructor.name}'\n`;
  str += `}\n`;

  return str;
}

function compileTupleConstructorInterface(
  constructor: TupleConstructor
): string {
  let str = `export interface ${
    constructor.name
  }${compileConstructorTypeParameters(constructor.fields)} {\n`;
  str += ident(`readonly _tag: '${constructor.name}'`) + "\n";
  str += ident(
    constructor.fields.map(compileReadonlyFieldsTypeReference).join("\n")
  );
  str += "\n}\n";
  return str;
}

function compileRecordConstructorInterface(
  constructor: RecordConstructor
): string {
  let str = `export interface ${
    constructor.name
  }${compileConstructorTypeParameters(constructor.fields)} {\n`;
  str += ident(`readonly _tag: '${constructor.name}'`) + "\n";
  str += ident(
    constructor.fields.map(compileReadonlyFieldsTypeReference).join("\n")
  );
  str += "\n}\n";
  return str;
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

function compileReadonlyFieldsTypeReference(
  field: Field,
  index: number
): string {
  return `readonly ${compileFieldsTypeReference(field, index)}`;
}

function compileFieldsTypeReference(field: Field, index: number): string {
  switch (field._tag) {
    case "TypeField":
      return `arg${index}: ${compileType(field.type)}`;
    case "NamedField":
      return `${field.name}: ${compileType(field.type)}`;
  }
}

function compileTypeParameters(
  typeParameters: readonly TypeParameter[]
): string {
  if (typeParameters.length === 0) return "";

  return `<${typeParameters.map((p) => p.name).join(", ")}>`;
}

function compileType(type: Type): string {
  switch (type._tag) {
    case "TypeReference":
      return compileTypeReference(type);
    case "RecordType":
      return compileRecordType(type);
    case "TupleType":
      return compileTupleType(type);
  }
}

function compileTypeReference(type: TypeReference): string {
  return type.name;
}

function compileRecordType(type: RecordType): string {
  return `{ ${type.fields.map(compileFieldsTypeReference).join(", ")} }`;
}

function compileTupleType(type: TupleType): string {
  return `[${type.fields.map(compileFieldsTypeReference).join(", ")}]`;
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
  return `export declare const ${constructor.name}: ${constructor.name}`;
}

function compileTupleConstructorConstructor(
  constructor: TupleConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileTupleConstructorFunctionParameters(
    constructor.fields
  );

  return `export declare const ${constructor.name}: ${typeParams}(${functionParams}) => ${returnType}`;
}

function compileRecordConstructorConstructor(
  constructor: RecordConstructor
): string {
  const typeParams = compileConstructorTypeParameters(constructor.fields);
  const returnType = `${constructor.name}${typeParams}`;
  const functionParams = compileRecordConstructorFunctionParameters(
    constructor.fields
  );
  return `export declare const ${constructor.name}: ${typeParams}(${functionParams}) => ${returnType}`;
}

function getFieldName(field: Field, index: number): string {
  return field._tag === "NamedField" ? field.name : `arg${index}`;
}

function compileTupleConstructorFunctionParameters(
  fields: readonly Field[]
): string {
  return fields
    .map((f, i) => `${getFieldName(f, i)}: ${compileType(f.type)}`)
    .join(", ");
}

function compileRecordConstructorFunctionParameters(
  fields: readonly NamedField[]
): string {
  return `params: { ${fields
    .map((f) => `readonly ${f.name}: ${compileType(f.type)} `)
    .join(";")}}`;
}
