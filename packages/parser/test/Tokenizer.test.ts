import { Token, TokenKind } from "../src/Token";
import { Span, SpanLocation } from "../src/Span";
import { tokenize } from "../src/Tokenizer";
import { describe, expect, it } from "vitest";

const singleLineLocation = (pos: number) => new SpanLocation(pos, 1, pos);

describe("Tokenizer", () => {
  it("tokenizes data types", () => {
    const tokens = tokenize(
      `data Maybe<A> = Nothing | Just(A) | Some { value: A }`
    );

    expect(tokens).toEqual([
      new Token(
        TokenKind.DataKeyword,
        "data",
        new Span(singleLineLocation(0), singleLineLocation(4))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(4), singleLineLocation(5))
      ),
      new Token(
        TokenKind.Identifier,
        "Maybe",
        new Span(singleLineLocation(5), singleLineLocation(10))
      ),
      new Token(
        TokenKind.LessThan,
        "<",
        new Span(singleLineLocation(10), singleLineLocation(11))
      ),
      new Token(
        TokenKind.Identifier,
        "A",
        new Span(singleLineLocation(11), singleLineLocation(12))
      ),
      new Token(
        TokenKind.GreaterThan,
        ">",
        new Span(singleLineLocation(12), singleLineLocation(13))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(13), singleLineLocation(14))
      ),
      new Token(
        TokenKind.EqualSign,
        "=",
        new Span(singleLineLocation(14), singleLineLocation(15))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(15), singleLineLocation(16))
      ),
      new Token(
        TokenKind.Identifier,
        "Nothing",
        new Span(singleLineLocation(16), singleLineLocation(23))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(23), singleLineLocation(24))
      ),
      new Token(
        TokenKind.Pipe,
        "|",
        new Span(singleLineLocation(24), singleLineLocation(25))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(25), singleLineLocation(26))
      ),
      new Token(
        TokenKind.Identifier,
        "Just",
        new Span(singleLineLocation(26), singleLineLocation(30))
      ),
      new Token(
        TokenKind.OpenParen,
        "(",
        new Span(singleLineLocation(30), singleLineLocation(31))
      ),
      new Token(
        TokenKind.Identifier,
        "A",
        new Span(singleLineLocation(31), singleLineLocation(32))
      ),
      new Token(
        TokenKind.CloseParen,
        ")",
        new Span(singleLineLocation(32), singleLineLocation(33))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(33), singleLineLocation(34))
      ),
      new Token(
        TokenKind.Pipe,
        "|",
        new Span(singleLineLocation(34), singleLineLocation(35))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(35), singleLineLocation(36))
      ),
      new Token(
        TokenKind.Identifier,
        "Some",
        new Span(singleLineLocation(36), singleLineLocation(40))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(40), singleLineLocation(41))
      ),
      new Token(
        TokenKind.OpenBrace,
        "{",
        new Span(singleLineLocation(41), singleLineLocation(42))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(42), singleLineLocation(43))
      ),
      new Token(
        TokenKind.Identifier,
        "value",
        new Span(singleLineLocation(43), singleLineLocation(48))
      ),
      new Token(
        TokenKind.Colon,
        ":",
        new Span(singleLineLocation(48), singleLineLocation(49))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(49), singleLineLocation(50))
      ),
      new Token(
        TokenKind.Identifier,
        "A",
        new Span(singleLineLocation(50), singleLineLocation(51))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(51), singleLineLocation(52))
      ),
      new Token(
        TokenKind.CloseBrace,
        "}",
        new Span(singleLineLocation(52), singleLineLocation(53))
      ),
    ]);
  });

  it("tokenizes type aliases for records", () => {
    const tokens = tokenize(`type Todo = {
  id: number
  text: string
  completed: boolean
}`);

    expect(tokens).toEqual([
      // 1st line
      new Token(
        TokenKind.TypeKeyword,
        "type",
        new Span(singleLineLocation(0), singleLineLocation(4))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(4), singleLineLocation(5))
      ),
      new Token(
        TokenKind.Identifier,
        "Todo",
        new Span(singleLineLocation(5), singleLineLocation(9))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(9), singleLineLocation(10))
      ),
      new Token(
        TokenKind.EqualSign,
        "=",
        new Span(singleLineLocation(10), singleLineLocation(11))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(11), singleLineLocation(12))
      ),
      new Token(
        TokenKind.OpenBrace,
        "{",
        new Span(singleLineLocation(12), singleLineLocation(13))
      ),
      // 2nd line
      new Token(
        TokenKind.Whitespace,
        "\n  ",
        new Span(singleLineLocation(13), new SpanLocation(16, 2, 2))
      ),
      new Token(
        TokenKind.Identifier,
        "id",
        new Span(new SpanLocation(16, 2, 2), new SpanLocation(18, 2, 4))
      ),
      new Token(
        TokenKind.Colon,
        ":",
        new Span(new SpanLocation(18, 2, 4), new SpanLocation(19, 2, 5))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(new SpanLocation(19, 2, 5), new SpanLocation(20, 2, 6))
      ),
      new Token(
        TokenKind.Identifier,
        "number",
        new Span(new SpanLocation(20, 2, 6), new SpanLocation(26, 2, 12))
      ),
      new Token(
        TokenKind.Whitespace,
        "\n  ",
        new Span(new SpanLocation(26, 2, 12), new SpanLocation(29, 3, 2))
      ),
      // 3rd line
      new Token(
        TokenKind.Identifier,
        "text",
        new Span(new SpanLocation(29, 3, 2), new SpanLocation(33, 3, 6))
      ),
      new Token(
        TokenKind.Colon,
        ":",
        new Span(new SpanLocation(33, 3, 6), new SpanLocation(34, 3, 7))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(new SpanLocation(34, 3, 7), new SpanLocation(35, 3, 8))
      ),
      new Token(
        TokenKind.Identifier,
        "string",
        new Span(new SpanLocation(35, 3, 8), new SpanLocation(41, 3, 14))
      ),
      new Token(
        TokenKind.Whitespace,
        "\n  ",
        new Span(new SpanLocation(41, 3, 14), new SpanLocation(44, 4, 2))
      ),
      // 4th line
      new Token(
        TokenKind.Identifier,
        "completed",
        new Span(new SpanLocation(44, 4, 2), new SpanLocation(53, 4, 11))
      ),
      new Token(
        TokenKind.Colon,
        ":",
        new Span(new SpanLocation(53, 4, 11), new SpanLocation(54, 4, 12))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(new SpanLocation(54, 4, 12), new SpanLocation(55, 4, 13))
      ),
      new Token(
        TokenKind.Identifier,
        "boolean",
        new Span(new SpanLocation(55, 4, 13), new SpanLocation(62, 4, 20))
      ),
      new Token(
        TokenKind.Whitespace,
        "\n",
        new Span(new SpanLocation(62, 4, 20), new SpanLocation(63, 5, 0))
      ),
      // 5th line
      new Token(
        TokenKind.CloseBrace,
        "}",
        new Span(new SpanLocation(63, 5, 0), new SpanLocation(64, 5, 1))
      ),
    ]);
  });

  it("tokenizes comments", () => {
    const tokens = tokenize(`// This is a comment`);

    expect(tokens).toEqual([
      new Token(
        TokenKind.Comment,
        "// This is a comment",
        new Span(singleLineLocation(0), singleLineLocation(20))
      ),
    ]);
  });

  it("tokenizes string literals", () => {
    const tokens = tokenize(`"Hello, World!"`);

    expect(tokens).toEqual([
      new Token(
        TokenKind.StringLiteral,
        '"Hello, World!"',
        new Span(singleLineLocation(0), singleLineLocation(15))
      ),
    ]);
  });

  it("tokenizes number literals", () => {
    const tokens = tokenize(`123`);

    expect(tokens).toEqual([
      new Token(
        TokenKind.NumberLiteral,
        "123",
        new Span(singleLineLocation(0), singleLineLocation(3))
      ),
    ]);
  });

  it("tokenizes boolean literals", () => {
    expect(tokenize(`true`)).toEqual([
      new Token(
        TokenKind.BooleanLiteral,
        "true",
        new Span(singleLineLocation(0), singleLineLocation(4))
      ),
    ]);

    expect(tokenize(`false`)).toEqual([
      new Token(
        TokenKind.BooleanLiteral,
        "false",
        new Span(singleLineLocation(0), singleLineLocation(5))
      ),
    ]);
  });

  it("tokenizes identifiers", () => {
    const tokens = tokenize(`foo bar baz`);

    expect(tokens).toEqual([
      new Token(
        TokenKind.Identifier,
        "foo",
        new Span(singleLineLocation(0), singleLineLocation(3))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(3), singleLineLocation(4))
      ),
      new Token(
        TokenKind.Identifier,
        "bar",
        new Span(singleLineLocation(4), singleLineLocation(7))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(7), singleLineLocation(8))
      ),
      new Token(
        TokenKind.Identifier,
        "baz",
        new Span(singleLineLocation(8), singleLineLocation(11))
      ),
    ]);
  });

  it("tokenizes punctuation", () => {
    const tokens = tokenize(`{ } [ ] ( ) , : | .`);

    expect(tokens).toEqual([
      new Token(
        TokenKind.OpenBrace,
        "{",
        new Span(singleLineLocation(0), singleLineLocation(1))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(1), singleLineLocation(2))
      ),
      new Token(
        TokenKind.CloseBrace,
        "}",
        new Span(singleLineLocation(2), singleLineLocation(3))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(3), singleLineLocation(4))
      ),
      new Token(
        TokenKind.OpenBracket,
        "[",
        new Span(singleLineLocation(4), singleLineLocation(5))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(5), singleLineLocation(6))
      ),
      new Token(
        TokenKind.CloseBracket,
        "]",
        new Span(singleLineLocation(6), singleLineLocation(7))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(7), singleLineLocation(8))
      ),
      new Token(
        TokenKind.OpenParen,
        "(",
        new Span(singleLineLocation(8), singleLineLocation(9))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(9), singleLineLocation(10))
      ),
      new Token(
        TokenKind.CloseParen,
        ")",
        new Span(singleLineLocation(10), singleLineLocation(11))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(11), singleLineLocation(12))
      ),
      new Token(
        TokenKind.Comma,
        ",",
        new Span(singleLineLocation(12), singleLineLocation(13))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(13), singleLineLocation(14))
      ),
      new Token(
        TokenKind.Colon,
        ":",
        new Span(singleLineLocation(14), singleLineLocation(15))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(15), singleLineLocation(16))
      ),
      new Token(
        TokenKind.Pipe,
        "|",
        new Span(singleLineLocation(16), singleLineLocation(17))
      ),
      new Token(
        TokenKind.Whitespace,
        " ",
        new Span(singleLineLocation(17), singleLineLocation(18))
      ),
      new Token(
        TokenKind.Period,
        ".",
        new Span(singleLineLocation(18), singleLineLocation(19))
      ),
    ]);
  });

  it("tokenizes whitespace", () => {
    const tokens = tokenize(` \n  `);

    expect(tokens).toEqual([
      new Token(
        TokenKind.Whitespace,
        ` \n  `,
        new Span(singleLineLocation(0), new SpanLocation(4, 2, 2))
      ),
    ]);
  });

  it("tokenizes typeclasses", () => {
    const tokens = tokenize(`typeclass Covariant<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}`);
    
    expect(tokens).toEqual([
      new Token(TokenKind.TypeClassKeyword, "typeclass", new Span(singleLineLocation(0), singleLineLocation(9))),
      new Token(TokenKind.Whitespace, " ", new Span(singleLineLocation(9), singleLineLocation(10))),
      new Token(TokenKind.Identifier, "Covariant", new Span(singleLineLocation(10), singleLineLocation(19))),
      new Token(TokenKind.LessThan, "<", new Span(singleLineLocation(19), singleLineLocation(20))),
      new Token(TokenKind.Identifier, "F", new Span(singleLineLocation(20), singleLineLocation(21))),
      new Token(TokenKind.LessThan, "<", new Span(singleLineLocation(21), singleLineLocation(22))),
      new Token(TokenKind.Underscore, "_", new Span(singleLineLocation(22), singleLineLocation(23))),
      new Token(TokenKind.GreaterThan, ">", new Span(singleLineLocation(23), singleLineLocation(24))),
      new Token(TokenKind.GreaterThan, ">", new Span(singleLineLocation(24), singleLineLocation(25))),
      new Token(TokenKind.Whitespace, " ", new Span(singleLineLocation(25), singleLineLocation(26))),
      new Token(TokenKind.OpenBrace, "{", new Span(singleLineLocation(26), singleLineLocation(27))),
      new Token(TokenKind.Whitespace, "\n  ", new Span(singleLineLocation(27), new SpanLocation(30, 2, 2))),
      new Token(TokenKind.Identifier, "map", new Span(new SpanLocation(30, 2, 2), new SpanLocation(33, 2, 5))),
      new Token(TokenKind.Colon, ":", new Span(new SpanLocation(33, 2, 5), new SpanLocation(34, 2, 6))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(34, 2, 6), new SpanLocation(35, 2, 7))),
      new Token(TokenKind.LessThan, "<", new Span(new SpanLocation(35, 2, 7), new SpanLocation(36, 2, 8))),
      new Token(TokenKind.Identifier, "A", new Span(new SpanLocation(36, 2, 8), new SpanLocation(37, 2, 9))),
      new Token(TokenKind.Comma, ",", new Span(new SpanLocation(37, 2, 9), new SpanLocation(38, 2, 10))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(38, 2, 10), new SpanLocation(39, 2, 11))),
      new Token(TokenKind.Identifier, "B", new Span(new SpanLocation(39, 2, 11), new SpanLocation(40, 2, 12))),
      new Token(TokenKind.GreaterThan, ">", new Span(new SpanLocation(40, 2, 12), new SpanLocation(41, 2, 13))),
      new Token(TokenKind.OpenParen, "(", new Span(new SpanLocation(41, 2, 13), new SpanLocation(42, 2, 14))),
      new Token(TokenKind.Identifier, "fa", new Span(new SpanLocation(42, 2, 14), new SpanLocation(44, 2, 16))),
      new Token(TokenKind.Colon, ":", new Span(new SpanLocation(44, 2, 16), new SpanLocation(45, 2, 17))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(45, 2, 17), new SpanLocation(46, 2, 18))),
      new Token(TokenKind.Identifier, "F", new Span(new SpanLocation(46, 2, 18), new SpanLocation(47, 2, 19))),
      new Token(TokenKind.LessThan, "<", new Span(new SpanLocation(47, 2, 19), new SpanLocation(48, 2, 20))),
      new Token(TokenKind.Identifier, "A", new Span(new SpanLocation(48, 2, 20), new SpanLocation(49, 2, 21))),
      new Token(TokenKind.GreaterThan, ">", new Span(new SpanLocation(49, 2, 21), new SpanLocation(50, 2, 22))),
      new Token(TokenKind.Comma, ",", new Span(new SpanLocation(50, 2, 22), new SpanLocation(51, 2, 23))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(51, 2, 23), new SpanLocation(52, 2, 24))),
      new Token(TokenKind.Identifier, "f", new Span(new SpanLocation(52, 2, 24), new SpanLocation(53, 2, 25))),
      new Token(TokenKind.Colon, ":", new Span(new SpanLocation(53, 2, 25), new SpanLocation(54, 2, 26))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(54, 2, 26), new SpanLocation(55, 2, 27))),
      new Token(TokenKind.OpenParen, "(", new Span(new SpanLocation(55, 2, 27), new SpanLocation(56, 2, 28))),
      new Token(TokenKind.Identifier, "a", new Span(new SpanLocation(56, 2, 28), new SpanLocation(57, 2, 29))),
      new Token(TokenKind.Colon, ":", new Span(new SpanLocation(57, 2, 29), new SpanLocation(58, 2, 30))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(58, 2, 30), new SpanLocation(59, 2, 31))),
      new Token(TokenKind.Identifier, "A", new Span(new SpanLocation(59, 2, 31), new SpanLocation(60, 2, 32))),
      new Token(TokenKind.CloseParen, ")", new Span(new SpanLocation(60, 2, 32), new SpanLocation(61, 2, 33))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(61, 2, 33), new SpanLocation(62, 2, 34))),
      new Token(TokenKind.EqualSign, "=", new Span(new SpanLocation(62, 2, 34), new SpanLocation(63, 2, 35))),
      new Token(TokenKind.GreaterThan, ">", new Span(new SpanLocation(63, 2, 35), new SpanLocation(64, 2, 36))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(64, 2, 36), new SpanLocation(65, 2, 37))),
      new Token(TokenKind.Identifier, "B", new Span(new SpanLocation(65, 2, 37), new SpanLocation(66, 2, 38))),
      new Token(TokenKind.CloseParen, ")", new Span(new SpanLocation(66, 2, 38), new SpanLocation(67, 2, 39))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(67, 2, 39), new SpanLocation(68, 2, 40))),
      new Token(TokenKind.EqualSign, "=", new Span(new SpanLocation(68, 2, 40), new SpanLocation(69, 2, 41))),
      new Token(TokenKind.GreaterThan, ">", new Span(new SpanLocation(69, 2, 41), new SpanLocation(70, 2, 42))),
      new Token(TokenKind.Whitespace, " ", new Span(new SpanLocation(70, 2, 42), new SpanLocation(71, 2, 43))),
      new Token(TokenKind.Identifier, "F", new Span(new SpanLocation(71, 2, 43), new SpanLocation(72, 2, 44))),
      new Token(TokenKind.LessThan, "<", new Span(new SpanLocation(72, 2, 44), new SpanLocation(73, 2, 45))),
      new Token(TokenKind.Identifier, "B", new Span(new SpanLocation(73, 2, 45), new SpanLocation(74, 2, 46))),
      new Token(TokenKind.GreaterThan, ">", new Span(new SpanLocation(74, 2, 46), new SpanLocation(75, 2, 47))),
      new Token(TokenKind.Whitespace, "\n", new Span(new SpanLocation(75, 2, 47), new SpanLocation(76, 3, 0))),
      new Token(TokenKind.CloseBrace, "}", new Span(new SpanLocation(76, 3, 0), new SpanLocation(77, 3, 1))),
    ])
  });

  it('tokenizes bitshift', () => {
    const source = `export const add = (a: Int, b: Int): Int => a << b`

    expect(tokenize(source)).toMatchInlineSnapshot(`
      [
        Token {
          "kind": "ExportKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 1,
              "position": 6,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 1,
              "position": 0,
            },
          },
          "text": "export",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 1,
              "position": 7,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 1,
              "position": 6,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "ConstKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 1,
              "position": 13,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 1,
              "position": 7,
            },
          },
          "text": "const",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 1,
              "position": 16,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 1,
              "position": 13,
            },
          },
          "text": "add",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 1,
              "position": 17,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 1,
              "position": 16,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 1,
              "position": 18,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 1,
              "position": 17,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 1,
              "position": 19,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 1,
              "position": 18,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 1,
              "position": 20,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 1,
              "position": 19,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 1,
              "position": 21,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 1,
              "position": 20,
            },
          },
          "text": "a",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 1,
              "position": 22,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 1,
              "position": 21,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 1,
              "position": 23,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 1,
              "position": 22,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 1,
              "position": 26,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 1,
              "position": 23,
            },
          },
          "text": "Int",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 1,
              "position": 27,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 1,
              "position": 26,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 1,
              "position": 28,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 1,
              "position": 27,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 1,
              "position": 29,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 1,
              "position": 28,
            },
          },
          "text": "b",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 1,
              "position": 30,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 1,
              "position": 29,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 1,
              "position": 31,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 1,
              "position": 30,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 1,
              "position": 34,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 1,
              "position": 31,
            },
          },
          "text": "Int",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 1,
              "position": 35,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 1,
              "position": 34,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 1,
              "position": 36,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 1,
              "position": 35,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 1,
              "position": 37,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 1,
              "position": 36,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 1,
              "position": 40,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 1,
              "position": 37,
            },
          },
          "text": "Int",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 1,
              "position": 41,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 1,
              "position": 40,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 1,
              "position": 42,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 1,
              "position": 41,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 1,
              "position": 43,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 1,
              "position": 42,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 1,
              "position": 44,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 1,
              "position": 43,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 1,
              "position": 45,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 1,
              "position": 44,
            },
          },
          "text": "a",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 1,
              "position": 46,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 1,
              "position": 45,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 1,
              "position": 47,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 1,
              "position": 46,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 48,
              "line": 1,
              "position": 48,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 1,
              "position": 47,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 49,
              "line": 1,
              "position": 49,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 48,
              "line": 1,
              "position": 48,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 50,
              "line": 1,
              "position": 50,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 49,
              "line": 1,
              "position": 49,
            },
          },
          "text": "b",
        },
      ]
    `)
  })

  it('tokenizes referencees to typeclasses', () => {
    const tokens = tokenize(`export typeclass Covariant<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}
export function mapTo<F<_>>(F: Covariant<F>) {
  return <A, B>(fa: F<A>, value: B): F<B> => F.map(fa, () => value)
}`)
    
    expect(tokens).toMatchInlineSnapshot(`
      [
        Token {
          "kind": "ExportKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 1,
              "position": 6,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 1,
              "position": 0,
            },
          },
          "text": "export",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 1,
              "position": 7,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 1,
              "position": 6,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "TypeClassKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 1,
              "position": 16,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 1,
              "position": 7,
            },
          },
          "text": "typeclass",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 1,
              "position": 17,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 1,
              "position": 16,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 1,
              "position": 26,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 1,
              "position": 17,
            },
          },
          "text": "Covariant",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 1,
              "position": 27,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 1,
              "position": 26,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 1,
              "position": 28,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 1,
              "position": 27,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 1,
              "position": 29,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 1,
              "position": 28,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Underscore",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 1,
              "position": 30,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 1,
              "position": 29,
            },
          },
          "text": "_",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 1,
              "position": 31,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 1,
              "position": 30,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 1,
              "position": 32,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 1,
              "position": 31,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 1,
              "position": 33,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 1,
              "position": 32,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "OpenBrace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 1,
              "position": 34,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 1,
              "position": 33,
            },
          },
          "text": "{",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 2,
              "line": 2,
              "position": 37,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 1,
              "position": 34,
            },
          },
          "text": "
        ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 5,
              "line": 2,
              "position": 40,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 2,
              "line": 2,
              "position": 37,
            },
          },
          "text": "map",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 2,
              "position": 41,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 5,
              "line": 2,
              "position": 40,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 2,
              "position": 42,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 2,
              "position": 41,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 8,
              "line": 2,
              "position": 43,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 2,
              "position": 42,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 9,
              "line": 2,
              "position": 44,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 8,
              "line": 2,
              "position": 43,
            },
          },
          "text": "A",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 10,
              "line": 2,
              "position": 45,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 9,
              "line": 2,
              "position": 44,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 11,
              "line": 2,
              "position": 46,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 10,
              "line": 2,
              "position": 45,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 12,
              "line": 2,
              "position": 47,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 11,
              "line": 2,
              "position": 46,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 2,
              "position": 48,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 12,
              "line": 2,
              "position": 47,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 14,
              "line": 2,
              "position": 49,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 2,
              "position": 48,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 2,
              "position": 51,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 14,
              "line": 2,
              "position": 49,
            },
          },
          "text": "fa",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 2,
              "position": 52,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 2,
              "position": 51,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 2,
              "position": 53,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 17,
              "line": 2,
              "position": 52,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 2,
              "position": 54,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 2,
              "position": 53,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 2,
              "position": 55,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 2,
              "position": 54,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 2,
              "position": 56,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 2,
              "position": 55,
            },
          },
          "text": "A",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 2,
              "position": 57,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 2,
              "position": 56,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 2,
              "position": 58,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 2,
              "position": 57,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 2,
              "position": 59,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 2,
              "position": 58,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 2,
              "position": 60,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 2,
              "position": 59,
            },
          },
          "text": "f",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 2,
              "position": 61,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 2,
              "position": 60,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 2,
              "position": 62,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 2,
              "position": 61,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 2,
              "position": 63,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 2,
              "position": 62,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 2,
              "position": 64,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 2,
              "position": 63,
            },
          },
          "text": "a",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 2,
              "position": 65,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 2,
              "position": 64,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 2,
              "position": 66,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 2,
              "position": 65,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 2,
              "position": 67,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 2,
              "position": 66,
            },
          },
          "text": "A",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 2,
              "position": 68,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 2,
              "position": 67,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 2,
              "position": 69,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 2,
              "position": 68,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 2,
              "position": 70,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 2,
              "position": 69,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 2,
              "position": 71,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 2,
              "position": 70,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 2,
              "position": 72,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 2,
              "position": 71,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 38,
              "line": 2,
              "position": 73,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 2,
              "position": 72,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 39,
              "line": 2,
              "position": 74,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 38,
              "line": 2,
              "position": 73,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 2,
              "position": 75,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 39,
              "line": 2,
              "position": 74,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 2,
              "position": 76,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 2,
              "position": 75,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 2,
              "position": 77,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 2,
              "position": 76,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 2,
              "position": 78,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 2,
              "position": 77,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 2,
              "position": 79,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 2,
              "position": 78,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 2,
              "position": 80,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 2,
              "position": 79,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 2,
              "position": 81,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 2,
              "position": 80,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 2,
              "position": 82,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 2,
              "position": 81,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 3,
              "position": 83,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 2,
              "position": 82,
            },
          },
          "text": "
      ",
        },
        Token {
          "kind": "CloseBrace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 1,
              "line": 3,
              "position": 84,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 3,
              "position": 83,
            },
          },
          "text": "}",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 4,
              "position": 85,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 1,
              "line": 3,
              "position": 84,
            },
          },
          "text": "
      ",
        },
        Token {
          "kind": "ExportKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 4,
              "position": 91,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 4,
              "position": 85,
            },
          },
          "text": "export",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 4,
              "position": 92,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 4,
              "position": 91,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "FunctionKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 15,
              "line": 4,
              "position": 100,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 4,
              "position": 92,
            },
          },
          "text": "function",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 4,
              "position": 101,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 15,
              "line": 4,
              "position": 100,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 4,
              "position": 106,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 4,
              "position": 101,
            },
          },
          "text": "mapTo",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 4,
              "position": 107,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 4,
              "position": 106,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 4,
              "position": 108,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 4,
              "position": 107,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 4,
              "position": 109,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 4,
              "position": 108,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Underscore",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 4,
              "position": 110,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 4,
              "position": 109,
            },
          },
          "text": "_",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 4,
              "position": 111,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 4,
              "position": 110,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 4,
              "position": 112,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 4,
              "position": 111,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 4,
              "position": 113,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 27,
              "line": 4,
              "position": 112,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 4,
              "position": 114,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 28,
              "line": 4,
              "position": 113,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 4,
              "position": 115,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 29,
              "line": 4,
              "position": 114,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 4,
              "position": 116,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 30,
              "line": 4,
              "position": 115,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 4,
              "position": 125,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 4,
              "position": 116,
            },
          },
          "text": "Covariant",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 4,
              "position": 126,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 4,
              "position": 125,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 4,
              "position": 127,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 4,
              "position": 126,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 4,
              "position": 128,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 4,
              "position": 127,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 4,
              "position": 129,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 4,
              "position": 128,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 4,
              "position": 130,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 4,
              "position": 129,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "OpenBrace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 4,
              "position": 131,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 4,
              "position": 130,
            },
          },
          "text": "{",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 2,
              "line": 5,
              "position": 134,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 4,
              "position": 131,
            },
          },
          "text": "
        ",
        },
        Token {
          "kind": "ReturnKeyword",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 8,
              "line": 5,
              "position": 140,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 2,
              "line": 5,
              "position": 134,
            },
          },
          "text": "return",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 9,
              "line": 5,
              "position": 141,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 8,
              "line": 5,
              "position": 140,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 10,
              "line": 5,
              "position": 142,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 9,
              "line": 5,
              "position": 141,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 11,
              "line": 5,
              "position": 143,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 10,
              "line": 5,
              "position": 142,
            },
          },
          "text": "A",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 12,
              "line": 5,
              "position": 144,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 11,
              "line": 5,
              "position": 143,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 5,
              "position": 145,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 12,
              "line": 5,
              "position": 144,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 14,
              "line": 5,
              "position": 146,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 13,
              "line": 5,
              "position": 145,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 15,
              "line": 5,
              "position": 147,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 14,
              "line": 5,
              "position": 146,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 5,
              "position": 148,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 15,
              "line": 5,
              "position": 147,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 5,
              "position": 150,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 16,
              "line": 5,
              "position": 148,
            },
          },
          "text": "fa",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 5,
              "position": 151,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 18,
              "line": 5,
              "position": 150,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 5,
              "position": 152,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 19,
              "line": 5,
              "position": 151,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 5,
              "position": 153,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 20,
              "line": 5,
              "position": 152,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 5,
              "position": 154,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 5,
              "position": 153,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 5,
              "position": 155,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 5,
              "position": 154,
            },
          },
          "text": "A",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 5,
              "position": 156,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 5,
              "position": 155,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 5,
              "position": 157,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 5,
              "position": 156,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 5,
              "position": 158,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 5,
              "position": 157,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 5,
              "position": 163,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 5,
              "position": 158,
            },
          },
          "text": "value",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 5,
              "position": 164,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 31,
              "line": 5,
              "position": 163,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 5,
              "position": 165,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 32,
              "line": 5,
              "position": 164,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 5,
              "position": 166,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 5,
              "position": 165,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 5,
              "position": 167,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 5,
              "position": 166,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Colon",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 5,
              "position": 168,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 35,
              "line": 5,
              "position": 167,
            },
          },
          "text": ":",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 5,
              "position": 169,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 36,
              "line": 5,
              "position": 168,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 38,
              "line": 5,
              "position": 170,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 37,
              "line": 5,
              "position": 169,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "LessThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 39,
              "line": 5,
              "position": 171,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 38,
              "line": 5,
              "position": 170,
            },
          },
          "text": "<",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 5,
              "position": 172,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 39,
              "line": 5,
              "position": 171,
            },
          },
          "text": "B",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 5,
              "position": 173,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 40,
              "line": 5,
              "position": 172,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 5,
              "position": 174,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 41,
              "line": 5,
              "position": 173,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 5,
              "position": 175,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 42,
              "line": 5,
              "position": 174,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 5,
              "position": 176,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 43,
              "line": 5,
              "position": 175,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 5,
              "position": 177,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 44,
              "line": 5,
              "position": 176,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 5,
              "position": 178,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 45,
              "line": 5,
              "position": 177,
            },
          },
          "text": "F",
        },
        Token {
          "kind": "Period",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 5,
              "position": 179,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 46,
              "line": 5,
              "position": 178,
            },
          },
          "text": ".",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 50,
              "line": 5,
              "position": 182,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 5,
              "position": 179,
            },
          },
          "text": "map",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 51,
              "line": 5,
              "position": 183,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 50,
              "line": 5,
              "position": 182,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 53,
              "line": 5,
              "position": 185,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 51,
              "line": 5,
              "position": 183,
            },
          },
          "text": "fa",
        },
        Token {
          "kind": "Comma",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 54,
              "line": 5,
              "position": 186,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 53,
              "line": 5,
              "position": 185,
            },
          },
          "text": ",",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 55,
              "line": 5,
              "position": 187,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 54,
              "line": 5,
              "position": 186,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "OpenParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 56,
              "line": 5,
              "position": 188,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 55,
              "line": 5,
              "position": 187,
            },
          },
          "text": "(",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 57,
              "line": 5,
              "position": 189,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 56,
              "line": 5,
              "position": 188,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 58,
              "line": 5,
              "position": 190,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 57,
              "line": 5,
              "position": 189,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "EqualSign",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 59,
              "line": 5,
              "position": 191,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 58,
              "line": 5,
              "position": 190,
            },
          },
          "text": "=",
        },
        Token {
          "kind": "GreaterThan",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 60,
              "line": 5,
              "position": 192,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 59,
              "line": 5,
              "position": 191,
            },
          },
          "text": ">",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 61,
              "line": 5,
              "position": 193,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 60,
              "line": 5,
              "position": 192,
            },
          },
          "text": " ",
        },
        Token {
          "kind": "Identifier",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 66,
              "line": 5,
              "position": 198,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 61,
              "line": 5,
              "position": 193,
            },
          },
          "text": "value",
        },
        Token {
          "kind": "CloseParen",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 67,
              "line": 5,
              "position": 199,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 66,
              "line": 5,
              "position": 198,
            },
          },
          "text": ")",
        },
        Token {
          "kind": "Whitespace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 6,
              "position": 200,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 67,
              "line": 5,
              "position": 199,
            },
          },
          "text": "
      ",
        },
        Token {
          "kind": "CloseBrace",
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 1,
              "line": 6,
              "position": 201,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 6,
              "position": 200,
            },
          },
          "text": "}",
        },
      ]
    `)
  })
});
