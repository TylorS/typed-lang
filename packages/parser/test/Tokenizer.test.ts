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
});
