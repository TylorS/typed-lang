import { DataConstructor, DataDeclaration, Field, NamedField, RecordConstructor, RecordType, TupleConstructor, TupleType, Type, TypeParameter, TypeReference, VoidConstructor } from "@typed/parser";
import { ident } from "./utils";

export function compileDataDeclarationType(declaration: DataDeclaration): string {
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

export function compileTypeParameters(
  typeParameters: readonly TypeParameter[]
): string {
  if (typeParameters.length === 0) return "";

  return `<${typeParameters.map((p) => p.name).join(", ")}>`;
}


export function compileDataConstructorTypeReference(constructor: DataConstructor) {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorTypeReference(constructor);
    case "TupleConstructor":
      return compileTupleConstructorTypeReference(constructor);
    case "RecordConstructor":
      return compileRecordConstructorTypeReference(constructor);
  }
}

export function compileVoidConstructorTypeReference(
  constructor: VoidConstructor
): string {
  return `${constructor.name}`;
}

export function compileTupleConstructorTypeReference(
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

export function compileRecordConstructorTypeReference(
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

export function compileDataConstructorInterface(constructor: DataConstructor): string {
  switch (constructor._tag) {
    case "VoidConstructor":
      return compileVoidConstructorInterface(constructor);
    case "TupleConstructor":
      return compileTupleConstructorInterface(constructor);
    case "RecordConstructor":
      return compileRecordConstructorInterface(constructor);
  }
}

export function compileVoidConstructorInterface(constructor: VoidConstructor): string {
  let str = `export interface ${constructor.name} {\n`;
  str += `  readonly _tag: '${constructor.name}'\n`;
  str += `}\n`;

  return str;
}

export function compileTupleConstructorInterface(
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

export function compileRecordConstructorInterface(
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

export function compileConstructorTypeParameters(fields: readonly Field[]): string {
  const str = fields
    .flatMap((f) => (f.type._tag === "TypeReference" ? [f.type.name] : []))
    .join(", ");

  if (str.length > 0) {
    return `<${str}>`;
  }

  return str;
}

export function compileReadonlyFieldsTypeReference(
  field: Field,
  index: number
): string {
  return `readonly ${compileFieldsTypeReference(field, index)}`;
}

export function compileFieldsTypeReference(field: Field, index: number): string {
  switch (field._tag) {
    case "TypeField":
      return `arg${index}: ${compileType(field.type)}`;
    case "NamedField":
      return `${field.name}: ${compileType(field.type)}`;
  }
}


export function compileType(type: Type): string {
  switch (type._tag) {
    case "TypeReference":
      return compileTypeReference(type);
    case "RecordType":
      return compileRecordType(type);
    case "TupleType":
      return compileTupleType(type);
  }
}

export function compileTypeReference(type: TypeReference): string {
  return type.name;
}

export function compileRecordType(type: RecordType): string {
  return `{ ${type.fields.map(compileFieldsTypeReference).join(", ")} }`;
}

export function compileTupleType(type: TupleType): string {
  return `[${type.fields.map(compileFieldsTypeReference).join(", ")}]`;
}

export function compileTupleConstructorFunctionParameters(
  fields: readonly Field[]
): string {
  return fields
    .map((f, i) => `${getFieldName(f, i)}: ${compileType(f.type)}`)
    .join(", ");
}

export function compileRecordConstructorFunctionParameters(
  fields: readonly NamedField[]
): string {
  return `params: { ${fields
    .map((f) => `readonly ${f.name}: ${compileType(f.type)} `)
    .join(";")}}`;
}

export function getFieldName(field: Field, index: number): string {
  return field._tag === "NamedField" ? field.name : `arg${index}`;
}
