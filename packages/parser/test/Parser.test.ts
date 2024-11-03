import { describe, expect, it } from "vitest";
import { parse } from "../src/Parser.js";
import * as AST from "../src/AST/index.js";
import { Span, SpanLocation } from "../src/Span.js";

describe("Parser", () => {
  it("parses data declarations", () => {
    const fileName = "test.typed";
    const source = `export data Maybe<A> =
  | Nothing
  | Just(value: A)
`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toEqual([
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

  it("parses data declarations with variance annotations", () => {
    const fileName = "test.typed";
    const source = `export data Maybe<out A> = Nothing | Just(value: A)`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        DataDeclaration {
          "_tag": "DataDeclaration",
          "constructors": [
            VoidConstructor {
              "_tag": "VoidConstructor",
              "name": Identifier {
                "_tag": "Identifier",
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
                    "column": 27,
                    "line": 1,
                    "position": 27,
                  },
                },
                "text": "Nothing",
              },
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
                  "column": 27,
                  "line": 1,
                  "position": 27,
                },
              },
            },
            TupleConstructor {
              "_tag": "TupleConstructor",
              "fields": [
                NamedField {
                  "_tag": "NamedField",
                  "name": Identifier {
                    "_tag": "Identifier",
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
                        "column": 42,
                        "line": 1,
                        "position": 42,
                      },
                    },
                    "text": "value",
                  },
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
                      "column": 42,
                      "line": 1,
                      "position": 42,
                    },
                  },
                  "value": TypeReference {
                    "_tag": "TypeReference",
                    "name": Identifier {
                      "_tag": "Identifier",
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
                      "text": "A",
                    },
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
                    "typeArguments": [],
                  },
                },
              ],
              "name": Identifier {
                "_tag": "Identifier",
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
                    "column": 37,
                    "line": 1,
                    "position": 37,
                  },
                },
                "text": "Just",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 51,
                  "line": 1,
                  "position": 51,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 37,
                  "line": 1,
                  "position": 37,
                },
              },
            },
          ],
          "equals": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 26,
              "line": 1,
              "position": 26,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 1,
              "position": 25,
            },
          },
          "exported": Span {
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
          "name": Identifier {
            "_tag": "Identifier",
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
                "column": 12,
                "line": 1,
                "position": 12,
              },
            },
            "text": "Maybe",
          },
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 51,
              "line": 1,
              "position": 51,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 1,
              "position": 0,
            },
          },
          "typeParameters": [
            TypeParameter {
              "_tag": "TypeParameter",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
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
                "text": "A",
              },
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
              "variance": "out",
            },
          ],
        },
      ]
    `);
  });

  it("parses single-line comments", () => {
    const fileName = "test.typed";
    const source = `// This is a comment`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        FunctionDeclaration {
          "_tag": "FunctionDeclaration",
          "block": Block {
            "_tag": "Block",
            "span": Span {
              "_tag": "Span",
              "end": SpanLocation {
                "_tag": "SpanLocation",
                "column": 14,
                "line": 2,
                "position": 66,
              },
              "start": SpanLocation {
                "_tag": "SpanLocation",
                "column": 50,
                "line": 1,
                "position": 50,
              },
            },
            "statements": [
              ReturnStatement {
                "_tag": "ReturnStatement",
                "expression": BinaryExpression {
                  "_tag": "BinaryExpression",
                  "left": Identifier {
                    "_tag": "Identifier",
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 10,
                        "line": 2,
                        "position": 62,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 9,
                        "line": 2,
                        "position": 61,
                      },
                    },
                    "text": "a",
                  },
                  "operator": Operator {
                    "_tag": "Operator",
                    "kind": "Add",
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 12,
                        "line": 2,
                        "position": 64,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 11,
                        "line": 2,
                        "position": 63,
                      },
                    },
                  },
                  "right": Identifier {
                    "_tag": "Identifier",
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 14,
                        "line": 2,
                        "position": 66,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 13,
                        "line": 2,
                        "position": 65,
                      },
                    },
                    "text": "b",
                  },
                  "span": Span {
                    "_tag": "Span",
                    "end": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 14,
                      "line": 2,
                      "position": 66,
                    },
                    "start": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 9,
                      "line": 2,
                      "position": 61,
                    },
                  },
                },
                "keyword": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 8,
                    "line": 2,
                    "position": 60,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 2,
                    "line": 2,
                    "position": 54,
                  },
                },
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 14,
                    "line": 2,
                    "position": 66,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 2,
                    "line": 2,
                    "position": 54,
                  },
                },
              },
            ],
          },
          "exported": undefined,
          "name": Identifier {
            "_tag": "Identifier",
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
                "column": 16,
                "line": 1,
                "position": 16,
              },
            },
            "text": "add",
          },
          "parameters": [
            NamedField {
              "_tag": "NamedField",
              "name": Identifier {
                "_tag": "Identifier",
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
                  "column": 20,
                  "line": 1,
                  "position": 20,
                },
              },
              "value": NumberType {
                "_tag": "NumberType",
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
                    "column": 23,
                    "line": 1,
                    "position": 23,
                  },
                },
              },
            },
            NamedField {
              "_tag": "NamedField",
              "name": Identifier {
                "_tag": "Identifier",
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
                "text": "b",
              },
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
                  "column": 31,
                  "line": 1,
                  "position": 31,
                },
              },
              "value": NumberType {
                "_tag": "NumberType",
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
                    "column": 34,
                    "line": 1,
                    "position": 34,
                  },
                },
              },
            },
          ],
          "returnType": NumberType {
            "_tag": "NumberType",
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
                "column": 43,
                "line": 1,
                "position": 43,
              },
            },
          },
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 14,
              "line": 2,
              "position": 66,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 7,
              "line": 1,
              "position": 7,
            },
          },
          "typeParameters": [],
        },
      ]
    `);
  });

  it("parses function declarations with type parameters", () => {
    const fileName = "test.typed";
    const source = `export function identity<A>(a: A): A { return a }`;

    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        FunctionDeclaration {
          "_tag": "FunctionDeclaration",
          "block": Block {
            "_tag": "Block",
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
                "column": 37,
                "line": 1,
                "position": 37,
              },
            },
            "statements": [
              ReturnStatement {
                "_tag": "ReturnStatement",
                "expression": Identifier {
                  "_tag": "Identifier",
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
                  "text": "a",
                },
                "keyword": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 45,
                    "line": 1,
                    "position": 45,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 39,
                    "line": 1,
                    "position": 39,
                  },
                },
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
                    "column": 39,
                    "line": 1,
                    "position": 39,
                  },
                },
              },
            ],
          },
          "exported": undefined,
          "name": Identifier {
            "_tag": "Identifier",
            "span": Span {
              "_tag": "Span",
              "end": SpanLocation {
                "_tag": "SpanLocation",
                "column": 24,
                "line": 1,
                "position": 24,
              },
              "start": SpanLocation {
                "_tag": "SpanLocation",
                "column": 16,
                "line": 1,
                "position": 16,
              },
            },
            "text": "identity",
          },
          "parameters": [
            NamedField {
              "_tag": "NamedField",
              "name": Identifier {
                "_tag": "Identifier",
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
                "text": "a",
              },
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
                  "column": 28,
                  "line": 1,
                  "position": 28,
                },
              },
              "value": TypeReference {
                "_tag": "TypeReference",
                "name": Identifier {
                  "_tag": "Identifier",
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
                  "text": "A",
                },
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
                "typeArguments": [],
              },
            },
          ],
          "returnType": TypeReference {
            "_tag": "TypeReference",
            "name": Identifier {
              "_tag": "Identifier",
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
              "text": "A",
            },
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
            "typeArguments": [],
          },
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
              "column": 7,
              "line": 1,
              "position": 7,
            },
          },
          "typeParameters": [
            TypeParameter {
              "_tag": "TypeParameter",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
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
                    "column": 25,
                    "line": 1,
                    "position": 25,
                  },
                },
                "text": "A",
              },
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
                  "column": 25,
                  "line": 1,
                  "position": 25,
                },
              },
              "variance": undefined,
            },
          ],
        },
      ]
    `);
  });

  it("parses variable declarations", () => {
    const fileName = "test.typed";
    const source = `export const a: Number = 1`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        VariableDeclaration {
          "_tag": "VariableDeclaration",
          "equals": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 1,
              "position": 24,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 1,
              "position": 23,
            },
          },
          "exported": Span {
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
          "expression": NumberLiteral {
            "_tag": "NumberLiteral",
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
                "column": 25,
                "line": 1,
                "position": 25,
              },
            },
            "value": 1,
          },
          "keyword": [
            "ConstKeyword",
            Span {
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
          ],
          "name": Identifier {
            "_tag": "Identifier",
            "span": Span {
              "_tag": "Span",
              "end": SpanLocation {
                "_tag": "SpanLocation",
                "column": 14,
                "line": 1,
                "position": 14,
              },
              "start": SpanLocation {
                "_tag": "SpanLocation",
                "column": 13,
                "line": 1,
                "position": 13,
              },
            },
            "text": "a",
          },
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
              "column": 0,
              "line": 1,
              "position": 0,
            },
          },
          "typeAnnotation": NumberType {
            "_tag": "NumberType",
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
                "column": 16,
                "line": 1,
                "position": 16,
              },
            },
          },
        },
      ]
    `);
  });

  it("parses typeclass declarations", () => {
    const fileName = "test.typed";
    const source = `export typeclass Eq<A> {}`;
    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        TypeClassDeclaration {
          "_tag": "TypeClassDeclaration",
          "closeBrace": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 1,
              "position": 25,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 1,
              "position": 24,
            },
          },
          "exported": Span {
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
          "fields": [],
          "name": Identifier {
            "_tag": "Identifier",
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
                "column": 17,
                "line": 1,
                "position": 17,
              },
            },
            "text": "Eq",
          },
          "openBrace": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 24,
              "line": 1,
              "position": 24,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 23,
              "line": 1,
              "position": 23,
            },
          },
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 25,
              "line": 1,
              "position": 25,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 1,
              "position": 0,
            },
          },
          "typeParameters": [
            TypeParameter {
              "_tag": "TypeParameter",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
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
                "text": "A",
              },
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
              "variance": undefined,
            },
          ],
        },
      ]
    `);
  });

  it("parses typeclass declaration with higher-kinded types", () => {
    const fileName = "test.typed";
    const source = `typeclass Covariant<F<_>> {
  map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
}`;

    const sourceFile = parse(fileName, source);

    expect(sourceFile.statements).toEqual([
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

    expect(sourceFile.statements).toMatchInlineSnapshot(`
      [
        TypeClassDeclaration {
          "_tag": "TypeClassDeclaration",
          "closeBrace": Span {
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
          "exported": Span {
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
          "fields": [
            NamedField {
              "_tag": "NamedField",
              "name": Identifier {
                "_tag": "Identifier",
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
                  "column": 2,
                  "line": 2,
                  "position": 37,
                },
              },
              "value": FunctionType {
                "_tag": "FunctionType",
                "parameters": [
                  NamedField {
                    "_tag": "NamedField",
                    "name": Identifier {
                      "_tag": "Identifier",
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
                        "column": 14,
                        "line": 2,
                        "position": 49,
                      },
                    },
                    "value": TypeReference {
                      "_tag": "TypeReference",
                      "name": Identifier {
                        "_tag": "Identifier",
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
                          "column": 18,
                          "line": 2,
                          "position": 53,
                        },
                      },
                      "typeArguments": [
                        TypeReference {
                          "_tag": "TypeReference",
                          "name": Identifier {
                            "_tag": "Identifier",
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
                          "typeArguments": [],
                        },
                      ],
                    },
                  },
                  NamedField {
                    "_tag": "NamedField",
                    "name": Identifier {
                      "_tag": "Identifier",
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
                        "column": 24,
                        "line": 2,
                        "position": 59,
                      },
                    },
                    "value": FunctionType {
                      "_tag": "FunctionType",
                      "parameters": [
                        NamedField {
                          "_tag": "NamedField",
                          "name": Identifier {
                            "_tag": "Identifier",
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
                              "column": 28,
                              "line": 2,
                              "position": 63,
                            },
                          },
                          "value": TypeReference {
                            "_tag": "TypeReference",
                            "name": Identifier {
                              "_tag": "Identifier",
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
                            "typeArguments": [],
                          },
                        },
                      ],
                      "returnType": TypeReference {
                        "_tag": "TypeReference",
                        "name": Identifier {
                          "_tag": "Identifier",
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
                        "typeArguments": [],
                      },
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
                          "column": 27,
                          "line": 2,
                          "position": 62,
                        },
                      },
                      "typeParameters": [],
                    },
                  },
                ],
                "returnType": TypeReference {
                  "_tag": "TypeReference",
                  "name": Identifier {
                    "_tag": "Identifier",
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
                      "column": 43,
                      "line": 2,
                      "position": 78,
                    },
                  },
                  "typeArguments": [
                    TypeReference {
                      "_tag": "TypeReference",
                      "name": Identifier {
                        "_tag": "Identifier",
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
                      "typeArguments": [],
                    },
                  ],
                },
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
                    "column": 13,
                    "line": 2,
                    "position": 48,
                  },
                },
                "typeParameters": [
                  TypeParameter {
                    "_tag": "TypeParameter",
                    "constraint": undefined,
                    "name": Identifier {
                      "_tag": "Identifier",
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
                    "variance": undefined,
                  },
                  TypeParameter {
                    "_tag": "TypeParameter",
                    "constraint": undefined,
                    "name": Identifier {
                      "_tag": "Identifier",
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
                    "variance": undefined,
                  },
                ],
              },
            },
          ],
          "name": Identifier {
            "_tag": "Identifier",
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
          "openBrace": Span {
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
              "line": 1,
              "position": 0,
            },
          },
          "typeParameters": [
            HigherKindedType {
              "_tag": "HigherKindedType",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
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
              "parameters": [
                TypeParameter {
                  "_tag": "TypeParameter",
                  "constraint": undefined,
                  "name": Identifier {
                    "_tag": "Identifier",
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
                  "variance": undefined,
                },
              ],
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
                  "column": 27,
                  "line": 1,
                  "position": 27,
                },
              },
            },
          ],
        },
        DataDeclaration {
          "_tag": "DataDeclaration",
          "constructors": [
            VoidConstructor {
              "_tag": "VoidConstructor",
              "name": Identifier {
                "_tag": "Identifier",
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 30,
                    "line": 5,
                    "position": 116,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 23,
                    "line": 5,
                    "position": 109,
                  },
                },
                "text": "Nothing",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 30,
                  "line": 5,
                  "position": 116,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 23,
                  "line": 5,
                  "position": 109,
                },
              },
            },
            TupleConstructor {
              "_tag": "TupleConstructor",
              "fields": [
                NamedField {
                  "_tag": "NamedField",
                  "name": Identifier {
                    "_tag": "Identifier",
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 43,
                        "line": 5,
                        "position": 129,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 38,
                        "line": 5,
                        "position": 124,
                      },
                    },
                    "text": "value",
                  },
                  "span": Span {
                    "_tag": "Span",
                    "end": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 46,
                      "line": 5,
                      "position": 132,
                    },
                    "start": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 38,
                      "line": 5,
                      "position": 124,
                    },
                  },
                  "value": TypeReference {
                    "_tag": "TypeReference",
                    "name": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 46,
                          "line": 5,
                          "position": 132,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 45,
                          "line": 5,
                          "position": 131,
                        },
                      },
                      "text": "A",
                    },
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 46,
                        "line": 5,
                        "position": 132,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 45,
                        "line": 5,
                        "position": 131,
                      },
                    },
                    "typeArguments": [],
                  },
                },
              ],
              "name": Identifier {
                "_tag": "Identifier",
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 37,
                    "line": 5,
                    "position": 123,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 33,
                    "line": 5,
                    "position": 119,
                  },
                },
                "text": "Just",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 47,
                  "line": 5,
                  "position": 133,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 33,
                  "line": 5,
                  "position": 119,
                },
              },
            },
          ],
          "equals": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 22,
              "line": 5,
              "position": 108,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 21,
              "line": 5,
              "position": 107,
            },
          },
          "exported": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 5,
              "position": 92,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 5,
              "position": 86,
            },
          },
          "name": Identifier {
            "_tag": "Identifier",
            "span": Span {
              "_tag": "Span",
              "end": SpanLocation {
                "_tag": "SpanLocation",
                "column": 17,
                "line": 5,
                "position": 103,
              },
              "start": SpanLocation {
                "_tag": "SpanLocation",
                "column": 12,
                "line": 5,
                "position": 98,
              },
            },
            "text": "Maybe",
          },
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 47,
              "line": 5,
              "position": 133,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 5,
              "position": 86,
            },
          },
          "typeParameters": [
            TypeParameter {
              "_tag": "TypeParameter",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 19,
                    "line": 5,
                    "position": 105,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 18,
                    "line": 5,
                    "position": 104,
                  },
                },
                "text": "A",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 19,
                  "line": 5,
                  "position": 105,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 18,
                  "line": 5,
                  "position": 104,
                },
              },
              "variance": undefined,
            },
          ],
        },
        InstanceDeclaration {
          "_tag": "InstanceDeclaration",
          "closeBrace": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 1,
              "line": 10,
              "position": 309,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 10,
              "position": 308,
            },
          },
          "exported": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 6,
              "line": 7,
              "position": 141,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 7,
              "position": 135,
            },
          },
          "fields": [
            InstanceField {
              "_tag": "InstanceField",
              "expression": FunctionExpression {
                "_tag": "FunctionExpression",
                "block": FunctionCall {
                  "_tag": "FunctionCall",
                  "callee": MemberExpression {
                    "_tag": "MemberExpression",
                    "dot": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 10,
                        "line": 9,
                        "position": 237,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 9,
                        "line": 9,
                        "position": 236,
                      },
                    },
                    "object": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 9,
                          "line": 9,
                          "position": 236,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 4,
                          "line": 9,
                          "position": 231,
                        },
                      },
                      "text": "Maybe",
                    },
                    "property": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 15,
                          "line": 9,
                          "position": 242,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 10,
                          "line": 9,
                          "position": 237,
                        },
                      },
                      "text": "match",
                    },
                    "questionMark": null,
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 15,
                        "line": 9,
                        "position": 242,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 4,
                        "line": 9,
                        "position": 231,
                      },
                    },
                  },
                  "parameters": [
                    Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 18,
                          "line": 9,
                          "position": 245,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 16,
                          "line": 9,
                          "position": 243,
                        },
                      },
                      "text": "fa",
                    },
                    RecordLiteral {
                      "_tag": "RecordLiteral",
                      "fields": [
                        RecordField {
                          "_tag": "RecordField",
                          "name": Identifier {
                            "_tag": "Identifier",
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 29,
                                "line": 9,
                                "position": 256,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 22,
                                "line": 9,
                                "position": 249,
                              },
                            },
                            "text": "Nothing",
                          },
                          "span": Span {
                            "_tag": "Span",
                            "end": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 44,
                              "line": 9,
                              "position": 271,
                            },
                            "start": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 22,
                              "line": 9,
                              "position": 249,
                            },
                          },
                          "value": FunctionExpression {
                            "_tag": "FunctionExpression",
                            "block": Identifier {
                              "_tag": "Identifier",
                              "span": Span {
                                "_tag": "Span",
                                "end": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 44,
                                  "line": 9,
                                  "position": 271,
                                },
                                "start": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 37,
                                  "line": 9,
                                  "position": 264,
                                },
                              },
                              "text": "Nothing",
                            },
                            "name": null,
                            "parameters": [],
                            "returnType": null,
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 44,
                                "line": 9,
                                "position": 271,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 31,
                                "line": 9,
                                "position": 258,
                              },
                            },
                            "typeParameters": [],
                          },
                        },
                        RecordField {
                          "_tag": "RecordField",
                          "name": Identifier {
                            "_tag": "Identifier",
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 50,
                                "line": 9,
                                "position": 277,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 46,
                                "line": 9,
                                "position": 273,
                              },
                            },
                            "text": "Just",
                          },
                          "span": Span {
                            "_tag": "Span",
                            "end": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 77,
                              "line": 9,
                              "position": 304,
                            },
                            "start": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 46,
                              "line": 9,
                              "position": 273,
                            },
                          },
                          "value": FunctionExpression {
                            "_tag": "FunctionExpression",
                            "block": FunctionCall {
                              "_tag": "FunctionCall",
                              "callee": Identifier {
                                "_tag": "Identifier",
                                "span": Span {
                                  "_tag": "Span",
                                  "end": SpanLocation {
                                    "_tag": "SpanLocation",
                                    "column": 67,
                                    "line": 9,
                                    "position": 294,
                                  },
                                  "start": SpanLocation {
                                    "_tag": "SpanLocation",
                                    "column": 63,
                                    "line": 9,
                                    "position": 290,
                                  },
                                },
                                "text": "Just",
                              },
                              "parameters": [
                                FunctionCall {
                                  "_tag": "FunctionCall",
                                  "callee": Identifier {
                                    "_tag": "Identifier",
                                    "span": Span {
                                      "_tag": "Span",
                                      "end": SpanLocation {
                                        "_tag": "SpanLocation",
                                        "column": 69,
                                        "line": 9,
                                        "position": 296,
                                      },
                                      "start": SpanLocation {
                                        "_tag": "SpanLocation",
                                        "column": 68,
                                        "line": 9,
                                        "position": 295,
                                      },
                                    },
                                    "text": "f",
                                  },
                                  "parameters": [
                                    Identifier {
                                      "_tag": "Identifier",
                                      "span": Span {
                                        "_tag": "Span",
                                        "end": SpanLocation {
                                          "_tag": "SpanLocation",
                                          "column": 75,
                                          "line": 9,
                                          "position": 302,
                                        },
                                        "start": SpanLocation {
                                          "_tag": "SpanLocation",
                                          "column": 70,
                                          "line": 9,
                                          "position": 297,
                                        },
                                      },
                                      "text": "value",
                                    },
                                  ],
                                  "span": Span {
                                    "_tag": "Span",
                                    "end": SpanLocation {
                                      "_tag": "SpanLocation",
                                      "column": 76,
                                      "line": 9,
                                      "position": 303,
                                    },
                                    "start": SpanLocation {
                                      "_tag": "SpanLocation",
                                      "column": 68,
                                      "line": 9,
                                      "position": 295,
                                    },
                                  },
                                  "typeArguments": [],
                                },
                              ],
                              "span": Span {
                                "_tag": "Span",
                                "end": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 77,
                                  "line": 9,
                                  "position": 304,
                                },
                                "start": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 63,
                                  "line": 9,
                                  "position": 290,
                                },
                              },
                              "typeArguments": [],
                            },
                            "name": null,
                            "parameters": [
                              NamedField {
                                "_tag": "NamedField",
                                "name": Identifier {
                                  "_tag": "Identifier",
                                  "span": Span {
                                    "_tag": "Span",
                                    "end": SpanLocation {
                                      "_tag": "SpanLocation",
                                      "column": 58,
                                      "line": 9,
                                      "position": 285,
                                    },
                                    "start": SpanLocation {
                                      "_tag": "SpanLocation",
                                      "column": 53,
                                      "line": 9,
                                      "position": 280,
                                    },
                                  },
                                  "text": "value",
                                },
                                "span": Span {
                                  "_tag": "Span",
                                  "end": SpanLocation {
                                    "_tag": "SpanLocation",
                                    "column": 58,
                                    "line": 9,
                                    "position": 285,
                                  },
                                  "start": SpanLocation {
                                    "_tag": "SpanLocation",
                                    "column": 53,
                                    "line": 9,
                                    "position": 280,
                                  },
                                },
                                "value": undefined,
                              },
                            ],
                            "returnType": null,
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 77,
                                "line": 9,
                                "position": 304,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 52,
                                "line": 9,
                                "position": 279,
                              },
                            },
                            "typeParameters": [],
                          },
                        },
                      ],
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 79,
                          "line": 9,
                          "position": 306,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 20,
                          "line": 9,
                          "position": 247,
                        },
                      },
                    },
                  ],
                  "span": Span {
                    "_tag": "Span",
                    "end": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 80,
                      "line": 9,
                      "position": 307,
                    },
                    "start": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 4,
                      "line": 9,
                      "position": 231,
                    },
                  },
                  "typeArguments": [],
                },
                "name": null,
                "parameters": [
                  NamedField {
                    "_tag": "NamedField",
                    "name": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 16,
                          "line": 8,
                          "position": 186,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 14,
                          "line": 8,
                          "position": 184,
                        },
                      },
                      "text": "fa",
                    },
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 25,
                        "line": 8,
                        "position": 195,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 14,
                        "line": 8,
                        "position": 184,
                      },
                    },
                    "value": TypeReference {
                      "_tag": "TypeReference",
                      "name": Identifier {
                        "_tag": "Identifier",
                        "span": Span {
                          "_tag": "Span",
                          "end": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 23,
                            "line": 8,
                            "position": 193,
                          },
                          "start": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 18,
                            "line": 8,
                            "position": 188,
                          },
                        },
                        "text": "Maybe",
                      },
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 25,
                          "line": 8,
                          "position": 195,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 18,
                          "line": 8,
                          "position": 188,
                        },
                      },
                      "typeArguments": [
                        TypeReference {
                          "_tag": "TypeReference",
                          "name": Identifier {
                            "_tag": "Identifier",
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 25,
                                "line": 8,
                                "position": 195,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 24,
                                "line": 8,
                                "position": 194,
                              },
                            },
                            "text": "A",
                          },
                          "span": Span {
                            "_tag": "Span",
                            "end": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 25,
                              "line": 8,
                              "position": 195,
                            },
                            "start": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 24,
                              "line": 8,
                              "position": 194,
                            },
                          },
                          "typeArguments": [],
                        },
                      ],
                    },
                  },
                  NamedField {
                    "_tag": "NamedField",
                    "name": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 29,
                          "line": 8,
                          "position": 199,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 28,
                          "line": 8,
                          "position": 198,
                        },
                      },
                      "text": "f",
                    },
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 42,
                        "line": 8,
                        "position": 212,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 28,
                        "line": 8,
                        "position": 198,
                      },
                    },
                    "value": FunctionType {
                      "_tag": "FunctionType",
                      "parameters": [
                        NamedField {
                          "_tag": "NamedField",
                          "name": Identifier {
                            "_tag": "Identifier",
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 33,
                                "line": 8,
                                "position": 203,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 32,
                                "line": 8,
                                "position": 202,
                              },
                            },
                            "text": "a",
                          },
                          "span": Span {
                            "_tag": "Span",
                            "end": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 36,
                              "line": 8,
                              "position": 206,
                            },
                            "start": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 32,
                              "line": 8,
                              "position": 202,
                            },
                          },
                          "value": TypeReference {
                            "_tag": "TypeReference",
                            "name": Identifier {
                              "_tag": "Identifier",
                              "span": Span {
                                "_tag": "Span",
                                "end": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 36,
                                  "line": 8,
                                  "position": 206,
                                },
                                "start": SpanLocation {
                                  "_tag": "SpanLocation",
                                  "column": 35,
                                  "line": 8,
                                  "position": 205,
                                },
                              },
                              "text": "A",
                            },
                            "span": Span {
                              "_tag": "Span",
                              "end": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 36,
                                "line": 8,
                                "position": 206,
                              },
                              "start": SpanLocation {
                                "_tag": "SpanLocation",
                                "column": 35,
                                "line": 8,
                                "position": 205,
                              },
                            },
                            "typeArguments": [],
                          },
                        },
                      ],
                      "returnType": TypeReference {
                        "_tag": "TypeReference",
                        "name": Identifier {
                          "_tag": "Identifier",
                          "span": Span {
                            "_tag": "Span",
                            "end": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 42,
                              "line": 8,
                              "position": 212,
                            },
                            "start": SpanLocation {
                              "_tag": "SpanLocation",
                              "column": 41,
                              "line": 8,
                              "position": 211,
                            },
                          },
                          "text": "B",
                        },
                        "span": Span {
                          "_tag": "Span",
                          "end": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 42,
                            "line": 8,
                            "position": 212,
                          },
                          "start": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 41,
                            "line": 8,
                            "position": 211,
                          },
                        },
                        "typeArguments": [],
                      },
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 42,
                          "line": 8,
                          "position": 212,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 31,
                          "line": 8,
                          "position": 201,
                        },
                      },
                      "typeParameters": [],
                    },
                  },
                ],
                "returnType": TypeReference {
                  "_tag": "TypeReference",
                  "name": Identifier {
                    "_tag": "Identifier",
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 50,
                        "line": 8,
                        "position": 220,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 45,
                        "line": 8,
                        "position": 215,
                      },
                    },
                    "text": "Maybe",
                  },
                  "span": Span {
                    "_tag": "Span",
                    "end": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 52,
                      "line": 8,
                      "position": 222,
                    },
                    "start": SpanLocation {
                      "_tag": "SpanLocation",
                      "column": 45,
                      "line": 8,
                      "position": 215,
                    },
                  },
                  "typeArguments": [
                    TypeReference {
                      "_tag": "TypeReference",
                      "name": Identifier {
                        "_tag": "Identifier",
                        "span": Span {
                          "_tag": "Span",
                          "end": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 52,
                            "line": 8,
                            "position": 222,
                          },
                          "start": SpanLocation {
                            "_tag": "SpanLocation",
                            "column": 51,
                            "line": 8,
                            "position": 221,
                          },
                        },
                        "text": "B",
                      },
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 52,
                          "line": 8,
                          "position": 222,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 51,
                          "line": 8,
                          "position": 221,
                        },
                      },
                      "typeArguments": [],
                    },
                  ],
                },
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 80,
                    "line": 9,
                    "position": 307,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 8,
                    "line": 8,
                    "position": 178,
                  },
                },
                "typeParameters": [
                  TypeParameter {
                    "_tag": "TypeParameter",
                    "constraint": undefined,
                    "name": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 9,
                          "line": 8,
                          "position": 179,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 8,
                          "line": 8,
                          "position": 178,
                        },
                      },
                      "text": "A",
                    },
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 9,
                        "line": 8,
                        "position": 179,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 8,
                        "line": 8,
                        "position": 178,
                      },
                    },
                    "variance": undefined,
                  },
                  TypeParameter {
                    "_tag": "TypeParameter",
                    "constraint": undefined,
                    "name": Identifier {
                      "_tag": "Identifier",
                      "span": Span {
                        "_tag": "Span",
                        "end": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 12,
                          "line": 8,
                          "position": 182,
                        },
                        "start": SpanLocation {
                          "_tag": "SpanLocation",
                          "column": 11,
                          "line": 8,
                          "position": 181,
                        },
                      },
                      "text": "B",
                    },
                    "span": Span {
                      "_tag": "Span",
                      "end": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 12,
                        "line": 8,
                        "position": 182,
                      },
                      "start": SpanLocation {
                        "_tag": "SpanLocation",
                        "column": 11,
                        "line": 8,
                        "position": 181,
                      },
                    },
                    "variance": undefined,
                  },
                ],
              },
              "name": Identifier {
                "_tag": "Identifier",
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 5,
                    "line": 8,
                    "position": 175,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 2,
                    "line": 8,
                    "position": 172,
                  },
                },
                "text": "map",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 80,
                  "line": 9,
                  "position": 307,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 2,
                  "line": 8,
                  "position": 172,
                },
              },
            },
          ],
          "name": Identifier {
            "_tag": "Identifier",
            "span": Span {
              "_tag": "Span",
              "end": SpanLocation {
                "_tag": "SpanLocation",
                "column": 25,
                "line": 7,
                "position": 160,
              },
              "start": SpanLocation {
                "_tag": "SpanLocation",
                "column": 16,
                "line": 7,
                "position": 151,
              },
            },
            "text": "Covariant",
          },
          "openBrace": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 34,
              "line": 7,
              "position": 169,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 33,
              "line": 7,
              "position": 168,
            },
          },
          "span": Span {
            "_tag": "Span",
            "end": SpanLocation {
              "_tag": "SpanLocation",
              "column": 1,
              "line": 10,
              "position": 309,
            },
            "start": SpanLocation {
              "_tag": "SpanLocation",
              "column": 0,
              "line": 7,
              "position": 135,
            },
          },
          "typeParameters": [
            TypeParameter {
              "_tag": "TypeParameter",
              "constraint": undefined,
              "name": Identifier {
                "_tag": "Identifier",
                "span": Span {
                  "_tag": "Span",
                  "end": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 31,
                    "line": 7,
                    "position": 166,
                  },
                  "start": SpanLocation {
                    "_tag": "SpanLocation",
                    "column": 26,
                    "line": 7,
                    "position": 161,
                  },
                },
                "text": "Maybe",
              },
              "span": Span {
                "_tag": "Span",
                "end": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 31,
                  "line": 7,
                  "position": 166,
                },
                "start": SpanLocation {
                  "_tag": "SpanLocation",
                  "column": 26,
                  "line": 7,
                  "position": 161,
                },
              },
              "variance": undefined,
            },
          ],
        },
      ]
    `);
  });
});
