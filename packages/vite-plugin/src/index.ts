import { parse, tokenize } from "@typed-lang/parser";
import { compileTs } from "@typed-lang/compiler";
import { Plugin } from "vite";
import * as ts from "typescript";
import { dirname, resolve } from "path";

export function makeTypedLangPlugin(): Plugin {
  const outputs = new Map<string, Map<string, ts.TranspileOutput>>();

  function addModules(id: string, modules: Array<readonly [string, ts.TranspileOutput]>) { 
    const map = outputs.get(id) ?? new Map();
    modules.forEach(([name, output]) => map.set(name, output));
    outputs.set(id, map);
  }

  function compileToJs(code: string, id: string) {
    const tokens = tokenize(code);
    const source = parse(id + ".ts", tokens);
    const output = compileTs(source);

    // Transpile with sourcemaps
    const root = ts.transpileModule(output.root.getFullText(), {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        sourceMap: true,
      },
    });
    const modules = output.modules.map((m) =>
      ts.transpileModule(m.getFullText(), {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
        },
      })
    );

    addModules(id, output.modules.map((m, i) => [m.fileName, modules[i]]));

    return {
      code: root.outputText,
      map: root.sourceMapText,
    };
  }

  function getModuleId(id: string) {
    const parts = id.split(".").filter(Boolean);
    parts.pop()
    parts.pop()
    parts.pop()
    return parts.join(".")
  }

  function transform(code: string, id: string) {
    if (id.endsWith(".typed")) {
      return compileToJs(code, id);
    }
  }

  function resolveId(id: string, importer: string | undefined) {
    if (id.endsWith(".typed") || (importer && importer.endsWith(".typed"))) {
      return resolve(dirname(importer!), id);
    }
  }

  return {
    name: "typed-lang",
    enforce: "pre",
    resolveId,
    transform,
    load(id) { 
      if (/\.typed\.ts\..*\.js$/.test(id)) { 
        const modId = getModuleId(id)
        const map = outputs.get(modId);
        const output = map?.get(id.replace('.js', '.ts'));

        if (output) {
          return {
            code: output.outputText,
            map: output.sourceMapText,
          };
        }
      }
    },
  };
}
