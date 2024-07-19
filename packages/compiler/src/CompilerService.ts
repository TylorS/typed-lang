import * as ts from "typescript";
import { TypedSnapshot, TypedSnapshots } from "./snapshots.js";
import { parse } from "@typed-lang/parser";
import {
  StatementGenerators,
  buildModule,
  compileModule,
} from "./CodeGenerator.js";

// TODO: Manage file-watchers for .typed files

export class CompilerService {
  readonly snapshots: TypedSnapshots;

  private dependencies = new Map<string, Set<string>>();

  constructor(
    readonly generators: ReadonlyArray<StatementGenerators>,
    readonly extension: ".ts" | ".d.ts",
    readonly project?: ts.server.Project
  ) {
    this.snapshots = new TypedSnapshots(project);
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

  compile(fileName: string, source: string): TypedSnapshot {
    const existing = this.snapshots.get(fileName);
    if (existing && existing.source === source) return existing;

    const sourceFile = parse(fileName, source);
    const module = buildModule(sourceFile, this.generators, this.extension);
    const outputs = compileModule(module, this.extension);
    const compiled = outputs[fileName];
    const output = this.snapshots.set(
      fileName,
      source,
      ts.ScriptSnapshot.fromString(compiled.code),
      compiled.map
    );

    // Add all modules to the snapshots
    for (const name in outputs) {
      if (name === fileName) continue;

      const { code, map } = outputs[name];
      this.snapshots.set(name, source, ts.ScriptSnapshot.fromString(code), map);
      this.addDependency(fileName, name);
    }

    // Return the compiled module
    return output;
  }

  private addDependency(fileName: string, dependency: string) { 
    const deps = this.dependencies.get(fileName) ?? new Set();
    deps.add(dependency);
    this.dependencies.set(fileName, deps);
  }
}
