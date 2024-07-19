import {
  AST,
  SourceFile,
  Span,
  SpanLocation,
  Statement,
  isSourceFile,
} from "@typed-lang/parser";
import { ImportManager } from "./ImportManager";
import {
  addMapping,
  EncodedSourceMap,
  GenMapping,
  setSourceContent,
  toEncodedMap,
} from "@jridgewell/gen-mapping";
import { dirname, relative } from "path";
import { U } from "ts-toolbelt";
import { forEachNodeNewLine } from "./generators/shared/utils";

type AllStatements = U.ListOf<Statement>;
type AllStatementGenerators = {
  [K in keyof AllStatements]: AllStatements[K] extends AST
    ? CodeGeneratorConstructor<AllStatements[K]>
    : never;
};

export type StatementGenerators =
  | AllStatementGenerators[keyof AllStatementGenerators]
  | CodeGeneratorConstructor<Statement>;

export interface CodeGeneratorConstructor<T extends AST> {
  readonly matches: (node: AST) => node is T;

  new (service: CodeGeneratorContext, node: T): CodeGenerator<T>;
}

export interface CodeGenerator<T> {
  readonly node: T;
  readonly context: CodeGeneratorContext;
  readonly generate: () => void;
}

export interface CodeGeneratorContext {
  readonly modules: ModulesManager;
  readonly imports: ImportManager;
  readonly identation: IdentationManager;
  readonly content: (span: Span) => string;
}

export interface ModulesManager {
  readonly run: <T extends AST>(
    constructor: CodeGeneratorConstructor<T>,
    node: T
  ) => void;
  readonly runModule: (
    name: string,
    f: (context: CodeGeneratorContext) => void,
    sourceLocation?: SpanLocation | null
  ) => void;

  readonly addSegment: (
    text: string,
    sourceLocation?: SpanLocation | null | undefined,
    name?: string,
    content?: string
  ) => Line;
  readonly addLine: (...segments: readonly TextSnippet[]) => Line;
  readonly addNewLine: (num?: number) => Line;
}

export interface IdentationManager {
  readonly get: () => number;
  readonly padding: () => string;
  readonly increase: () => void;
  readonly decrease: () => void;
  readonly with: (f: () => void) => void;
}

export const codeGen = <T extends AST>(
  matches: (node: AST) => node is T,
  generate: (context: CodeGeneratorContext, node: T) => void
): CodeGeneratorConstructor<T> => {
  return class implements CodeGenerator<T> {
    static matches = matches;
    constructor(readonly context: CodeGeneratorContext, readonly node: T) {}

    readonly generate = () => generate(this.context, this.node);
  };
};

export function fileGenerator(
  constructors: ReadonlyArray<StatementGenerators>
): CodeGeneratorConstructor<SourceFile> {
  return class FileGenerator extends codeGen(
    isSourceFile,
    (manager, sourceFile) => {
      forEachNodeNewLine(manager, sourceFile.statements, 2, (statement) => {
        const constructor = constructors.find((c) => c.matches(statement));

        if (constructor) {
          manager.modules.run(
            constructor as CodeGeneratorConstructor<Statement>,
            statement
          );
        } else {
          throw new Error(
            `No code generator found for statement: ${statement._tag}`
          );
        }
      });
    }
  ) {};
}

export function buildModule(
  sourceFile: SourceFile,
  generators: readonly StatementGenerators[],
  extension: ".ts" | ".d.ts"
): Module {
  const ctx = new CodeGeneratorContextImpl(sourceFile, extension);

  ctx.modules.run(fileGenerator(generators), sourceFile);

  return new Module(sourceFile.fileName, sourceFile.source, ctx.getLines());
}

export type CompileOutput = {
  readonly [moduleName: string]: CompiledModule;
};

export type CompiledModule = {
  readonly name: string;
  readonly code: string;
  readonly map: EncodedSourceMap;
};

export function compileModule(
  module: Module,
  extension: ".ts" | ".d.ts"
): CompileOutput {
  const output: Record<string, CompiledModule> = {};
  const modulesToProcess = [module];

  const addModule = (mod: Module) => modulesToProcess.push(mod);

  while (modulesToProcess.length > 0) {
    const mod = modulesToProcess.shift()!;
    output[mod.fileName] = new ModuleCompiler(
      module.fileName,
      extension,
      mod,
      addModule
    ).compile();
  }

  return output;
}

class ModuleCompiler {
  private map: GenMapping;
  private code: string = "";
  readonly location: SpanLocation = new SpanLocation(0, 1, 0);

  constructor(
    readonly fileName: string,
    readonly extension: ".ts" | ".d.ts",
    readonly module: Module,
    readonly onModule: (mod: Module) => void
  ) {
    this.map = new GenMapping({ file: module.fileName });
    setSourceContent(this.map, fileName, module.source);
  }

  compile(): CompiledModule {
    const { lines } = this.module;
    for (let i = 0; i < lines.length; i++) {
      const lineOrModule = lines[i];
      if (lineOrModule._tag === "Line") {
        this.compileLine(lineOrModule, i === 0);
      } else {
        this.compileModule(lineOrModule, i === 0);
        this.onModule(lineOrModule);
      }
    }

    return {
      name: this.module.fileName,
      code: this.code,
      map: toEncodedMap(this.map),
    };
  }

  private compileLine(line: Line, isFirst: boolean) {
    if (!isFirst) {
      this.addNewLine();
    }

    for (const snippet of line.snippets) {
      const targetLocation = this.location.clone();
      this.addCode(snippet.text);
      if (snippet.sourceLocation) {
        this.addMapping(
          snippet.sourceLocation,
          targetLocation,
          snippet.name,
          snippet.content
        );
      }
    }
  }

