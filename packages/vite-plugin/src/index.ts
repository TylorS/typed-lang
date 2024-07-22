import { TsCompiler } from "@typed-lang/compiler";
import { Plugin } from "vite";
import { dirname, resolve } from "path";

const TYPED_EXTENSION = ".typed";

export function makeTypedLangPlugin(): Plugin {
  const service = new TsCompiler("multiple");
  function compileToJs(code: string, id: string) {
    const snapshot = service.compile(id, code);
    return service.transpile(snapshot, id);
  }

  function transform(code: string, id: string) {
    if (id.endsWith(TYPED_EXTENSION)) {
      return compileToJs(code, id);
    }
  }

  function resolveId(id: string, importer: string | undefined) {
    if (id.endsWith(TYPED_EXTENSION)) {
      return resolve(dirname(importer!), id);
    }

    if (importer && importer.endsWith(TYPED_EXTENSION)) {
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
      if (snapshot) return service.transpile(snapshot, id);
    },
  };
}
