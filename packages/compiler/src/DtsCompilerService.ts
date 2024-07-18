import * as ts from "typescript";
import { TypedSnapshot, TypedSnapshots } from "./snapshots.js";
import { parse } from "@typed-lang/parser";
import { DtsCompiler } from "./DtsCompiler.js";

// TODO: Manage file-watchers for .typed files

export class DtsCompilerService {
  readonly snapshots: TypedSnapshots;

  constructor(readonly project?: ts.server.Project) {
    this.snapshots = new TypedSnapshots(project);
  }

  compile(fileName: string, source: string): TypedSnapshot {
    const existing = this.snapshots.get(fileName)
    if (existing && existing.source === source) return existing

    const sourceFile = parse(fileName, source);
    const output = new DtsCompiler(sourceFile, source).compile();
    return this.snapshots.set(fileName, source, ts.ScriptSnapshot.fromString(output.code), output.map);
  }
}