  private compileModule(module: Module, isFirst: boolean) {
    if (!isFirst) {
      this.addNewLine();
    }

    const targetLocation = this.location.clone();
    const modName = getModuleName(module.fileName, this.extension);
    const code = `export * as ${modName} from "${ensureRelative(
      this.fileName,
      module.fileName.replace(this.extension, ".js")
    )}"`;
    this.addCode(code);
    if (module.sourceLocation) {
      this.addMapping(
        module.sourceLocation,
        targetLocation,
        modName,
        module.source
      );
    }
  }

  private addNewLine() {
    this.code += "\n";
    this.location.position++;
    this.location.line++;
    this.location.column = 0;
  }

  private addCode(code: string) {
    this.code += code;
    this.location.position += code.length;
    this.location.column += code.length;
  }

  private addMapping(
    sourceLoction: MapLocation,
    targetLocation: MapLocation,
    name?: string,
    content?: string
  ) {
    const options = {
      original: sourceLoction,
      generated: targetLocation,
      source: this.fileName,
      name: name as string,
      content,
    };

    addMapping(this.map, options);
  }
}

function getModuleName(fileName: string, extension: ".ts" | ".d.ts"): string {
  const nameParts = fileName.replace(extension, "").split(".");
  return nameParts[nameParts.length - 1];
}

function ensureRelative(from: string, to: string): string {
  const rel = relative(dirname(from), to);

  if (rel.startsWith(".")) return rel;

  return `./${rel}`;
}

export interface MapLocation {
  readonly line: number;
  readonly column: number;
}

class CodeGeneratorContextImpl implements CodeGeneratorContext {
  readonly modules: ModulesManager;

  constructor(
    readonly sourceFile: SourceFile,
    readonly extension: ".ts" | ".d.ts",
    readonly identation: IdentationManager = new IdentationManagerImpl(),
    readonly imports: ImportManager = new ImportManager(),
    readonly lines: Array<Line | Module> = []
  ) {
    this.modules = new ModulesManagerImpl(this, lines);
  }

  content = (span: Span) =>
    this.sourceFile.source.slice(span.start.position, span.end.position);

  withModule = (module: Module): CodeGeneratorContextImpl =>
    new CodeGeneratorContextImpl(
      this.sourceFile,
      this.extension,
      this.identation,
      this.imports,
      module.lines
    );

  getLines = () => {
    const imports = Array.from(this.imports.imports.values(), (i) =>
      new Line(this.identation).add(new TextSnippet(i.toCode()))
    );

    return [
      ...(imports.length > 0 ? [...imports, new Line(this.identation)] : []),
      ...this.lines,
    ];
  };
}

class ModulesManagerImpl implements ModulesManager {
  constructor(
    readonly context: CodeGeneratorContextImpl,
    private lines: Array<Line | Module>
  ) {}

  runModule = (
    name: string,
    f: (context: CodeGeneratorContext) => void,
    sourceLocation?: SpanLocation | null
  ): void => {
    const moduleName = this.context.sourceFile.fileName + "." + name + ".ts";
    const module = new Module(
      moduleName,
      this.context.sourceFile.source,
      [],
      sourceLocation
    );
    f(this.context.withModule(module));
    this.lines.push(module);
  };

  run = <T extends AST>(constructor: CodeGeneratorConstructor<T>, node: T) => {
    new constructor(this.context, node).generate();
  };

  addSegment = (
    text: string,
    sourceLocation?: SpanLocation | null,
    name?: string,
    content?: string
  ) => {
    const line = this.getCurrentLine();
    line.add(new TextSnippet(text, sourceLocation, name, content));
    return line;
  };

  addLine = (...segments: ReadonlyArray<TextSnippet>) => {
    const line = new Line(this.context.identation);
    this.lines.push(line.add(...segments));
    return line;
  };

  addNewLine = (num?: number) => {
    if (!num) return this.addANewLine();

    let line: Line;
    for (let i = 0; i < num; i++) {
      line = this.addANewLine();
    }
    return line!;
  };

  addANewLine = () => {
    const line = new Line(this.context.identation);
    this.lines.push(line);
    return line;
  };

  private getCurrentLine() {
    if (this.lines.length === 0) {
      return this.addNewLine();
    }

    const last = this.lines[this.lines.length - 1];
    if (last._tag === "Line") return last;

    return this.addNewLine();
  }
}

class IdentationManagerImpl implements IdentationManager {
  private level = 0;

  get = () => this.level;

  padding = () => "  ".repeat(this.level);

  increase = () => this.level++;

  decrease = () => this.level--;

  with = (f: () => void) => {
    this.increase();
    f();
    this.decrease();
  };
}

export class Module {
  readonly _tag = "Module";

  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly lines: Array<Line | Module>,
    readonly sourceLocation: SpanLocation | null = null
  ) {}
}

export class Line {
  readonly _tag = "Line";

  readonly snippets: TextSnippet[] = [];

  constructor(readonly identation: IdentationManager) {}

  add(...snippets: ReadonlyArray<TextSnippet>): Line {
    if (snippets.length === 0) return this;

    // If the line is empty and the identation is greater than 0, add padding
    if (this.snippets.length === 0 && this.identation.get() > 0) {
      this.snippets.push(new TextSnippet(this.identation.padding()));
    }

    // Add the snippets to the line
    this.snippets.push(...snippets);

    return this;
  }
}

export class TextSnippet {
  readonly _tag = "TextSnippet";
  constructor(
    readonly text: string,
    readonly sourceLocation: SpanLocation | null = null,
    readonly name?: string,
    readonly content?: string
  ) {}
}
