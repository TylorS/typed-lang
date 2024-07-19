import { TsCompiler, TypedSnapshot } from "@typed-lang/compiler";
import { Plugin } from "vite";
import * as ts from "typescript";
import { dirname, resolve } from "path";
import remapping from "@ampproject/remapping";

export function makeTypedLangPlugin(): Plugin {
  const service = new TsCompiler();
  function compileToJs(code: string, id: string) {
    const snapshot = service.compile(id, code);
    return transpile(snapshot, id);
  }

  function transpile(snapshot: TypedSnapshot, id: string) {
    const content = snapshot.getText();
    const root = ts.transpileModule(content, {
      fileName: id + ".ts",
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        sourceMap: true,
      },
    });

    const oldMap = snapshot.map;
    const newMap = JSON.parse(root.sourceMapText!);
    newMap.sourcesContent = [content];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remapped = (remapping as any)([newMap, oldMap], () => null);

    return {
      code: root.outputText,
      map: JSON.stringify(remapped),
    };
  }

  function transform(code: string, id: string) {
    if (id.endsWith(".typed")) {
      return compileToJs(code, id);
    }
  }

  function resolveId(id: string, importer: string | undefined) {
    if (id.endsWith(".typed")) {
      return resolve(dirname(importer!), id);
    }

    if (importer && importer.endsWith(".typed")) {
      return resolve(dirname(importer!), id).replace(".js", ".ts");
    }
  }

  return {
    name: "typed-lang",
    enforce: "pre",
    resolveId,
    transform,
    load(id) {
      const snapshot = service.getSnapshot(id);
      if (snapshot) return transpile(snapshot, id.replace(".ts", ""));
    },
  };
}
