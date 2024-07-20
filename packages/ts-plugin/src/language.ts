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
const compiler = new TsCompiler();

export function getLanguagePlugin(): LanguagePlugin<string, TypedVirtualCode> {
  return {
    getLanguageId(fileName) {
      if (fileName.endsWith(extension)) {
        return typedLanguageId;
      }
    },
    createVirtualCode(fileName, languageId, snapshot) {
      if (languageId === typedLanguageId) {
        return new TypedVirtualCode(fileName, snapshot);
      }
    },
    typescript: {
      extraFileExtensions: [
        { extension: typedLanguageId, isMixedContent: true, scriptKind: ts.ScriptKind.Deferred },
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
  id = "root";
  languageId = typedLanguageId;
  mappings!: CodeMapping[];
  embeddedCodes!: VirtualCode[];
  codegenStacks = [];
  typed: TypedSnapshot;

  constructor(public fileName: string, public snapshot: ts.IScriptSnapshot) {
    this.mappings = [
      {
        sourceOffsets: [0],
        generatedOffsets: [0],
        lengths: [this.snapshot.getLength()],
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

    this.typed = compiler.compile(
      this.fileName,
      this.snapshot.getText(0, this.snapshot.getLength())
    );
    
    this.embeddedCodes = [typedSnapshotToVirtualCode(this.typed)]
  }
}

function typedSnapshotToVirtualCode(snapshot: TypedSnapshot): VirtualCode {
  return {
    id: "ts",
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
