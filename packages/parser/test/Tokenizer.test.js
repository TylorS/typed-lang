"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("@typed-lang/parser/Token");
const Tokenizer_1 = require("@typed-lang/parser/Tokenizer");
const vitest_1 = require("vitest");
const singleLineLocation = (pos) => new Token_1.SpanLocation(pos, 1, pos);
(0, vitest_1.describe)("Tokenizer", () => {
    (0, vitest_1.it)("tokenizes data types", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`data Maybe<A> = Nothing | Just(A) | Some { value: A }`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.DataKeyword, "data", new Token_1.Span(singleLineLocation(0), singleLineLocation(4))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(4), singleLineLocation(5))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "Maybe", new Token_1.Span(singleLineLocation(5), singleLineLocation(10))),
            new Token_1.Token(Token_1.TokenKind.LessThan, "<", new Token_1.Span(singleLineLocation(10), singleLineLocation(11))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "A", new Token_1.Span(singleLineLocation(11), singleLineLocation(12))),
            new Token_1.Token(Token_1.TokenKind.GreaterThan, ">", new Token_1.Span(singleLineLocation(12), singleLineLocation(13))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(13), singleLineLocation(14))),
            new Token_1.Token(Token_1.TokenKind.EqualSign, "=", new Token_1.Span(singleLineLocation(14), singleLineLocation(15))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(15), singleLineLocation(16))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "Nothing", new Token_1.Span(singleLineLocation(16), singleLineLocation(23))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(23), singleLineLocation(24))),
            new Token_1.Token(Token_1.TokenKind.Pipe, "|", new Token_1.Span(singleLineLocation(24), singleLineLocation(25))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(25), singleLineLocation(26))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "Just", new Token_1.Span(singleLineLocation(26), singleLineLocation(30))),
            new Token_1.Token(Token_1.TokenKind.OpenParen, "(", new Token_1.Span(singleLineLocation(30), singleLineLocation(31))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "A", new Token_1.Span(singleLineLocation(31), singleLineLocation(32))),
            new Token_1.Token(Token_1.TokenKind.CloseParen, ")", new Token_1.Span(singleLineLocation(32), singleLineLocation(33))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(33), singleLineLocation(34))),
            new Token_1.Token(Token_1.TokenKind.Pipe, "|", new Token_1.Span(singleLineLocation(34), singleLineLocation(35))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(35), singleLineLocation(36))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "Some", new Token_1.Span(singleLineLocation(36), singleLineLocation(40))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(40), singleLineLocation(41))),
            new Token_1.Token(Token_1.TokenKind.OpenBrace, "{", new Token_1.Span(singleLineLocation(41), singleLineLocation(42))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(42), singleLineLocation(43))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "value", new Token_1.Span(singleLineLocation(43), singleLineLocation(48))),
            new Token_1.Token(Token_1.TokenKind.Colon, ":", new Token_1.Span(singleLineLocation(48), singleLineLocation(49))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(49), singleLineLocation(50))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "A", new Token_1.Span(singleLineLocation(50), singleLineLocation(51))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(51), singleLineLocation(52))),
            new Token_1.Token(Token_1.TokenKind.CloseBrace, "}", new Token_1.Span(singleLineLocation(52), singleLineLocation(53))),
        ]);
    });
    (0, vitest_1.it)("tokenizes type aliases for records", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`type Todo = {
  id: number
  text: string
  completed: boolean
}`);
        (0, vitest_1.expect)(tokens).toEqual([
            // 1st line
            new Token_1.Token(Token_1.TokenKind.TypeKeyword, "type", new Token_1.Span(singleLineLocation(0), singleLineLocation(4))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(4), singleLineLocation(5))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "Todo", new Token_1.Span(singleLineLocation(5), singleLineLocation(9))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(9), singleLineLocation(10))),
            new Token_1.Token(Token_1.TokenKind.EqualSign, "=", new Token_1.Span(singleLineLocation(10), singleLineLocation(11))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(11), singleLineLocation(12))),
            new Token_1.Token(Token_1.TokenKind.OpenBrace, "{", new Token_1.Span(singleLineLocation(12), singleLineLocation(13))),
            // 2nd line
            new Token_1.Token(Token_1.TokenKind.Whitespace, "\n  ", new Token_1.Span(singleLineLocation(13), new Token_1.SpanLocation(16, 2, 2))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "id", new Token_1.Span(new Token_1.SpanLocation(16, 2, 2), new Token_1.SpanLocation(18, 2, 4))),
            new Token_1.Token(Token_1.TokenKind.Colon, ":", new Token_1.Span(new Token_1.SpanLocation(18, 2, 4), new Token_1.SpanLocation(19, 2, 5))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(new Token_1.SpanLocation(19, 2, 5), new Token_1.SpanLocation(20, 2, 6))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "number", new Token_1.Span(new Token_1.SpanLocation(20, 2, 6), new Token_1.SpanLocation(26, 2, 12))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, "\n  ", new Token_1.Span(new Token_1.SpanLocation(26, 2, 12), new Token_1.SpanLocation(29, 3, 2))),
            // 3rd line
            new Token_1.Token(Token_1.TokenKind.Identifier, "text", new Token_1.Span(new Token_1.SpanLocation(29, 3, 2), new Token_1.SpanLocation(33, 3, 6))),
            new Token_1.Token(Token_1.TokenKind.Colon, ":", new Token_1.Span(new Token_1.SpanLocation(33, 3, 6), new Token_1.SpanLocation(34, 3, 7))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(new Token_1.SpanLocation(34, 3, 7), new Token_1.SpanLocation(35, 3, 8))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "string", new Token_1.Span(new Token_1.SpanLocation(35, 3, 8), new Token_1.SpanLocation(41, 3, 14))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, "\n  ", new Token_1.Span(new Token_1.SpanLocation(41, 3, 14), new Token_1.SpanLocation(44, 4, 2))),
            // 4th line
            new Token_1.Token(Token_1.TokenKind.Identifier, "completed", new Token_1.Span(new Token_1.SpanLocation(44, 4, 2), new Token_1.SpanLocation(53, 4, 11))),
            new Token_1.Token(Token_1.TokenKind.Colon, ":", new Token_1.Span(new Token_1.SpanLocation(53, 4, 11), new Token_1.SpanLocation(54, 4, 12))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(new Token_1.SpanLocation(54, 4, 12), new Token_1.SpanLocation(55, 4, 13))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "boolean", new Token_1.Span(new Token_1.SpanLocation(55, 4, 13), new Token_1.SpanLocation(62, 4, 20))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, "\n", new Token_1.Span(new Token_1.SpanLocation(62, 4, 20), new Token_1.SpanLocation(63, 5, 0))),
            // 5th line
            new Token_1.Token(Token_1.TokenKind.CloseBrace, "}", new Token_1.Span(new Token_1.SpanLocation(63, 5, 0), new Token_1.SpanLocation(64, 5, 1))),
        ]);
    });
    (0, vitest_1.it)("tokenizes comments", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`// This is a comment`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.Comment, "// This is a comment", new Token_1.Span(singleLineLocation(0), singleLineLocation(20))),
        ]);
    });
    (0, vitest_1.it)("tokenizes string literals", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`"Hello, World!"`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.StringLiteral, '"Hello, World!"', new Token_1.Span(singleLineLocation(0), singleLineLocation(15))),
        ]);
    });
    (0, vitest_1.it)("tokenizes number literals", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`123`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.NumberLiteral, "123", new Token_1.Span(singleLineLocation(0), singleLineLocation(3))),
        ]);
    });
    (0, vitest_1.it)("tokenizes boolean literals", () => {
        (0, vitest_1.expect)((0, Tokenizer_1.tokenize)(`true`)).toEqual([
            new Token_1.Token(Token_1.TokenKind.BooleanLiteral, "true", new Token_1.Span(singleLineLocation(0), singleLineLocation(4))),
        ]);
        (0, vitest_1.expect)((0, Tokenizer_1.tokenize)(`false`)).toEqual([
            new Token_1.Token(Token_1.TokenKind.BooleanLiteral, "false", new Token_1.Span(singleLineLocation(0), singleLineLocation(5))),
        ]);
    });
    (0, vitest_1.it)("tokenizes identifiers", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`foo bar baz`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.Identifier, "foo", new Token_1.Span(singleLineLocation(0), singleLineLocation(3))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(3), singleLineLocation(4))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "bar", new Token_1.Span(singleLineLocation(4), singleLineLocation(7))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(7), singleLineLocation(8))),
            new Token_1.Token(Token_1.TokenKind.Identifier, "baz", new Token_1.Span(singleLineLocation(8), singleLineLocation(11))),
        ]);
    });
    (0, vitest_1.it)("tokenizes punctuation", () => {
        const tokens = (0, Tokenizer_1.tokenize)(`{ } [ ] ( ) , : | .`);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.OpenBrace, "{", new Token_1.Span(singleLineLocation(0), singleLineLocation(1))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(1), singleLineLocation(2))),
            new Token_1.Token(Token_1.TokenKind.CloseBrace, "}", new Token_1.Span(singleLineLocation(2), singleLineLocation(3))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(3), singleLineLocation(4))),
            new Token_1.Token(Token_1.TokenKind.OpenBracket, "[", new Token_1.Span(singleLineLocation(4), singleLineLocation(5))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(5), singleLineLocation(6))),
            new Token_1.Token(Token_1.TokenKind.CloseBracket, "]", new Token_1.Span(singleLineLocation(6), singleLineLocation(7))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(7), singleLineLocation(8))),
            new Token_1.Token(Token_1.TokenKind.OpenParen, "(", new Token_1.Span(singleLineLocation(8), singleLineLocation(9))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(9), singleLineLocation(10))),
            new Token_1.Token(Token_1.TokenKind.CloseParen, ")", new Token_1.Span(singleLineLocation(10), singleLineLocation(11))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(11), singleLineLocation(12))),
            new Token_1.Token(Token_1.TokenKind.Comma, ",", new Token_1.Span(singleLineLocation(12), singleLineLocation(13))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(13), singleLineLocation(14))),
            new Token_1.Token(Token_1.TokenKind.Colon, ":", new Token_1.Span(singleLineLocation(14), singleLineLocation(15))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(15), singleLineLocation(16))),
            new Token_1.Token(Token_1.TokenKind.Pipe, "|", new Token_1.Span(singleLineLocation(16), singleLineLocation(17))),
            new Token_1.Token(Token_1.TokenKind.Whitespace, " ", new Token_1.Span(singleLineLocation(17), singleLineLocation(18))),
            new Token_1.Token(Token_1.TokenKind.Period, ".", new Token_1.Span(singleLineLocation(18), singleLineLocation(19))),
        ]);
    });
    (0, vitest_1.it)("tokenizes whitespace", () => {
        const tokens = (0, Tokenizer_1.tokenize)(` \n  `);
        (0, vitest_1.expect)(tokens).toEqual([
            new Token_1.Token(Token_1.TokenKind.Whitespace, ` \n  `, new Token_1.Span(singleLineLocation(0), new Token_1.SpanLocation(4, 2, 2))),
        ]);
    });
});
