import {
  DecodedSourceMap,
  GenMapping,
  setSourceContent,
  toDecodedMap,
  addMapping,
} from "@jridgewell/gen-mapping";
import {
  DataDeclaration,
  SourceFile,
  Statement,
  SpanLocation,
  Span,
  DataConstructor,
  TupleConstructor,
  VoidConstructor,
  RecordConstructor,
  TypeParameter,
} from "@typed-lang/parser";
import { ident } from "./utils.js";

export interface DtsCompilerOutput {
  readonly code: string;
  readonly map: DecodedSourceMap;
}

export interface MapLocation {
  readonly line: number;
  readonly column: number;
}

export class DtsCompiler {
  private map: GenMapping;
  private code: string = "";
  private pos: number = 0;
  private line: number = 1;
  private column: number = 0;
  private identationLevel: number = 0;

  constructor(readonly sourceFile: SourceFile, readonly source: string) {
    this.map = new GenMapping({ file: sourceFile.fileName });
    setSourceContent(this.map, sourceFile.fileName, source);
  }

  compile = (): DtsCompilerOutput => {
    this.compileDts();

    return {
      code: this.code,
      map: toDecodedMap(this.map),
    };
  };

  private compileDts() {
    this.sourceFile.statements.forEach((statement) =>
      this.compileDtsStatement(statement)
    );
  }

  private compileDtsStatement(statement: Statement) {
    switch (statement._tag) {
      case "DataDeclaration":
        return this.compileDataDeclarationStatement(statement);
      case "TypeAlias":
        throw new Error("Not implemented");
    }
  }

  private compileDataDeclarationStatement(data: DataDeclaration) {
    this.addStartLocationCode(`export declare namespace ${data.name} {`, data.span.start, data.name, data.name);
    this.addCode(`\n  `);
    this.increaseIdentation();
    this.compileDataTypeDeclaration(data);
    this.decreaseIdentation();
    this.addCode(`\n`);
    this.addEndLocationCode(`}`, data.span.end);
    // TODO: Compile constructor interfaces
    // TODO: Compile constructor functions
    // TODO: Compile constructor guards
    // TODO: Compile refinement from unknown
    // TODO: Compile equivalence
    // TODO: Compile fast-check arbitraries
    // TODO: Compile encoders
    // TODO: Compile decoders
  }

  private compileDataTypeDeclaration(data: DataDeclaration) {
    this.addStartLocationCode(`export type `, data.span.start, undefined, `data`);
    this.addStartLocationCode(`${data.name}`, data.nameSpan.start, data.name, data.name);
    this.compileTypeParameters(data.typeParameters);
    this.compileEqualsSign(data.equalsSpan)
    this.increaseIdentation()
    this.compileDataDeclarationConstructorTypeReferences(data);
    this.decreaseIdentation()
    this.addEndLocationCode(`;`, data.span.end);
  }

  private compileTypeParameters(typeParameters: readonly TypeParameter[]) {
    if (typeParameters.length === 0) {
      return;
    }

    this.addStartLocationCode(`<`, typeParameters[0].span.start);
    typeParameters.forEach((typeParameter, index) => {
      this.addStartLocationCode(typeParameter.name, typeParameter.span.start);
      this.addEndLocationCode(
        index === typeParameters.length - 1 ? `>` : `,`,
        typeParameter.span.end
      );
    });
  }

  private compileEqualsSign(span: Span) {
    this.addStartLocationCode(` `, span.start)
    this.addStartLocationCode(`=`, span.start);
    this.addEndLocationCode(` `, span.end);
  }

  private compileDataDeclarationConstructorTypeReferences(data: DataDeclaration) {
    if (data.constructors.length === 0) return
      
    if (data.constructors.length === 1) {
      this.compileDataDeclarationConstructorTypeReference(data.constructors[0]);
      return
    }

    this.addCode(`\n  | `)
    this.compileDataDeclarationConstructorTypeReference(data.constructors[0]);

    for (let i = 1; i < data.constructors.length; i++) {
      this.addCode(`\n  | `)
      this.compileDataDeclarationConstructorTypeReference(data.constructors[i]);
    }
  }

