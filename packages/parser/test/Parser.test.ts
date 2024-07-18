import {
  DataDeclaration,
  NamedField,
  RecordConstructor,
  RecordType,
  TupleConstructor,
  TypeAlias,
  TypeParameter,
  TypeReference,
  VoidConstructor,
} from "@typed-lang/parser/AST";
import { parse } from "@typed-lang/parser/Parser";
import { Span, SpanLocation } from "@typed-lang/parser/Token";
import { describe, expect, it } from "vitest";

describe("Parser", () => {
  it("parses data types", () => {
    const { statements } = parse(
      "test.typed",
      `data Maybe<A> = Nothing | Just(value: A) | Some { value: A }`
    );

    const singleLineLocation = (pos: number) => new SpanLocation(pos, 1, pos);

    expect(statements).toEqual([
      new DataDeclaration(
        `Maybe`,
        [new TypeParameter(`A`, new Span(singleLineLocation(11), singleLineLocation(12)))],
        [
          new VoidConstructor(`Nothing`, new Span(singleLineLocation(16), singleLineLocation(23))),
          new TupleConstructor(
            `Just`,
            [
              new NamedField(
                `value`,
                new TypeReference(`A`, [], new Span(singleLineLocation(38), singleLineLocation(39))),
                new Span(singleLineLocation(31), singleLineLocation(39))
              ),
            ],
            new Span(singleLineLocation(26), singleLineLocation(40))
          ),
          new RecordConstructor(
            `Some`,
            [
              new NamedField(
                `value`,
                new TypeReference(`A`, [], new Span(singleLineLocation(57), singleLineLocation(58))),
                new Span(singleLineLocation(50), singleLineLocation(58))
              ),
            ],
            new Span(singleLineLocation(43), singleLineLocation(60))
          ),
        ],
        new Span(singleLineLocation(0), singleLineLocation(60)),
      ),
    ]);
  });

  it("parses type aliases for records", () => {
    const { statements } = parse(
      `test.typed`,
      `type Todo = {
  id: number
  text: string
  completed: boolean
}`
    );

    const singleLineLocation = (pos: number) => new SpanLocation(pos, 1, pos);

    expect(statements).toEqual([
      new TypeAlias(
        `Todo`,
        [],
        new RecordType(
          [
            new NamedField(
              `id`,
              new TypeReference(`number`, [], new Span(new SpanLocation(20, 2, 6), new SpanLocation(26, 2, 12))),
              new Span(new SpanLocation(16, 2, 2), new SpanLocation(26, 2, 12))
            ),
            new NamedField(
              `text`,
              new TypeReference(`string`, [], new Span(new SpanLocation(35, 3, 8), new SpanLocation(41, 3, 14))),
              new Span(new SpanLocation(29, 3, 2), new SpanLocation(41, 3, 14))
            ),
            new NamedField(
              `completed`,
              new TypeReference(`boolean`, [], new Span(new SpanLocation(55, 4, 13), new SpanLocation(62, 4, 20))),
              new Span(new SpanLocation(44, 4, 2), new SpanLocation(62, 4, 20))
            ),
          ],
          new Span(singleLineLocation(12), new SpanLocation(64, 5, 1))
        ),
        new Span(singleLineLocation(0), new SpanLocation(64, 5, 1))
      ),
    ]);
  });
});
