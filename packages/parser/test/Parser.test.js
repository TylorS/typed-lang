"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AST_1 = require("@typed-lang/parser/AST");
const Parser_1 = require("@typed-lang/parser/Parser");
const Token_1 = require("@typed-lang/parser/Token");
const vitest_1 = require("vitest");
(0, vitest_1.describe)("Parser", () => {
    (0, vitest_1.it)("parses data types", () => {
        const { statements } = (0, Parser_1.parse)("test.typed", `data Maybe<A> = Nothing | Just(value: A) | Some { value: A }`);
        const singleLineLocation = (pos) => new Token_1.SpanLocation(pos, 1, pos);
        (0, vitest_1.expect)(statements).toEqual([
            new AST_1.DataDeclaration(`Maybe`, [new AST_1.TypeParameter(`A`, new Token_1.Span(singleLineLocation(11), singleLineLocation(12)))], [
                new AST_1.VoidConstructor(`Nothing`, new Token_1.Span(singleLineLocation(16), singleLineLocation(23))),
                new AST_1.TupleConstructor(`Just`, [
                    new AST_1.NamedField(`value`, new AST_1.TypeReference(`A`, [], new Token_1.Span(singleLineLocation(38), singleLineLocation(39))), new Token_1.Span(singleLineLocation(31), singleLineLocation(39))),
                ], new Token_1.Span(singleLineLocation(26), singleLineLocation(40))),
                new AST_1.RecordConstructor(`Some`, [
                    new AST_1.NamedField(`value`, new AST_1.TypeReference(`A`, [], new Token_1.Span(singleLineLocation(57), singleLineLocation(58))), new Token_1.Span(singleLineLocation(50), singleLineLocation(58))),
                ], new Token_1.Span(singleLineLocation(43), singleLineLocation(60))),
            ], new Token_1.Span(singleLineLocation(0), singleLineLocation(60))),
        ]);
    });
    (0, vitest_1.it)("parses type aliases for records", () => {
        const { statements } = (0, Parser_1.parse)(`test.typed`, `type Todo = {
  id: number
  text: string
  completed: boolean
}`);
        const singleLineLocation = (pos) => new Token_1.SpanLocation(pos, 1, pos);
        (0, vitest_1.expect)(statements).toEqual([
            new AST_1.TypeAlias(`Todo`, [], new AST_1.RecordType([
                new AST_1.NamedField(`id`, new AST_1.TypeReference(`number`, [], new Token_1.Span(new Token_1.SpanLocation(20, 2, 6), new Token_1.SpanLocation(26, 2, 12))), new Token_1.Span(new Token_1.SpanLocation(16, 2, 2), new Token_1.SpanLocation(26, 2, 12))),
                new AST_1.NamedField(`text`, new AST_1.TypeReference(`string`, [], new Token_1.Span(new Token_1.SpanLocation(35, 3, 8), new Token_1.SpanLocation(41, 3, 14))), new Token_1.Span(new Token_1.SpanLocation(29, 3, 2), new Token_1.SpanLocation(41, 3, 14))),
                new AST_1.NamedField(`completed`, new AST_1.TypeReference(`boolean`, [], new Token_1.Span(new Token_1.SpanLocation(55, 4, 13), new Token_1.SpanLocation(62, 4, 20))), new Token_1.Span(new Token_1.SpanLocation(44, 4, 2), new Token_1.SpanLocation(62, 4, 20))),
            ], new Token_1.Span(singleLineLocation(12), new Token_1.SpanLocation(64, 5, 1))), new Token_1.Span(singleLineLocation(0), new Token_1.SpanLocation(64, 5, 1))),
        ]);
    });
});
