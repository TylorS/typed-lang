import { describe, it, expect } from "vitest";
import { TsCompiler } from "../src/TsCompiler";

describe("TsCompiler", () => {
  const compiler = new TsCompiler({ outputMode: "single" });

  it("compiles data declarations", () => {
    const code = `export data Maybe<out A> = Nothing | Just(value: A)`;
    const result = compiler.compile(`data.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "import { hasProperty } from "@typed-lang/typedlib"

      export namespace Maybe {
        export type Maybe<A> =
          | Nothing
          | Just<A>

        export interface Nothing {
          readonly _tag: "Nothing"
        }

        export interface Just<out A> {
          readonly _tag: "Just"
          readonly value: A
        }

        export const Nothing: Nothing = { _tag: "Nothing" }

        export const Just = <const A>(value: A): Just<A> => ({
          _tag: "Just",
          value
        })

        export const isNothing = <A = never>(maybe: Maybe<A>): maybe is Nothing => maybe._tag === "Nothing"

        export const isJust = <A = never>(maybe: Maybe<A>): maybe is Just<A> => maybe._tag === "Just"

        export const isMaybe = (value: unknown): value is Maybe<unknown> => {
          if (!hasProperty(value, "_tag")) return false;
          switch (value._tag) {
            case "Nothing":
            case "Just":
              return true
            default: return false;
          }
        }

        export function match<A, const Return1, const Return2>(maybe: Maybe<A>, matchers: {
          Nothing: (nothing: Nothing) => Return1,
          Just: (just: Just<A>) => Return2
        }): Return1 | Return2 {
          return ;(matchers as any)[maybe._tag](maybe)
        }
      }
      //# sourceMappingURL=data.typed.ts.map"
    `);
  });

  it("compiles data declarations with two type parameters", () => {
    const code = `export data Either<out E, out A> = Left(value: E) | Right(value: A)`;
    const result = compiler.compile(`data.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "import { hasProperty } from "@typed-lang/typedlib"

      export namespace Either {
        export type Either<E, A> =
          | Left<E>
          | Right<A>

        export interface Left<out E> {
          readonly _tag: "Left"
          readonly value: E
        }

        export interface Right<out A> {
          readonly _tag: "Right"
          readonly value: A
        }

        export const Left = <const E>(value: E): Left<E> => ({
          _tag: "Left",
          value
        })

        export const Right = <const A>(value: A): Right<A> => ({
          _tag: "Right",
          value
        })

        export const isLeft = <E = never, A = never>(either: Either<E, A>): either is Left<E> => either._tag === "Left"

        export const isRight = <E = never, A = never>(either: Either<E, A>): either is Right<A> => either._tag === "Right"

        export const isEither = (value: unknown): value is Either<unknown, unknown> => {
          if (!hasProperty(value, "_tag")) return false;
          switch (value._tag) {
            case "Left":
            case "Right":
              return true
            default: return false;
          }
        }

        export function match<E, A, const Return1, const Return2>(either: Either<E, A>, matchers: {
          Left: (left: Left<E>) => Return1,
          Right: (right: Right<A>) => Return2
        }): Return1 | Return2 {
          return ;(matchers as any)[either._tag](either)
        }
      }
      //# sourceMappingURL=data.typed.ts.map"
    `);
  });

  it(`compiles function declarations`, () => {
    const code = `export function add(a: Int, b: Int): Int {
      return a + b
    }`;
    const result = compiler.compile(`function.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export function add(a: Int, b: Int): Int {
        return a + b
      }
      //# sourceMappingURL=function.typed.ts.map"
    `);
  });

  it(`compiles type alias declarations`, () => {
    const code = `export type Int = number`;
    const result = compiler.compile(`typeAlias.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export type Int = number
      //# sourceMappingURL=typeAlias.typed.ts.map"
    `);
  });

  it(`compiles brand declarations`, () => {
    const code = `export brand Int = number`;
    const result = compiler.compile(`brand.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "import { Branded } from "@typed-lang/typedlib"

      export type Int = Branded<number, "Int">
      export const Int = Branded<Int>()
      //# sourceMappingURL=brand.typed.ts.map"
    `);
  });

  it("compiles variable declarations", () => {
    const code = `export const a = 1`;
    const result = compiler.compile(`variable.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const a = 1
      //# sourceMappingURL=variable.typed.ts.map"
    `);
  });

  it("compiles function expresions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a + b`;
    const result = compiler.compile(`functionExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int => a + b
      //# sourceMappingURL=functionExpression.typed.ts.map"
    `);
  });

  it("compiles parenthesized expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => (a + b) * 2`;
    const result = compiler.compile(`parenthesizedExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int => (a + b) * 2
      //# sourceMappingURL=parenthesizedExpression.typed.ts.map"
    `);
  });
});
