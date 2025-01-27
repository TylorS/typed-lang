/// <reference types="@volar/typescript" />

import {
  type CodeMapping,
  type LanguagePlugin,
  type VirtualCode,
  forEachEmbeddedCode,
} from "@volar/language-core";
import * as ts from "typescript";
import { TsCompiler, TypedSnapshot } from "@typed-lang/compiler";
import { URI } from "vscode-uri";

const typedLanguageId = "typed";
const extension = "." + typedLanguageId;

export function getLanguagePlugin(): LanguagePlugin<URI, TypedVirtualCode> {
  const compiler = new TsCompiler({ outputMode: "single" });

  return {
    getLanguageId(uri) {
      const fileName = uri.toString();
      if (fileName.endsWith(extension)) {
        return typedLanguageId;
      }
    },
    createVirtualCode(uri, languageId, snapshot) {
      const fileName = uri.toString();
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
      getServiceScript(typedCode) {
        for (const code of forEachEmbeddedCode(typedCode)) {
          if (code.id === "typescript") {
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
  id: string = "root";
  languageId = typedLanguageId;
  mappings!: CodeMapping[];
  embeddedCodes!: VirtualCode[];
  typed!: TypedSnapshot;

  constructor(
    public fileName: string,
    public snapshot: ts.IScriptSnapshot,
    compiler: TsCompiler
  ) {
    try {
      this.typed = compiler.compile(
        this.fileName,
        this.snapshot.getText(0, this.snapshot.getLength())
      );

      this.embeddedCodes = [
        typedSnapshotToVirtualCode(this.typed, "typescript"),
      ];

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
            structure: false,
            format: false,
          },
        },
      ];
    } catch (error) {
      this.embeddedCodes = [];
      this.mappings = [];

      console.error(error);
    }
  }
}

function typedSnapshotToVirtualCode(
  snapshot: TypedSnapshot,
  id: string
): VirtualCode {
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
