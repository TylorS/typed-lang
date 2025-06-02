import { CodeMapping, VirtualCode } from "@volar/language-core";
import * as ts from "typescript";
import { TypedSnapshot } from "../snapshots";
import { TsCompiler } from "../TsCompiler";
import { typedLanguageId } from "./constants";

export class TypedVirtualCode implements VirtualCode {
  id: string = "root";
  languageId = typedLanguageId;
  mappings!: CodeMapping[];
  embeddedCodes!: VirtualCode[];
  typed: TypedSnapshot;

  constructor(
    public fileName: string,
    public snapshot: ts.IScriptSnapshot,
    compiler: TsCompiler
  ) {
    this.typed = compiler.compile(
      this.fileName,
      this.snapshot.getText(0, this.snapshot.getLength())
    );
    this.embeddedCodes = [typedSnapshotToVirtualCode(this.typed, "typescript")];
    this.mappings = this.typed.mappings
  }
}

function typedSnapshotToVirtualCode(snapshot: TypedSnapshot, id: string): VirtualCode {
  return {
    id,
    languageId: "typescript",
    snapshot: {
      getText: (start, end) => snapshot.getText().slice(start, end),
      getLength: () => snapshot.getText().length,
      getChangeRange: () => undefined,
    },
    mappings: snapshot.mappings,
    embeddedCodes: [],
  };
}
