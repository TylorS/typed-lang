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

        export const isNothing = <const A = never>(maybe: Maybe<A>): maybe is Nothing => maybe._tag === "Nothing"

        export const isJust = <const A = never>(maybe: Maybe<A>): maybe is Just<A> => maybe._tag === "Just"

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
          return (matchers as any)[maybe._tag](maybe)
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

        export const isLeft = <const E = never, const A = never>(either: Either<E, A>): either is Left<E> => either._tag === "Left"

        export const isRight = <const E = never, const A = never>(either: Either<E, A>): either is Right<A> => either._tag === "Right"

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
          return (matchers as any)[either._tag](either)
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
      "function add(a: Int, b: Int): Int {
        return a + b
      }
      //# sourceMappingURL=function.typed.ts.map"
    `);
  });

  it(`compiles function declarations with type parameters`, () => {
    const code = `export function add<A extends Int, B extends Int>(a: A, b: B): Int {
      return a + b
    }`;
    const result = compiler.compile(`function.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "function add<const A, const B>(a: A, b: B): Int {
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
      "export const add = (a: Int, b: Int): Int  => a + b
      //# sourceMappingURL=functionExpression.typed.ts.map"
    `);
  });

  it("compiles parenthesized expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => (a + b) * 2`;
    const result = compiler.compile(`parenthesizedExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => (a + b) * 2
      //# sourceMappingURL=parenthesizedExpression.typed.ts.map"
    `);
  });

  it("compiles ternary expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a > b ? a : b`;
    const result = compiler.compile(`ternaryExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a > b ? a : b
      //# sourceMappingURL=ternaryExpression.typed.ts.map"
    `);
  });

  it("compiles logical or expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a || b`;
    const result = compiler.compile(`logicalOrExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a || b
      //# sourceMappingURL=logicalOrExpression.typed.ts.map"
    `);
  });

  it("compiles logical and expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a && b`;
    const result = compiler.compile(`logicalAndExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a && b
      //# sourceMappingURL=logicalAndExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise and expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a & b`;
    const result = compiler.compile(`bitwiseAndExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a & b
      //# sourceMappingURL=bitwiseAndExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise or expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a | b`;
    const result = compiler.compile(`bitwiseOrExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a | b
      //# sourceMappingURL=bitwiseOrExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise xor expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a ^ b`;
    const result = compiler.compile(`bitwiseXorExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a ^ b
      //# sourceMappingURL=bitwiseXorExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise not expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => ~a`;
    const result = compiler.compile(`bitwiseNotExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => ~a
      //# sourceMappingURL=bitwiseNotExpression.typed.ts.map"
    `);
  });

  it("compiles unary expressions", () => {
    const code = `export const add = (a: Int, b: Int): boolean => !a`;
    const result = compiler.compile(`unaryExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): boolean  => !a
      //# sourceMappingURL=unaryExpression.typed.ts.map"
    `);
  });

  it("compiles binary expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a + b`;
    const result = compiler.compile(`binaryExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a + b
      //# sourceMappingURL=binaryExpression.typed.ts.map"
    `);
  });

  it("compiles assignment expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a = b`;
    const result = compiler.compile(`assignmentExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a = b
      //# sourceMappingURL=assignmentExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise shift left expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a << b`;
    const result = compiler.compile(`bitwiseShiftLeftExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a << b
      //# sourceMappingURL=bitwiseShiftLeftExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise shift right expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a >> b`;
    const result = compiler.compile(`bitwiseShiftRightExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a >> b
      //# sourceMappingURL=bitwiseShiftRightExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise unsigned shift right expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a >>> b`;
    const result = compiler.compile(
      `bitwiseUnsignedShiftRightExpression.typed`,
      code
    );
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a >>> b
      //# sourceMappingURL=bitwiseUnsignedShiftRightExpression.typed.ts.map"
    `);
  });

  it("compiles nullish coalescing expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a ?? b`;
    const result = compiler.compile(`nullishCoalescingExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a ?? b
      //# sourceMappingURL=nullishCoalescingExpression.typed.ts.map"
    `);
  });

  it("compiles optional chaining expressions", () => {
    const code = `export const add = (a: Int, b: Int): Int => a?.b`;
    const result = compiler.compile(`optionalChainingExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: Int, b: Int): Int  => a?.b
      //# sourceMappingURL=optionalChainingExpression.typed.ts.map"
    `);
  });

  it("compiles member expressions", () => {
    const code = `export const add = (a: { b: Int }): Int => a.b`;
    const result = compiler.compile(`memberExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const add = (a: ): Int  => a.b
      //# sourceMappingURL=memberExpression.typed.ts.map"
    `);
  });

  it("compiles logical AND expressions", () => {
    const code = `export const and = (a: boolean, b: boolean): boolean => a && b`;
    const result = compiler.compile(`logicalAndExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const and = (a: boolean, b: boolean): boolean  => a && b
      //# sourceMappingURL=logicalAndExpression.typed.ts.map"
    `);
  });

  it("compiles logical OR expressions", () => {
    const code = `export const or = (a: boolean, b: boolean): boolean => a || b`;
    const result = compiler.compile(`logicalOrExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const or = (a: boolean, b: boolean): boolean  => a || b
      //# sourceMappingURL=logicalOrExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise AND expressions", () => {
    const code = `export const bitwiseAnd = (a: Int, b: Int): Int => a & b`;
    const result = compiler.compile(`bitwiseAndExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const bitwiseAnd = (a: Int, b: Int): Int  => a & b
      //# sourceMappingURL=bitwiseAndExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise OR expressions", () => {
    const code = `export const bitwiseOr = (a: Int, b: Int): Int => a | b`;
    const result = compiler.compile(`bitwiseOrExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const bitwiseOr = (a: Int, b: Int): Int  => a | b
      //# sourceMappingURL=bitwiseOrExpression.typed.ts.map"
    `);
  });

  it("compiles bitwise XOR expressions", () => {
    const code = `export const bitwiseXor = (a: Int, b: Int): Int => a ^ b`;
    const result = compiler.compile(`bitwiseXorExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const bitwiseXor = (a: Int, b: Int): Int  => a ^ b
      //# sourceMappingURL=bitwiseXorExpression.typed.ts.map"
    `);
  });

  it("compiles ternary expressions", () => {
    const code = `export const ternary = (condition: boolean, a: Int, b: Int): Int => condition ? a : b`;
    const result = compiler.compile(`ternaryExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const ternary = (condition: boolean, a: Int, b: Int): Int  => condition ? a : b
      //# sourceMappingURL=ternaryExpression.typed.ts.map"
    `);
  });

  it("compiles instanceof expressions", () => {
    const code = `export const i = (a: Object, b: Object): boolean => a instanceof b`;
    const result = compiler.compile(`instanceofExpression.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const i = (a: object, b: object): boolean  => a instanceof b
      //# sourceMappingURL=instanceofExpression.typed.ts.map"
    `);
  });

  it(`compiles for in statements`, () => {
    const code = `for (const a of b) { return a }`;
    const result = compiler.compile(`forInStatement.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "for (const a of b) {
        return a
      }
      //# sourceMappingURL=forInStatement.typed.ts.map"
    `);
  });

  it(`compiles for of statements`, () => {
    const code = `for (const a of b) { return a }`;
    const result = compiler.compile(`forOfStatement.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "for (const a of b) {
        return a
      }
      //# sourceMappingURL=forOfStatement.typed.ts.map"
    `);
  });

  it(`compiles for in statements with let`, () => {
    const code = `for (let a of b) { return a }`;
    const result = compiler.compile(`forInStatement.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "for (let a of b) {
        return a
      }
      //# sourceMappingURL=forInStatement.typed.ts.map"
    `);
  });

  it(`compiles with comments`, () => {
    const code = `// This is a comment
export const a = 1`;
    const result = compiler.compile(`variableDeclaration.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "// This is a comment
      export const a = 1
      //# sourceMappingURL=variableDeclaration.typed.ts.map"
    `);
  });

  it(`compiles type class declarations`, () => {
    const code = `export typeclass Monoid<A> { 
      empty: A,
      concat: (x: A, y: A) => A
    }`;
    const result = compiler.compile(`typeClassDeclaration.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export interface Monoid<A> {
        empty: A,
        concat: (x: A, y: A) => A
      }
      //# sourceMappingURL=typeClassDeclaration.typed.ts.map"
    `);
  });

  it(`compiles instance declarations`, () => {
    const code = `export instance Monoid<Int> { 
      empty: 0,
      concat: (x: Int, y: Int) => x + y
    }`;
    const result = compiler.compile(`instanceDeclaration.typed`, code);
    expect(result.getText()).toMatchInlineSnapshot(`
      "export const monoid: Monoid<Int> = {
        empty: 0,
        concat: (x: Int, y: Int) => x + y
      }
      //# sourceMappingURL=instanceDeclaration.typed.ts.map"
    `);
  });
});
