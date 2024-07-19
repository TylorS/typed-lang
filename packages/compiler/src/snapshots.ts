import * as ts from "typescript";
import {
  TraceMap,
  SourceMapInput,
  originalPositionFor,
  allGeneratedPositionsFor,
} from "@jridgewell/trace-mapping";
import { EncodedSourceMap } from "@jridgewell/gen-mapping";
import { CodeMapping } from "@volar/language-core";

export class TypedSnapshots {
  private snapshots: Map<string, TypedSnapshot> = new Map();

  constructor(
    readonly extension: string,
    readonly project?: ts.server.Project
  ) {}

  getAll(): Iterable<TypedSnapshot> {
    return this.snapshots.values();
  }

  getFileNames(): Iterable<string> {
    return this.snapshots.keys();
  }

  get(fileName: string): TypedSnapshot | undefined {
    return this.snapshots.get(fileName);
  }

  set(
    fileName: string,
    source: string,
    snapshot: ts.IScriptSnapshot,
    map: EncodedSourceMap,
    mappings: CodeMapping[],
  ): TypedSnapshot {
    const existing = this.snapshots.get(fileName);
    if (existing) {
      existing.update(source, snapshot, map);
      return existing;
    }

    const typed = new TypedSnapshot(
      fileName,
      this.extension,
      source,
      snapshot,
      map,
      mappings
    );
    this.snapshots.set(fileName, typed);

    if (this.project) {
      typed.getOrCreateScriptInfo(this.project);
    }

    return typed;
  }
}

export class TypedSnapshot {
  private _version = 0;

  private _traceMap: TraceMap | null = null;
  private _scriptInfo: ts.server.ScriptInfo | null = null;

  constructor(
    public fileName: string,
    public extension: string,
    public source: string,
    public snapshot: ts.IScriptSnapshot,
    public map: EncodedSourceMap,
    public mappings: CodeMapping[]
  ) {}

  get version(): number {
    return this._version;
  }

  update(source: string, snapshot: ts.IScriptSnapshot, map: EncodedSourceMap) {
    if (this.source === source) return;

    this.source = source;
    this.snapshot = snapshot;
    this.map = map;
    this._traceMap = null;
    this._version++;
  }

  getText() {
    return this.snapshot.getText(0, this.snapshot.getLength());
  }

  getOriginalPosition(line: number, column: number) {
    const traceMap = (this._traceMap ??= new TraceMap(
      this.map as SourceMapInput
    ));
    return originalPositionFor(traceMap, { line, column });
  }

  getGeneratedPositions(line: number, column: number) {
    const traceMap = (this._traceMap ??= new TraceMap(
      this.map as SourceMapInput
    ));

    return allGeneratedPositionsFor(traceMap, {
      line,
      column,
      source: this.fileName,
    });
  }

  getOrCreateScriptInfo(project: ts.server.Project): ts.server.ScriptInfo {
    if (this._scriptInfo) {
      return this._scriptInfo;
    }

    const normalizedPath = ts.server.asNormalizedPath(
      this.fileName + this.extension
    );
    this._scriptInfo =
      project.projectService.getOrCreateScriptInfoForNormalizedPath(
        normalizedPath,
        true,
        this.getText(),
        ts.ScriptKind.TS,
        false,
        {
          fileExists: (path) =>
            path === this.fileName ||
            path === normalizedPath ||
            ts.sys.fileExists(path),
        }
      )!;

    this._scriptInfo.attachToProject(project);

    const sourceMapScriptInfo =
      project.projectService.getOrCreateScriptInfoForNormalizedPath(
        ts.server.asNormalizedPath(normalizedPath + ".map"),
        true,
        JSON.stringify(this.map),
        ts.ScriptKind.JSON,
        false,
        {
          fileExists: (path) =>
            path === this.fileName + ".map" ||
            path === normalizedPath + ".map" ||
            ts.sys.fileExists(path),
        }
      )!;

    sourceMapScriptInfo.attachToProject(project);

    return this._scriptInfo;
  }
}
