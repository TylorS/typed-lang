/// <reference types="@volar/typescript" />

import {
  type LanguagePlugin,
  forEachEmbeddedCode,
} from "@volar/language-core";
import * as ts from "typescript";
import { TsCompiler } from "../TsCompiler";
import { URI } from "vscode-uri";
import { TypedVirtualCode } from "./TypedVirtualCode.js";

const typedLanguageId = "typed";
const extension = "." + typedLanguageId;

export function getLanguagePlugin(compiler: TsCompiler): LanguagePlugin<URI, TypedVirtualCode> {
  return {
    getLanguageId(uri) {
      if (uri.path.endsWith(extension)) {
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
      getServiceScript(astroCode) {
        for (const code of forEachEmbeddedCode(astroCode)) {
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

