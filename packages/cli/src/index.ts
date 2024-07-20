import { Options, Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { Effect } from "effect";
import { version } from "../package.json";
import { DtsCompiler, TsCompiler, TypedSnapshot } from "@typed-lang/compiler";
import { FileSystem } from "@effect/platform";
import { resolve, dirname } from "node:path";

// Define the top-level command
const command = Command.make(
  "compile",
  {
    dir: Options.directory("dir").pipe(Options.withDefault(process.cwd())),
    mode: Options.choice("mode", ["root", "sub"]).pipe(
      Options.withDefault("sub")
    ),
    output: Options.choice("output", ["js", "ts", "dts"]).pipe(
      Options.withDefault("js")
    ),
    outDir: Options.text("outDir").pipe(Options.withDefault("dist")),
  },
  (args) =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const files = yield* findAllTypedFilesInDirectory(args.dir);

      if (files.length === 0) return;

      yield* fs.makeDirectory(args.outDir, { recursive: true });

      if (args.output === "dts") {
        const dtsCompiler = new DtsCompiler();

        for (const file of files) {
          const contents = yield* fs.readFileString(file);
          dtsCompiler.compile(file, contents);
        }

        for (const fileName of dtsCompiler.getScriptFileNames()) {
          const snapshot = dtsCompiler.getSnapshot(fileName)!;
          yield* writeSnapshot(snapshot, args);
        }
      } else {
        const compiler = new TsCompiler({
          dataDeclarationOutputMode: args.mode,
        });

        for (const file of files) {
          const contents = yield* fs.readFileString(file);
          compiler.compile(file, contents);
        }

        for (const fileName of compiler.getScriptFileNames()) {
          const snapshot = compiler.getSnapshot(fileName)!;

          if (args.output === "js") {
            if (fileName.endsWith(".d.ts")) {
              const outFileName = getOutFileName(
                resolve(process.cwd(), args.dir),
                resolve(process.cwd(), args.outDir),
                fileName
              );

              yield* fs.writeFileString(outFileName, snapshot.getText());
              yield* fs.writeFileString(
                outFileName + ".map",
                JSON.stringify(snapshot.map)
              );
            } else {
              const outFileName = getOutFileName(
                resolve(process.cwd(), args.dir),
                resolve(process.cwd(), args.outDir),
                fileName
              ).replace(".ts", ".js");

              const { code, map } = compiler.transpile(snapshot, fileName);
              yield* fs.writeFileString(outFileName, code);
              yield* fs.writeFileString(outFileName + ".map", map);
            }
          } else {
            yield* writeSnapshot(snapshot, args);
          }
        }
      }
    })
);

// Set up the CLI application
const cli = Command.run(command, {
  name: "Typed Language CLI",
  version,
});

// Prepare and run the CLI application
cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);

function findAllTypedFilesInDirectory(dir: string) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const files = yield* fs.readDirectory(dir, { recursive: true });
    return files
      .filter((f) => f.endsWith(".typed"))
      .map((p) => resolve(dir, p));
  });
}

function getOutFileName(dir: string, outDir: string, fileName: string) {
  return fileName.replace(dir, outDir);
}

function writeSnapshot(
  snapshot: TypedSnapshot,
  args: { dir: string; outDir: string }
) {
  return Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const outFileName = getOutFileName(
      resolve(process.cwd(), args.dir),
      resolve(process.cwd(), args.outDir),
      snapshot.fileName
    );

    yield* fs.makeDirectory(dirname(outFileName), { recursive: true });

    yield* fs.writeFileString(outFileName, snapshot.getText(), {});
    yield* fs.writeFileString(
      outFileName + ".map",
      JSON.stringify(snapshot.map)
    );
  });
}
