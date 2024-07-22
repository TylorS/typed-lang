/// <reference types="@volar/typescript" />

import {
  type CodeMapping,
  type LanguagePlugin,
  type VirtualCode,
  forEachEmbeddedCode,
} from "@volar/language-core";
import * as ts from "typescript";
import { TsCompiler, TypedSnapshot } from "@typed-lang/compiler";

const typedLanguageId = "typed";
const extension = "." + typedLanguageId;

export function getLanguagePlugin(): LanguagePlugin<string, TypedVirtualCode> {
  const compiler = new TsCompiler({ outputMode: "single" });

  return {
    getLanguageId(fileName) {
      if (fileName.endsWith(extension)) {
        return typedLanguageId;
      }
    },
    createVirtualCode(fileName, languageId, snapshot) {
      if (languageId === typedLanguageId) {
        return new TypedVirtualCode(fileName, snapshot, compiler);
      }
    },
    typescript: {
      extraFileExtensions: [
        {
          extension: typedLanguageId,
          isMixedContent: true,
          scriptKind: ts.ScriptKind.Deferred,
        },
      ],
      getServiceScript(astroCode) {
        for (const code of forEachEmbeddedCode(astroCode)) {
          if (code.id === "ts") {
            return {
              code,
              extension: ".ts",
              scriptKind: ts.ScriptKind.TS,
            };
          }
        }
      },
    },
  };
}

export class TypedVirtualCode implements VirtualCode {
  id: string;
  languageId = typedLanguageId;
  mappings!: CodeMapping[];
  embeddedCodes!: VirtualCode[];
  codegenStacks = [];
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
    this.id = fileName;
    this.embeddedCodes = [typedSnapshotToVirtualCode(this.typed)];

    this.mappings = [
      {
        sourceOffsets: [0],
        generatedOffsets: [0],
        lengths: [this.snapshot.getLength()],
        generatedLengths: [this.typed.getText().length],
        data: {
          verification: true,
          completion: true,
          semantic: true,
          navigation: true,
          structure: true,
          format: false,
        },
      },
    ];
  }
}

function typedSnapshotToVirtualCode(snapshot: TypedSnapshot): VirtualCode {
  return {
    id: snapshot.fileName,
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
