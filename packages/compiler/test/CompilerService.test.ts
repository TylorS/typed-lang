import { describe, expect, it } from "vitest";
import { CompilerService } from "../src/CompilerService";
import { writeFileSync } from "node:fs";
import { SourceMapInput } from "@jridgewell/trace-mapping";
import { fromMap, toEncodedMap } from "@jridgewell/gen-mapping";
import { join } from "node:path";
import { DataDeclarationDTSGenerator } from "../src/generators/dts/DataDeclarationDTSGenerator";
import { DataDeclarationTSGenerator } from "../src/generators/ts/DataDeclarationTSGenerator";
import { ok } from "node:assert";

describe("CompilerService", () => {
  it("compiles data declarations to DTS", () => {
    const service = new CompilerService([DataDeclarationDTSGenerator], ".d.ts");
    const fileName = "test.typed";
    const code = `data Maybe<A> = Nothing | Just(value: A)`;
    const snapshot = service.compile(fileName, code);

    expect(snapshot.fileName).toEqual(fileName);
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

  export declare function isNothing<A>(maybe: Maybe<A>): maybe is Nothing

  export declare function isJust<A>(maybe: Maybe<A>): maybe is Just<A>

  export declare function isMaybe(u: unknown): u is Maybe<unknown>
}
`);

    const tsPath = join(`/Users/tylor/Desktop`, fileName + ".ts");
    const mapPath = tsPath + ".map";

    writeFileSync(tsPath, snapshot.getText());
    writeFileSync(
      mapPath,
      JSON.stringify(toEncodedMap(fromMap(snapshot.map as SourceMapInput)))
    );

    expect(snapshot.getOriginalPosition(1, 25)).toEqual({
      line: 1,
      column: 5,
      source: fileName,
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
        column: 46,
      },
      {
        line: 21,
        column: 43,
      },
      {
        line: 23,
        column: 26,
      },
      {
        line: 23,
        column: 52,
      },
    ]);
  });

  it("compiles data declarations to TS", () => {
    const service = new CompilerService([DataDeclarationTSGenerator], ".ts");
    const fileName = "test.typed";
    const code = `data Maybe<A> = Nothing | Just(value: A)`;
    const snapshot = service.compile(fileName, code);

    expect(snapshot.fileName).toEqual(fileName);
    expect(snapshot.source).toEqual(code);
    expect(snapshot.getText()).toEqual(
      `export * as Maybe from "./test.typed.Maybe.js"`
    );

    const tsPath = join(`/Users/tylor/Desktop`, fileName + ".ts");
    const mapPath = tsPath + ".map";

    writeFileSync(tsPath, snapshot.getText());
    writeFileSync(
      mapPath,
      JSON.stringify(toEncodedMap(fromMap(snapshot.map as SourceMapInput)))
    );

    expect(snapshot.getOriginalPosition(1, 12)).toEqual({
      line: 1,
      column: 5,
      source: fileName,
      name: "Maybe",
    });

    expect(snapshot.getGeneratedPositions(1, 5)).toEqual([
      {
        line: 1,
        column: 0,
      },
    ]);

    const maybeFile = service.getSnapshot("test.typed.Maybe.ts");

    ok(maybeFile);

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
  value,
})

export function isNothing<A>(maybe: Maybe<A>): maybe is Nothing {
  return maybe._tag === "Nothing"
}

export function isJust<A>(maybe: Maybe<A>): maybe is Just<A> {
  return maybe._tag === "Just"
}

export function isMaybe(u: unknown): u is Maybe<unknown> {
  return typeof u === "object" &&
    u !== null &&
    "_tag" in u &&
    (u._tag === "Nothing" || u._tag === "Just")
}
`);

    const maybePath = join(`/Users/tylor/Desktop`, "test.typed.Maybe.ts");
    const maybeMapPath = maybePath + ".map";

    writeFileSync(maybePath, maybeFile.getText());

    writeFileSync(
      maybeMapPath,
      JSON.stringify(toEncodedMap(fromMap(maybeFile.map as SourceMapInput)))
    );
  });
});
