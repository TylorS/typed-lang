import {
  DataDeclaration,
  NamedField,
  RecordConstructor,
  RecordType,
  TupleConstructor,
  TypeAlias,
  TypeField,
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
      `data Maybe<A> = Nothing | Just(A) | Some { value: A }`
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
              new TypeField(
                new TypeReference(`A`, [], new Span(31, 32)),
                new Span(31, 32)
              ),
            ],
            new Span(26, 33)
          ),
          new RecordConstructor(
            `Some`,
            [
              new NamedField(
                `value`,
                new TypeReference(`A`, [], new Span(50, 51)),
                new Span(43, 51)
              ),
            ],
            new Span(36, 53)
          ),
        ],
        new Span(0, 53)
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