  private compileDataDeclarationConstructorTypeReference(
    constructor: DataConstructor
  ) {
    switch (constructor._tag) {
      case 'VoidConstructor':
        return this.compileVoidConstructorTypeReference(constructor);
      case 'TupleConstructor':
        return this.compileTupleConstructorTypeReference(constructor);
      case 'RecordConstructor':
        return this.compileRecordConstructorTypeReference(constructor);
    }
  }

  private compileVoidConstructorTypeReference(constructor: VoidConstructor) {
    this.addStartLocationCode(constructor.name, constructor.span.start, constructor.name);
  }

  private compileTupleConstructorTypeReference(constructor: TupleConstructor) {
    this.addStartLocationCode(constructor.name, constructor.span.start, constructor.name);
    this.compileFieldTypeParameters(constructor.fields);
  }

  private compileRecordConstructorTypeReference(constructor: RecordConstructor) {
    this.addStartLocationCode(constructor.name, constructor.span.start, constructor.name);
    this.compileFieldTypeParameters(constructor.fields);
  }

  private compileFieldTypeParameters(fields: TupleConstructor['fields']) {
    const typeParameters = fields.flatMap((field) => field.type._tag === 'TypeReference' ? [new TypeParameter(field.type.name, field.type.span)] : []);
    if (typeParameters.length === 0) {
      return;
    }

    this.compileTypeParameters(typeParameters);
  }

  // private compileFields(fields: TupleConstructor['fields'], separator: string) {
  //   fields.forEach((field, index) => {
  //     this.addStartLocationCode(getFieldName(field, index), field.span.start);
  //     this.addEndLocationCode(index === fields.length - 1 ? '' : separator, field.span.end);
  //   });
  // }
  
  private addStartLocationCode(code: string, sourceLocation: SpanLocation, name?: string, content?: string) {
    const span = this.addCode(code);
    this.addMapping(sourceLocation, getStartSpanMapLocation(span), name, content);
  }

  private addEndLocationCode(code: string, sourceLocation: SpanLocation, name?: string, content?: string) {
    const span = this.addCode(code);
    this.addMapping(sourceLocation, getEndSpanMapLocation(span), name, content)
  }

  private addCode(code: string): Span {
    const start = this.location;
    const identedCode = ident(code, this.identationLevel);
    this.code += identedCode;
    this.pos += identedCode.length;

    const lines = identedCode.split(/\n/g);
    const newLines = lines.length - 1;

    if (newLines > 0) {
      this.line += newLines;
      this.column = getNextColumnPosition(lines[lines.length - 1]);
    } else {
      this.column += identedCode.length;
    }

    const end = this.location;

    return new Span(start, end);
  }

  private addMapping(
    sourceLoction: MapLocation,
    targetLocation: MapLocation,
    name?: string,
    content?: string,
  ) {
    const options = {
      original: sourceLoction,
      generated: targetLocation,
      source: this.sourceFile.fileName,
      name: name as string,
      content,
    }

    addMapping(this.map, options);
  }

  private increaseIdentation() {
    this.identationLevel++;
  }

  private decreaseIdentation() {
    this.identationLevel--;
  }

  get location(): SpanLocation {
    return new SpanLocation(this.pos, this.line, this.column);
  }
}

function getNextColumnPosition(line: string) {
  if (/\n/.test(line)) {
    return (line.split("\n").pop() as string).length;
  }

  return line.length;
}

function getStartSpanMapLocation(span: Span): MapLocation {
  return {
    line: span.start.line,
    column: span.start.column,
  };
}

function getEndSpanMapLocation(span: Span): MapLocation {
  return {
    line: span.end.line,
    column: span.end.column,
  };
}