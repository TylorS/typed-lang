import { SourceFile, Span } from "@typed-lang/parser";
import { IdentationManager } from "./IdentationManager.js";
import { ImportManager } from "./ImportManager.js";

export interface MappedDocumentGenerator {
  readonly ctx: MappedDocumentCtx;

  addText(
    text: string,
    options?: {
      span: Span;
      name?: string;
      content?: string;
    }
  ): void;

  addLines(lines: ReadonlyArray<string>): void;

  addNewLine(newLines?: number): void;

  addModule(
    fileName: string,
    span: Span,
    f: (ctx: MappedDocumentGenerator) => void,
    skipExport?: boolean
  ): void;

  withIdent(f: () => void): void;

  withSpan(data: MapData, f: (ctx: MappedDocumentGenerator) => void): void;
}

export class MappedDocumentCtx {
  constructor(
    readonly sourceFile: SourceFile,
    readonly extension: ".ts" | ".d.ts",
    readonly identation: IdentationManager,
    readonly imports: ImportManager
  ) {}
}

export interface MapData {
  readonly span: Span;
  readonly name?: string;
  readonly content?: string;
}

class LineAndModuleGenerator
  implements MappedDocumentGenerator, Iterable<Module | LineSegment>
{
  protected linesAndModules: Array<Module | LineSegment> = [];

  constructor(readonly ctx: MappedDocumentCtx) {}

  [Symbol.iterator](): Iterator<Module | LineSegment> {
    return this.linesAndModules.values();
  }

  addText(text: string, options?: MapData): void {
    const lines = text.split("\n").filter(Boolean);

    if (lines.length === 1) {
      this.addTextToCurrentLine(text, options);
    } else if (options) {
      this.withSpan(options, (ctx) => ctx.addLines(lines));
    } else {
      this.addLines(lines);
    }
  }

  addNewLine(newLines: number = 1) {
    for (let i = 0; i < newLines; i++) {
      this.linesAndModules.push(new NewLine());
    }
  }

  addModule(
    fileName: string,
    span: Span,
    f: (ctx: MappedDocumentGenerator) => void,
    isExported?: boolean
  ): void {
    const module = new Module(
      this.ctx,
      fileName,
      this.ctx.extension,
      this.ctx.sourceFile.source,
      {
        span,
        name: getModuleName(fileName, this.ctx.extension),
        content: this.ctx.sourceFile.source.slice(
          span.start.position,
          span.end.position
        ),
      },
      isExported
    );
    this.linesAndModules.push(module);
    f(module);
  }

  withSpan(data: MapData, f: (ctx: MappedDocumentGenerator) => void): void {
    const spanned = new Spanned(this.ctx, data);
    this.linesAndModules.push(spanned);
    f(spanned);
  }

  withIdent(f: () => void): void {
    this.linesAndModules.push(new Ident(this.ctx.identation.increase()));
    f();
    this.linesAndModules.push(new Ident(this.ctx.identation.decrease()));
  }

  private addTextToCurrentLine(text: string, options?: MapData): void {
    this.linesAndModules.push(new TextSnippet(text, options));
  }

  addLines(lines: ReadonlyArray<string>): void {
    this.addTextToCurrentLine(lines[0]);

    for (let i = 1; i < lines.length; i++) {
      this.addNewLine();
      this.addTextToCurrentLine(lines[i]);
    }
  }
}

export class Module
  extends LineAndModuleGenerator
  implements Iterable<Module | LineSegment>
{
  readonly _tag = "Module";

  constructor(
    readonly ctx: MappedDocumentCtx,
    readonly fileName: string,
    readonly extension: ".ts" | ".d.ts",
    readonly source: string,
    readonly data: MapData,
    readonly isExported: boolean = true
  ) {
    super(ctx);
  }
}

export type LineSegment = TextSnippet | Spanned | NewLine | Ident;

export class NewLine {
  readonly _tag = "NewLine";
}

export class Ident {
  readonly _tag = "Ident";
  constructor(readonly ident: number) {}
}

export class TextSnippet {
  readonly _tag = "TextSnippet";
  constructor(readonly text: string, readonly data?: MapData) {}
}

export class Spanned extends LineAndModuleGenerator {
  readonly _tag = "Spanned";

  constructor(readonly ctx: MappedDocumentCtx, readonly data: MapData) {
    super(ctx);
  }
}

export function generateModule(
  sourceFile: SourceFile,
  extension: ".ts" | ".d.ts"
): Module {
  const ctx = new MappedDocumentCtx(
    sourceFile,
    extension,
    new IdentationManager(),
    new ImportManager()
  );
  return new Module(
    ctx,
    sourceFile.fileName + extension,
    extension,
    sourceFile.source,
    {
      span: sourceFile.span,
      content: sourceFile.source,
    }
  );
}

function getModuleName(fileName: string, extension: ".ts" | ".d.ts"): string {
  const nameParts = fileName.replace(extension, "").split(".");
  return nameParts[nameParts.length - 1];
}
