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
});
