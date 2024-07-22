import * as ts from "typescript";
import { TypedSnapshot, TypedSnapshots } from "./snapshots.js";
import { parse, SourceFile } from "@typed-lang/parser";
import { Module, generateModule } from "./MappedDocumentGenerator.js";
import { compileModule } from "./ModuleCompiler.js";

// TODO: Manage file-watchers for .typed files

export class CompilerService {
  readonly snapshots: TypedSnapshots;

  private dependencies = new Map<string, Set<string>>();

  constructor(
    readonly generator: (module: Module, file: SourceFile) => void,
    readonly extension: ".ts" | ".d.ts",
    readonly module: "single" | "multiple",
  ) {
    this.snapshots = new TypedSnapshots(extension);
  }

  getSnapshot(fileName: string): TypedSnapshot | undefined {
    return this.snapshots.get(fileName);
  }

  has(fileName: string): boolean {
    return this.snapshots.get(fileName) !== undefined;
  }

  getScriptVersion(fileName: string): string {
    const snapshot = this.getSnapshot(fileName);
    return snapshot ? snapshot.version.toString() : "-1";
  }

  getScriptFileNames(): Iterable<string> {
    return this.snapshots.getFileNames();
  }

  hasDependencies(fileName: string): boolean {
    return this.dependencies.has(fileName);
  }

  getDependencies(fileName: string): Iterable<string> {
    return this.dependencies.get(fileName) ?? [];
  }

  compile = (fileName: string, source: string): TypedSnapshot => {
    const existing = this.snapshots.get(fileName);
    if (existing && existing.source === source) return existing;

    const sourceFile = parse(fileName, source);
    const module = generateModule(sourceFile, this.extension, this.module);

    this.generator(module, sourceFile);

    const outputs = compileModule(module);
    const compiled = outputs[module.fileName];
    const output = this.snapshots.set(
      module.fileName,
      source,
      ts.ScriptSnapshot.fromString(compiled.code),
      compiled.map,
      compiled.mappings
    );

    // Add all modules to the snapshots
    for (const name in outputs) {
      if (name === module.fileName) continue;

      const { code, map, mappings } = outputs[name];
      this.snapshots.set(
        name,
        source,
        ts.ScriptSnapshot.fromString(code),
        map,
        mappings
      );
      this.addDependency(fileName, name);
    }

    // Return the compiled module
    return output;
  };

  private addDependency(fileName: string, dependency: string) {
    const deps = this.dependencies.get(fileName) ?? new Set();
    deps.add(dependency);
    this.dependencies.set(fileName, deps);
  }
}
