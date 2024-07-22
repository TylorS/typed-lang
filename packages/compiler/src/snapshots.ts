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
}
