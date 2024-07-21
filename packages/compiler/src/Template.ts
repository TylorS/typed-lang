import { Identifier, Span } from "@typed-lang/parser";
import { ident } from "./utils";

export interface Template {
  readonly _tag: "Template";
  readonly template: TemplateStringsArray;
  readonly values: ReadonlyArray<Interpolation>;
}

export type Interpolation =
  | string
  | Template
  | WithSpan
  | WithIdent
  | NewLine
  | ReadonlyArray<Interpolation>;

export interface WithSpan {
  readonly _tag: "WithSpan";
  readonly span: Span;
  readonly name?: string;
  readonly content?: string;

  readonly value: Interpolation;
}

export interface NewLine {
  readonly _tag: "NewLine";
  readonly lines: number;
}

export interface WithIdent {
  readonly _tag: "WithIdent";
  readonly value: Interpolation;
}

export function t(
  template: TemplateStringsArray,
  ...values: ReadonlyArray<Interpolation>
): Interpolation {
  return { _tag: "Template", template, values };
}

t.span =
  (span: Span, name?: string, content?: string) =>
  (...value: ReadonlyArray<Interpolation>): Interpolation => ({
    _tag: "WithSpan",
    span,
    name,
    content,
    value: value.flat(10),
  });

t.identifier = (identifer: Identifier) =>
  t.span(identifer.span, identifer.text)(identifer.text);

t.ident = (...value: ReadonlyArray<Interpolation>): Interpolation => ({
  _tag: "WithIdent",
  value: value.flat(10),
});

t.interpolate =
  (seperator: Interpolation) =>
  (...values: ReadonlyArray<Interpolation>): Interpolation =>
    values
      .flat(10)
      .flatMap((value, i) => (i === 0 ? [value] : [seperator, value]));

t.newLine = (lines: number = 1): NewLine => ({ _tag: "NewLine", lines });

export function templateToString(interpolation: Interpolation): string {
  if (typeof interpolation === "string") {
    return interpolation;
  }

  if (Array.isArray(interpolation)) {
    return interpolation.map(templateToString).join("");
  }

  const i = interpolation as Exclude<
    Interpolation,
    string | ReadonlyArray<Interpolation>
  >;

  switch (i._tag) {
    case "Template": {
      let result = "";
      for (let j = 0; j < i.values.length; j++) {
        result += i.template[j] + templateToString(i.values[j]);
      }
      return result + i.template[i.template.length - 1];
    }
    case "WithSpan":
      return templateToString(i.value);
    case "WithIdent":
      return ident(templateToString(i.value));
    case "NewLine":
      return "\n".repeat(i.lines);
  }
}
