import { Span, SpanLocation } from "@typed-lang/parser";
import {
  addMapping,
  EncodedSourceMap,
  GenMapping,
  setSourceContent,
  toEncodedMap,
} from "@jridgewell/gen-mapping";
import {
  Ident,
  LineSegment,
  MapData,
  Module,
  Spanned,
  TextSnippet,
} from "./MappedDocumentGenerator.js";
import { basename, dirname, relative } from "node:path";
import { CodeMapping } from "@volar/language-core";

export type CompileOutput = {
  readonly [moduleName: string]: CompiledModule;
};

export type CompiledModule = {
  readonly name: string;
  readonly code: string;
  readonly map: EncodedSourceMap;
  readonly mappings: CodeMapping[];
};

export function compileModule(module: Module): CompileOutput {
  const output: Record<string, CompiledModule> = {};
  const modulesToProcess = [module];

  const addModule = (mod: Module) => modulesToProcess.push(mod);

  while (modulesToProcess.length > 0) {
    const mod = modulesToProcess.shift()!;
    output[mod.fileName] = new ModuleCompiler(
      module.fileName.replace(module.extension, ""),
      mod.extension,
      mod,
      addModule
    ).compile();
  }

  return output;
}

class ModuleCompiler {
  private map: GenMapping;
  private code: string = "";
  private ident: number = 0;
  private isNewLine: boolean = true;
  private mappings: CodeMapping[] = [];
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
    for (const node of this.module) {
      this.compileNode(node);
    }

    this.addNewLine();
    this.addCode(`//# sourceMappingURL=${basename(this.module.fileName)}.map`);

    return {
      name: this.module.fileName,
      code: this.code,
      map: toEncodedMap(this.map),
      mappings: this.mappings,
    };
  }

  private compileNode(node: Module | LineSegment) {
    switch (node._tag) {
      case "NewLine":
        return this.addNewLine();
      case "Ident":
        return this.compileIdent(node);
      case "Module":
        return this.compileModule(node);
      case "Spanned":
        return this.compileSpanned(node);
      case "TextSnippet":
        return this.compileTextSnippet(node);
    }
  }

  private compileModule(module: Module) {
    if (module.isExported) {
      this.withSpan(module.data, () => {
        const modName = getModuleName(module.fileName, this.extension);
        const importName = ensureRelative(
          this.fileName,
          module.fileName.replace(this.extension, ".js")
        );
        this.addCode(`export * as ${modName} from "${importName}"`);
        this.addNewLine();
      });
    }

    this.onModule(module);
  }

  private compileSpanned(spanned: Spanned) {
    this.withSpan(spanned.data, () => {
      for (const node of spanned) {
        this.compileNode(node);
      }
    });
  }

  private compileTextSnippet(textSnippet: TextSnippet) {
    if (textSnippet.data) {
      this.withSpan(textSnippet.data, () => {
        this.addCode(textSnippet.text);
      });
    } else {
      this.addCode(textSnippet.text);
    }
  }

  private compileIdent(ident: Ident) {
    this.ident = ident.ident;
  }

  private withSpan(sourceLocation: MapData, f: () => void) {
    const start = this.location.clone();
    f();
    const end = this.location.clone();
    this.addMapping(
      sourceLocation.span,
      { start, end },
      sourceLocation.name,
      sourceLocation.content
    );
  }

  private addNewLine() {
    this.code += "\n";
    this.location.position++;
    this.location.line++;
    this.location.column = 0;
    this.isNewLine = true;
  }

  private addCode(code: string) {
    if (this.isNewLine && this.ident) {
      this.isNewLine = false;
      code = "  ".repeat(this.ident) + code;
    }

    this.code += code;
    this.location.position += code.length;
    this.location.column += code.length;
  }

  private addMapping(
    sourceLoction: Span,
    targetLocation: Span,
    name?: string,
    content?: string
  ) {
    addMapping(this.map, {
      original: sourceLoction.start,
      generated: targetLocation.start,
      source: this.fileName,
      name: name as string,
      content,
    });

    addMapping(this.map, {
      original: sourceLoction.end,
      generated: targetLocation.end,
      source: this.fileName,
      name: name as string,
      content,
    });

    this.mappings.push({
      generatedOffsets: [targetLocation.start.position],
      sourceOffsets: [sourceLoction.start.position],
      lengths: [sourceLoction.end.position - sourceLoction.start.position],
      generatedLengths: [
        targetLocation.end.position - targetLocation.start.position,
      ],
      data: {
        verification: true,
        completion: !!name,
        semantic: true,
        navigation: !!name,
        structure: false,
        format: false,
      },
    });
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
