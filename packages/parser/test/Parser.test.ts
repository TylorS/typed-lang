import { describe, expect, it } from "vitest";
import { parse } from "../src/Parser.js";
import * as AST from "../src/AST/index.js";
import { Span, SpanLocation } from "../src/Span.js";

const dummySpan = new Span(
  new SpanLocation(0, 0, 0),
  new SpanLocation(0, 0, 0)
);

describe("Parser", () => {
  it("parses data declarations", () => {
    const fileName = "test.typed";
    const source = `export data Maybe<A> =
  | Nothing
  | Just(value: A)
`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.DataDeclaration(
        new AST.Identifier(
          "Maybe",
          new Span(new SpanLocation(12, 1, 12), new SpanLocation(17, 1, 17))
        ),
        [
          new AST.TypeParameter(
            new AST.Identifier(
              `A`,
              new Span(new SpanLocation(18, 1, 18), new SpanLocation(19, 1, 19))
            ),
            undefined,
            new Span(new SpanLocation(18, 1, 18), new SpanLocation(19, 1, 19))
          ),
        ],
        new Span(new SpanLocation(21, 1, 21), new SpanLocation(22, 1, 22)), // =
        [
          new AST.VoidConstructor(
            new AST.Identifier(
              `Nothing`,
              new Span(new SpanLocation(27, 2, 4), new SpanLocation(34, 2, 11))
            ),
            new Span(new SpanLocation(27, 2, 4), new SpanLocation(34, 2, 11))
          ),
          new AST.TupleConstructor(
            new AST.Identifier(
              `Just`,
              new Span(new SpanLocation(39, 3, 4), new SpanLocation(43, 3, 8))
            ),
            [
              new AST.NamedField(
                new AST.Identifier(
                  `value`,
                  new Span(
                    new SpanLocation(44, 3, 9),
                    new SpanLocation(49, 3, 14)
                  )
                ),
                new AST.TypeReference(
                  new AST.Identifier(
                    `A`,
                    new Span(
                      new SpanLocation(51, 3, 16),
                      new SpanLocation(52, 3, 17)
                    )
                  ),
                  [],
                  new Span(
                    new SpanLocation(51, 3, 16),
                    new SpanLocation(52, 3, 17)
                  )
                ),
                new Span(
                  new SpanLocation(44, 3, 9),
                  new SpanLocation(52, 3, 17)
                )
              ),
            ],
            new Span(new SpanLocation(39, 3, 4), new SpanLocation(53, 3, 18))
          ),
        ],
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(53, 3, 18)), // full span
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6)) // Export span
      ),
    ]);
  });

  it("parses single-line comments", () => {
    const fileName = "test.typed";
    const source = `// This is a comment`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.Comment(
        `// This is a comment`,
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(20, 1, 20))
      ),
    ]);
  });

  it("parses simple type aliases", () => {
    const fileName = "test.typed";
    const source = `type A = String
type B = Number
type C = Boolean
export type D = Unknown
`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(5, 1, 5), new SpanLocation(6, 1, 6))
        ),
        [],
        new AST.StringType(
          new Span(new SpanLocation(9, 1, 9), new SpanLocation(15, 1, 15))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(15, 1, 15)),
        undefined
      ),
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `B`,
          new Span(new SpanLocation(21, 2, 5), new SpanLocation(22, 2, 6))
        ),
        [],
        new AST.NumberType(
          new Span(new SpanLocation(25, 2, 9), new SpanLocation(31, 2, 15))
        ),
        new Span(new SpanLocation(16, 2, 0), new SpanLocation(31, 2, 15)),
        undefined
      ),
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `C`,
          new Span(new SpanLocation(37, 3, 5), new SpanLocation(38, 3, 6))
        ),
        [],
        new AST.BooleanType(
          new Span(new SpanLocation(41, 3, 9), new SpanLocation(48, 3, 16))
        ),
        new Span(new SpanLocation(32, 3, 0), new SpanLocation(48, 3, 16)),
        undefined
      ),
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `D`,
          new Span(new SpanLocation(61, 4, 12), new SpanLocation(62, 4, 13))
        ),
        [],
        new AST.UnknownType(
          new Span(new SpanLocation(65, 4, 16), new SpanLocation(72, 4, 23))
        ),
        new Span(new SpanLocation(49, 4, 0), new SpanLocation(72, 4, 23)),
        new Span(new SpanLocation(49, 4, 0), new SpanLocation(55, 4, 6))
      ),
    ]);
  });

  it("parses Array type aliases", () => {
    const fileName = "test.typed";
    const source = `type A = Array<String>`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(5, 1, 5), new SpanLocation(6, 1, 6))
        ),
        [],
        new AST.ArrayType(
          new AST.StringType(
            new Span(new SpanLocation(15, 1, 15), new SpanLocation(21, 1, 21))
          ),
          new Span(new SpanLocation(9, 1, 9), new SpanLocation(22, 1, 22))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(22, 1, 22)),
        undefined
      ),
    ]);
  });

  it("parses Record type aliases", () => {
    const fileName = "test.typed";
    const source = `type A = { name: String; age: Number }`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(5, 1, 5), new SpanLocation(6, 1, 6))
        ),
        [],
        new AST.RecordType(
          [
            new AST.NamedField(
              new AST.Identifier(
                `name`,
                new Span(
                  new SpanLocation(11, 1, 11),
                  new SpanLocation(15, 1, 15)
                )
              ),
              new AST.StringType(
                new Span(
                  new SpanLocation(17, 1, 17),
                  new SpanLocation(23, 1, 23)
                )
              ),
              new Span(new SpanLocation(11, 1, 11), new SpanLocation(23, 1, 23))
            ),
            new AST.NamedField(
              new AST.Identifier(
                `age`,
                new Span(
                  new SpanLocation(25, 1, 25),
                  new SpanLocation(28, 1, 28)
                )
              ),
              new AST.NumberType(
                new Span(
                  new SpanLocation(30, 1, 30),
                  new SpanLocation(36, 1, 36)
                )
              ),
              new Span(new SpanLocation(25, 1, 25), new SpanLocation(36, 1, 36))
            ),
          ],
          new Span(new SpanLocation(9, 1, 9), new SpanLocation(38, 1, 38))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(38, 1, 38)),
        undefined
      ),
    ]);
  });

  it("parses Tuple type aliases", () => {
    const fileName = "test.typed";
    const source = `type A = [String, Number]`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(5, 1, 5), new SpanLocation(6, 1, 6))
        ),
        [],
        new AST.TupleType(
          [
            new AST.StringType(
              new Span(new SpanLocation(10, 1, 10), new SpanLocation(16, 1, 16))
            ),
            new AST.NumberType(
              new Span(new SpanLocation(18, 1, 18), new SpanLocation(24, 1, 24))
            ),
          ],
          new Span(new SpanLocation(9, 1, 9), new SpanLocation(25, 1, 25))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(25, 1, 25)),
        undefined
      ),
    ]);
  });

  it("parses Tuple type aliases with rest parameter", () => {
    const fileName = "test.typed";
    const source = `type A = [String, Number, ...Array<String>]`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeAliasDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(5, 1, 5), new SpanLocation(6, 1, 6))
        ),
        [],
        new AST.TupleType(
          [
            new AST.StringType(
              new Span(new SpanLocation(10, 1, 10), new SpanLocation(16, 1, 16))
            ),
            new AST.NumberType(
              new Span(new SpanLocation(18, 1, 18), new SpanLocation(24, 1, 24))
            ),
            new AST.RestType(
              new AST.ArrayType(
                new AST.StringType(
                  new Span(
                    new SpanLocation(35, 1, 35),
                    new SpanLocation(41, 1, 41)
                  )
                ),
                new Span(
                  new SpanLocation(29, 1, 29),
                  new SpanLocation(42, 1, 42)
                )
              ),
              new Span(new SpanLocation(26, 1, 26), new SpanLocation(42, 1, 42))
            ),
          ],
          new Span(new SpanLocation(9, 1, 9), new SpanLocation(43, 1, 43))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(43, 1, 43)),
        undefined
      ),
    ]);
  });

  it("parses brand declarations", () => {
    const fileName = "test.typed";
    const source = `export brand A = String`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.BrandDeclaration(
        new AST.Identifier(
          `A`,
          new Span(new SpanLocation(13, 1, 13), new SpanLocation(14, 1, 14))
        ),
        new Span(new SpanLocation(15, 1, 15), new SpanLocation(16, 1, 16)),
        new AST.StringType(
          new Span(new SpanLocation(17, 1, 17), new SpanLocation(23, 1, 23))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(23, 1, 23)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6))
      ),
    ]);
  });

  it("parses function declarations", () => {
    const fileName = "test.typed";
    const source = `export function add(a: Number, b: Number): Number {
  return a + b
}`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.FunctionDeclaration(
        new AST.Identifier(
          `add`,
          new Span(new SpanLocation(16, 1, 16), new SpanLocation(19, 1, 19))
        ),
        [],
        [
          new AST.NamedField(
            new AST.Identifier(
              `a`,
              new Span(new SpanLocation(20, 1, 20), new SpanLocation(21, 1, 21))
            ),
            new AST.NumberType(
              new Span(new SpanLocation(23, 1, 23), new SpanLocation(29, 1, 29))
            ),
            new Span(new SpanLocation(20, 1, 20), new SpanLocation(29, 1, 29))
          ),
          new AST.NamedField(
            new AST.Identifier(
              `b`,
              new Span(new SpanLocation(31, 1, 31), new SpanLocation(32, 1, 32))
            ),
            new AST.NumberType(
              new Span(new SpanLocation(34, 1, 34), new SpanLocation(40, 1, 40))
            ),
            new Span(new SpanLocation(31, 1, 31), new SpanLocation(40, 1, 40))
          ),
        ],
        new AST.NumberType(
          new Span(new SpanLocation(43, 1, 43), new SpanLocation(49, 1, 49))
        ),
        new AST.Block(
          [
            new AST.ReturnStatement(
              new Span(new SpanLocation(54, 2, 2), new SpanLocation(60, 2, 8)),
              new AST.BinaryExpression(
                new AST.Operator(
                  AST.OperatorKind.Add,
                  new Span(
                    new SpanLocation(63, 2, 11),
                    new SpanLocation(64, 2, 12)
                  )
                ),
                new AST.Identifier(
                  `a`,
                  new Span(
                    new SpanLocation(61, 2, 9),
                    new SpanLocation(62, 2, 10)
                  )
                ),
                new AST.Identifier(
                  `b`,
                  new Span(
                    new SpanLocation(65, 2, 13),
                    new SpanLocation(66, 2, 14)
                  )
                ),
                new Span(
                  new SpanLocation(61, 2, 9),
                  new SpanLocation(66, 2, 14)
                )
              ),
              new Span(new SpanLocation(54, 2, 2), new SpanLocation(66, 2, 14))
            ),
          ],
          new Span(new SpanLocation(50, 1, 50), new SpanLocation(66, 2, 14))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(66, 2, 14)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6))
      ),
    ]);
  });

  it("parses function declarations with type parameters", () => {
    const fileName = "test.typed";
    const source = `export function identity<A>(a: A): A { return a }`;

    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.FunctionDeclaration(
        new AST.Identifier(
          `identity`,
          new Span(new SpanLocation(16, 1, 16), new SpanLocation(24, 1, 24))
        ),
        [
          new AST.TypeParameter(
            new AST.Identifier(
              `A`,
              new Span(new SpanLocation(25, 1, 25), new SpanLocation(26, 1, 26))
            ),
            undefined,
            new Span(new SpanLocation(25, 1, 25), new SpanLocation(26, 1, 26))
          ),
        ],
        [
          new AST.NamedField(
            new AST.Identifier(
              `a`,
              new Span(new SpanLocation(28, 1, 28), new SpanLocation(29, 1, 29))
            ),
            new AST.TypeReference(
              new AST.Identifier(
                `A`,
                new Span(
                  new SpanLocation(31, 1, 31),
                  new SpanLocation(32, 1, 32)
                )
              ),
              [],
              new Span(new SpanLocation(31, 1, 31), new SpanLocation(32, 1, 32))
            ),
            new Span(new SpanLocation(28, 1, 28), new SpanLocation(32, 1, 32))
          ),
        ],
        new AST.TypeReference(
          new AST.Identifier(
            `A`,
            new Span(new SpanLocation(35, 1, 35), new SpanLocation(36, 1, 36))
          ),
          [],
          new Span(new SpanLocation(35, 1, 35), new SpanLocation(36, 1, 36))
        ),
        new AST.Block(
          [
            new AST.ReturnStatement(
              new Span(
                new SpanLocation(39, 1, 39),
                new SpanLocation(45, 1, 45)
              ),
              new AST.Identifier(
                `a`,
                new Span(
                  new SpanLocation(46, 1, 46),
                  new SpanLocation(47, 1, 47)
                )
              ),
              new Span(new SpanLocation(39, 1, 39), new SpanLocation(47, 1, 47))
            ),
          ],
          new Span(new SpanLocation(37, 1, 37), new SpanLocation(47, 1, 47))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(47, 1, 47)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6))
      ),
    ]);
  });

  it("parses variable declarations", () => {
    const fileName = "test.typed";
    const source = `export const a: Number = 1`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.VariableDeclaration(
        new AST.Identifier(
          `a`,
          new Span(new SpanLocation(13, 1, 13), new SpanLocation(14, 1, 14))
        ),
        new AST.NumberType(
          new Span(new SpanLocation(16, 1, 16), new SpanLocation(22, 1, 22))
        ),
        new Span(new SpanLocation(23, 1, 23), new SpanLocation(24, 1, 24)),
        new AST.NumberLiteral(
          1,
          new Span(new SpanLocation(25, 1, 25), new SpanLocation(26, 1, 26))
        ),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(26, 1, 26)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6))
      ),
    ]);
  });

  it("parses typeclass declarations", () => {
    const fileName = "test.typed";
    const source = `export typeclass Eq<A> {}`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeClassDeclaration(
        new AST.Identifier(
          `Eq`,
          new Span(new SpanLocation(17, 1, 17), new SpanLocation(19, 1, 19))
        ),
        [
          new AST.TypeParameter(
            new AST.Identifier(
              `A`,
              new Span(new SpanLocation(20, 1, 20), new SpanLocation(21, 1, 21))
            ),
            undefined,
            new Span(new SpanLocation(20, 1, 20), new SpanLocation(21, 1, 21))
          ),
        ],
        new Span(new SpanLocation(23, 1, 23), new SpanLocation(24, 1, 24)),
        [],
        new Span(new SpanLocation(24, 1, 24), new SpanLocation(25, 1, 25)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(25, 1, 25)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(6, 1, 6))
      ),
    ]);
  });

  it("parses typeclass declaration with higher-kinded types", () => {
    const fileName = "test.typed";
    const source = `typeclass Covariant<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}`;

    const sourceFile = parse(fileName, source);

    expect(sourceFile.declarations).toEqual([
      new AST.TypeClassDeclaration(
        new AST.Identifier(
          `Covariant`,
          new Span(new SpanLocation(10, 1, 10), new SpanLocation(19, 1, 19))
        ),
        [
          new AST.HigherKindedType(
            new AST.Identifier(
              `F`,
              new Span(new SpanLocation(20, 1, 20), new SpanLocation(21, 1, 21))
            ),
            [
              new AST.TypeParameter(
                new AST.Identifier(
                  `_`,
                  new Span(
                    new SpanLocation(22, 1, 22),
                    new SpanLocation(23, 1, 23)
                  )
                ),
                undefined,
                new Span(
                  new SpanLocation(22, 1, 22),
                  new SpanLocation(23, 1, 23)
                )
              ),
            ],
            undefined,
            new Span(new SpanLocation(20, 1, 20), new SpanLocation(23, 1, 23))
          ),
        ],
        new Span(new SpanLocation(26, 1, 26), new SpanLocation(27, 1, 27)),
        [
          new AST.NamedField(
            new AST.Identifier(
              `map`,
              new Span(new SpanLocation(30, 2, 2), new SpanLocation(33, 2, 5))
            ),
            new AST.FunctionType(
              [
                new AST.TypeParameter(
                  new AST.Identifier(
                    `A`,
                    new Span(
                      new SpanLocation(36, 2, 8),
                      new SpanLocation(37, 2, 9)
                    )
                  ),
                  undefined,
                  new Span(
                    new SpanLocation(36, 2, 8),
                    new SpanLocation(37, 2, 9)
                  )
                ),
                new AST.TypeParameter(
                  new AST.Identifier(
                    `B`,
                    new Span(
                      new SpanLocation(39, 2, 11),
                      new SpanLocation(40, 2, 12)
                    )
                  ),
                  undefined,
                  new Span(
                    new SpanLocation(39, 2, 11),
                    new SpanLocation(40, 2, 12)
                  )
                ),
              ],
              [
                new AST.NamedField(
                  new AST.Identifier(
                    `fa`,
                    new Span(
                      new SpanLocation(42, 2, 14),
                      new SpanLocation(44, 2, 16)
                    )
                  ),
                  new AST.TypeReference(
                    new AST.Identifier(
                      `F`,
                      new Span(
                        new SpanLocation(46, 2, 18),
                        new SpanLocation(47, 2, 19)
                      )
                    ),
                    [
                      new AST.TypeReference(
                        new AST.Identifier(
                          `A`,
                          new Span(
                            new SpanLocation(48, 2, 20),
                            new SpanLocation(49, 2, 21)
                          )
                        ),
                        [],
                        new Span(
                          new SpanLocation(48, 2, 20),
                          new SpanLocation(49, 2, 21)
                        )
                      ),
                    ],
                    new Span(
                      new SpanLocation(46, 2, 18),
                      new SpanLocation(49, 2, 21)
                    )
                  ),
                  new Span(
                    new SpanLocation(42, 2, 14),
                    new SpanLocation(49, 2, 21)
                  )
                ),
                new AST.NamedField(
                  new AST.Identifier(
                    `f`,
                    new Span(
                      new SpanLocation(52, 2, 24),
                      new SpanLocation(53, 2, 25)
                    )
                  ),
                  new AST.FunctionType(
                    [],
                    [
                      new AST.NamedField(
                        new AST.Identifier(
                          `a`,
                          new Span(
                            new SpanLocation(56, 2, 28),
                            new SpanLocation(57, 2, 29)
                          )
                        ),
                        new AST.TypeReference(
                          new AST.Identifier(
                            `A`,
                            new Span(
                              new SpanLocation(59, 2, 31),
                              new SpanLocation(60, 2, 32)
                            )
                          ),
                          [],
                          new Span(
                            new SpanLocation(59, 2, 31),
                            new SpanLocation(60, 2, 32)
                          )
                        ),
                        new Span(
                          new SpanLocation(56, 2, 28),
                          new SpanLocation(60, 2, 32)
                        )
                      ),
                    ],
                    new AST.TypeReference(
                      new AST.Identifier(
                        `B`,
                        new Span(
                          new SpanLocation(65, 2, 37),
                          new SpanLocation(66, 2, 38)
                        )
                      ),
                      [],
                      new Span(
                        new SpanLocation(65, 2, 37),
                        new SpanLocation(66, 2, 38)
                      )
                    ),
                    new Span(
                      new SpanLocation(55, 2, 27),
                      new SpanLocation(66, 2, 38)
                    )
                  ),
                  new Span(
                    new SpanLocation(52, 2, 24),
                    new SpanLocation(66, 2, 38)
                  )
                ),
              ],
              new AST.TypeReference(
                new AST.Identifier(
                  `F`,
                  new Span(
                    new SpanLocation(71, 2, 43),
                    new SpanLocation(72, 2, 44)
                  )
                ),
                [
                  new AST.TypeReference(
                    new AST.Identifier(
                      `B`,
                      new Span(
                        new SpanLocation(73, 2, 45),
                        new SpanLocation(74, 2, 46)
                      )
                    ),
                    [],
                    new Span(
                      new SpanLocation(73, 2, 45),
                      new SpanLocation(74, 2, 46)
                    )
                  ),
                ],
                new Span(
                  new SpanLocation(71, 2, 43),
                  new SpanLocation(74, 2, 46)
                )
              ),
              new Span(new SpanLocation(41, 2, 13), new SpanLocation(74, 2, 46))
            ),
            new Span(new SpanLocation(30, 2, 2), new SpanLocation(74, 2, 46))
          ),
        ],
        new Span(new SpanLocation(76, 3, 0), new SpanLocation(77, 3, 1)),
        new Span(new SpanLocation(0, 1, 0), new SpanLocation(77, 3, 1)),
        undefined
      ),
    ]);
  });

  it("parses instance declarations", () => {
    const fileName = "test.typed";
    const source = `export typeclass Covariant<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}

export data Maybe<A> = Nothing | Just(value: A)

export instance Covariant<Maybe> {
  map: <A, B>(fa: Maybe<A>, f: (a: A) => B): Maybe<B> =>
    Maybe.match(fa, { Nothing: () => Nothing, Just: (value) => Just(f(value)) })
}
`;

    const sourceFile = parse(fileName, source);

    assertAst(
      sourceFile.declarations[0],
      new AST.TypeClassDeclaration(
        new AST.Identifier(`Covariant`, dummySpan),
        [
          new AST.HigherKindedType(
            new AST.Identifier(`F`, dummySpan),
            [
              new AST.TypeParameter(
                new AST.Identifier(`_`, dummySpan),
                undefined,
                dummySpan
              ),
            ],
            undefined,
            dummySpan
          ),
        ],
        dummySpan,
        [
          new AST.NamedField(
            new AST.Identifier(`map`, dummySpan),
            new AST.FunctionType(
              [
                new AST.TypeParameter(
                  new AST.Identifier(`A`, dummySpan),
                  undefined,
                  dummySpan
                ),
                new AST.TypeParameter(
                  new AST.Identifier(`B`, dummySpan),
                  undefined,
                  dummySpan
                ),
              ],
              [
                new AST.NamedField(
                  new AST.Identifier(`fa`, dummySpan),
                  new AST.TypeReference(
                    new AST.Identifier(`F`, dummySpan),
                    [
                      new AST.TypeReference(
                        new AST.Identifier(`A`, dummySpan),
                        [],
                        dummySpan
                      ),
                    ],
                    dummySpan
                  ),
                  dummySpan
                ),
                new AST.NamedField(
                  new AST.Identifier(`f`, dummySpan),
                  new AST.FunctionType(
                    [],
                    [
                      new AST.NamedField(
                        new AST.Identifier(`a`, dummySpan),
                        new AST.TypeReference(
                          new AST.Identifier(`A`, dummySpan),
                          [],
                          dummySpan
                        ),
                        dummySpan
                      ),
                    ],
                    new AST.TypeReference(
                      new AST.Identifier(`B`, dummySpan),
                      [],
                      dummySpan
                    ),
                    dummySpan
                  ),
                  dummySpan
                ),
              ],
              new AST.TypeReference(
                new AST.Identifier(`F`, dummySpan),
                [
                  new AST.TypeReference(
                    new AST.Identifier(
                      `B`,
                      new Span(
                        new SpanLocation(73, 2, 45),
                        new SpanLocation(74, 2, 46)
                      )
                    ),
                    [],
                    new Span(
                      new SpanLocation(73, 2, 45),
                      new SpanLocation(74, 2, 46)
                    )
                  ),
                ],
                dummySpan
              ),
              dummySpan
            ),
            dummySpan
          ),
        ],
        dummySpan,
        dummySpan,
        dummySpan
      )
    );

    assertAst(
      sourceFile.declarations[1],
      new AST.DataDeclaration(
        new AST.Identifier("Maybe", dummySpan),
        [
          new AST.TypeParameter(
            new AST.Identifier("A", dummySpan),
            undefined,
            dummySpan
          ),
        ],
        dummySpan,
        [
          new AST.VoidConstructor(
            new AST.Identifier("Nothing", dummySpan),
            dummySpan
          ),
          new AST.TupleConstructor(
            new AST.Identifier("Just", dummySpan),
            [
              new AST.NamedField(
                new AST.Identifier("value", dummySpan),
                new AST.TypeReference(
                  new AST.Identifier("A", dummySpan),
                  [],
                  dummySpan
                ),
                dummySpan
              ),
            ],
            dummySpan
          ),
        ],
        dummySpan,
        dummySpan
      )
    );

    assertAst(
      sourceFile.declarations[2],
      new AST.InstanceDeclaration(
        new AST.Identifier("Covariant", dummySpan),
        [
          new AST.TypeParameter(
            new AST.Identifier("Maybe", dummySpan),
            undefined,
            dummySpan
          ),
        ],
        dummySpan,
        [
          new AST.InstanceField(
            new AST.Identifier("map", dummySpan),
            new AST.FunctionExpression(
              null,
              [
                new AST.TypeParameter(
                  new AST.Identifier("A", dummySpan),
                  undefined,
                  dummySpan
                ),
                new AST.TypeParameter(
                  new AST.Identifier("B", dummySpan),
                  undefined,
                  dummySpan
                ),
              ],
              [
                new AST.NamedField(
                  new AST.Identifier("fa", dummySpan),
                  new AST.TypeReference(
                    new AST.Identifier("Maybe", dummySpan),
                    [
                      new AST.TypeReference(
                        new AST.Identifier("A", dummySpan),
                        [],
                        dummySpan
                      ),
                    ],
                    dummySpan
                  ),
                  dummySpan
                ),
                new AST.NamedField(
                  new AST.Identifier("f", dummySpan),
                  new AST.FunctionType(
                    [],
                    [
                      new AST.NamedField(
                        new AST.Identifier("a", dummySpan),
                        new AST.TypeReference(
                          new AST.Identifier("A", dummySpan),
                          [],
                          dummySpan
                        ),
                        dummySpan
                      ),
                    ],
                    new AST.TypeReference(
                      new AST.Identifier("B", dummySpan),
                      [],
                      dummySpan
                    ),
                    dummySpan
                  ),
                  dummySpan
                ),
              ],
              new AST.TypeReference(
                new AST.Identifier("Maybe", dummySpan),
                [
                  new AST.TypeReference(
                    new AST.Identifier("B", dummySpan),
                    [],
                    dummySpan
                  ),
                ],
                dummySpan
              ),
              new AST.FunctionCall(
                new AST.MemberExpression(
                  new AST.Identifier("Maybe", dummySpan),
                  dummySpan,
                  new AST.Identifier("match", dummySpan),
                  dummySpan
                ),
                [],
                [
                  new AST.Identifier("fa", dummySpan),
                  new AST.RecordLiteral(
                    [
                      new AST.RecordField(
                        new AST.Identifier("Nothing", dummySpan),
                        new AST.FunctionExpression(
                          null,
                          [],
                          [],
                          null,
                          new AST.Identifier("Nothing", dummySpan),
                          dummySpan
                        ),
                        dummySpan
                      ),
                      new AST.RecordField(
                        new AST.Identifier("Just", dummySpan),
                        new AST.FunctionExpression(
                          null,
                          [],
                          [
                            new AST.NamedField(
                              new AST.Identifier("value", dummySpan),
                              undefined,
                              dummySpan
                            ),
                          ],
                          null,
                          new AST.FunctionCall(
                            new AST.Identifier("Just", dummySpan),
                            [],
                            [
                              new AST.FunctionCall(
                                new AST.Identifier("f", dummySpan),
                                [],
                                [new AST.Identifier("value", dummySpan)],
                                dummySpan
                              ),
                            ],
                            dummySpan
                          ),
                          dummySpan
                        ),
                        dummySpan
                      ),
                    ],
                    dummySpan
                  ),
                ],
                dummySpan
              ),
              dummySpan
            ),
            dummySpan
          ),
        ],
        dummySpan,
        dummySpan,
        dummySpan
      )
    );
  });
});

function assertAst(a: unknown, b: unknown) {
  expect(recursivelyRemoveSpan(a)).toEqual(recursivelyRemoveSpan(b));
}

function recursivelyRemoveSpan(a: unknown): unknown {
  if (isSpan(a)) return null;

  if (typeof a !== "object") return a;
  if (a === null) return a;

  if (Array.isArray(a)) {
    return a.map(recursivelyRemoveSpan);
  }

  const result: Record<string, unknown> = {};

  for (const key in a) {
    result[key] = recursivelyRemoveSpan(a[key]);
  }

  return result;
}

function isSpan(a: unknown): a is Span {
  return (
    typeof a === "object" && a !== null && "_tag" in a && a["_tag"] === "Span"
  );
}
