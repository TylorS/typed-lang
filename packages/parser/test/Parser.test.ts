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
} from "@typed/parser/AST";
import { parse } from "@typed/parser/Parser";
import { Span } from "@typed/parser/Token";
import { tokenize } from "@typed/parser/Tokenizer";
import { describe, expect, it } from "vitest";

describe("Parser", () => {
  it("parses data types", () => {
    const tokens = tokenize(
      `data Maybe<A> = Nothing | Just(value: A) | Some { value: A }`
    );
    const { statements } = parse(tokens);

    expect(statements).toEqual([
      new DataDeclaration(
        `Maybe`,
        [new TypeParameter(`A`, new Span(11, 12))],
        [
          new VoidConstructor(`Nothing`, new Span(16, 23)),
          new TupleConstructor(
            `Just`,
            [
              new NamedField(
                `value`,
                new TypeReference(`A`, [], new Span(38, 39)),
                new Span(31, 39)
              ),
            ],
            new Span(26, 40)
          ),
          new RecordConstructor(
            `Some`,
            [
              new NamedField(
                `value`,
                new TypeReference(`A`, [], new Span(57, 58)),
                new Span(50, 58)
              ),
            ],
            new Span(43, 60)
          ),
        ],
        new Span(0, 60)
      ),
    ]);
  });

  it("parses type aliases for records", () => { 
    const tokens = tokenize(`type Todo = {
  id: number
  text: string
  completed: boolean
}`);
    const { statements } = parse(tokens);

    expect(statements).toEqual([
      new TypeAlias(
        `Todo`,
        [],
        new RecordType(
          [
            new NamedField(
              `id`,
              new TypeReference(`number`, [], new Span(20, 26)),
              new Span(16, 26)
            ),
            new NamedField(
              `text`,
              new TypeReference(`string`, [], new Span(35, 41)),
              new Span(29, 41)
            ),
            new NamedField(
              `completed`,
              new TypeReference(`boolean`, [], new Span(55, 62)),
              new Span(44, 62)
            ),
          ],
          new Span(12, 64)
        ),
        new Span(0, 64)
      ),
    ]);
  })
});
