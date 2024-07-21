import { describe, expect, it } from "vitest";
import { CompilerService } from "../src/CompilerService";
import { writeFileSync } from "node:fs";
import { SourceMapInput } from "@jridgewell/trace-mapping";
import { fromMap, toEncodedMap } from "@jridgewell/gen-mapping";
import { dtsSourceFileGenerator } from "../src/generators/dts/index.js";
import { tsSourceFileGenerator } from "../src/generators/ts/index.js";
import { ok } from "node:assert";

describe.skip("CompilerService", () => {
  it("compiles data declarations to DTS", () => {
    const extension = ".d.ts";
    const service = new CompilerService(dtsSourceFileGenerator, extension);
    const fileName = "test.typed";
    const code = `data Maybe<A> = Nothing | Just(value: A)`;
    const snapshot = service.compile(fileName, code);

    expect(snapshot.fileName).toEqual(fileName + extension);
    expect(snapshot.source).toEqual(code);

    expect(snapshot.getText()).toEqual(`export declare namespace Maybe {
  export type Maybe<A> =
    | Nothing
    | Just<A>

  export interface Nothing {
    readonly _tag: "Nothing"
  }

  export interface Just<A> {
    readonly _tag: "Just"
    readonly value: A
  }

  export declare const Nothing: Nothing

  export declare const Just: <A>(value: A) => Just<A>

  export declare const isNothing: <A>(maybe: Maybe<A>) => maybe is Nothing

  export declare const isJust: <A>(maybe: Maybe<A>) => maybe is Just<A>

  export declare const isMaybe: (u: unknown) => u is Maybe<unknown>
}
`);

    expect(snapshot.getOriginalPosition(1, 25)).toEqual({
      line: 1,
      column: 5,
      source: fileName + ".d.ts",
      name: "Maybe",
    });

    expect(snapshot.getGeneratedPositions(1, 5)).toEqual([
      {
        line: 1,
        column: 25,
      },
      {
        line: 2,
        column: 14,
      },
      {
        line: 19,
        column: 45,
      },
      {
        line: 21,
        column: 42,
      },
      {
        line: 23,
        column: 23,
      },
      {
        line: 23,
        column: 53,
      },
    ]);
  });

  it("compiles data declarations to TS", () => {
    const extension = ".ts";
    const service = new CompilerService(tsSourceFileGenerator, extension);
    const fileName = "test.typed";
    const code = `data Maybe<A> = Nothing | Just(value: A)`;
    const snapshot = service.compile(fileName, code);
    const tsPath = fileName + extension;

    expect(snapshot.fileName).toEqual(tsPath);
    expect(snapshot.source).toEqual(code);
    expect(snapshot.getText()).toEqual(
      `export * as Maybe from "./test.typed.Maybe.js"\n`
    );

    const mapPath = tsPath + ".map";

    writeFileSync(tsPath, snapshot.getText());
    writeFileSync(
      mapPath,
      JSON.stringify(toEncodedMap(fromMap(snapshot.map as SourceMapInput)))
    );

    expect(snapshot.getOriginalPosition(1, 12)).toEqual({
      line: 1,
      column: 0,
      source: tsPath,
      name: "Maybe",
    });

    expect(snapshot.getGeneratedPositions(1, 5)).toEqual([
      {
        line: 2,
        column: 0,
      },
    ]);

    const maybeFile = service.getSnapshot("test.typed.Maybe.ts");

    ok(maybeFile);

    const maybePath = "test.typed.Maybe.ts";
    const maybeMapPath = maybePath + ".map";

    writeFileSync(maybePath, maybeFile.getText());

    writeFileSync(
      maybeMapPath,
      JSON.stringify(toEncodedMap(fromMap(maybeFile.map as SourceMapInput)))
    );

    expect(maybeFile.getText()).toEqual(`export type Maybe<A> =
  | Nothing
  | Just<A>

export interface Nothing {
  readonly _tag: "Nothing"
}

export interface Just<A> {
  readonly _tag: "Just"
  readonly value: A
}

export const Nothing: Nothing = { _tag: "Nothing" }

export const Just = <A>(value: A): Just<A> => ({
  _tag: "Just",
  value
})

export const isNothing = <A>(maybe: Maybe<A>): maybe is Nothing => maybe._tag === "Nothing"

export const isJust = <A>(maybe: Maybe<A>): maybe is Just<A> => maybe._tag === "Just"

export const isMaybe = (u: unknown): u is Maybe<unknown> =>
  typeof u === "object" &&
    u !== null &&
    "_tag" in u &&
    (u._tag === "Nothing" || u._tag === "Just")
`);
  });
});
