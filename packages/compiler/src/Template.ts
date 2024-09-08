import { Identifier, Span } from "@typed-lang/parser";
import { indent } from "./utils";
import { NamespaceImport, ImportManager, NamedImport } from "./ImportManager";

export interface Template {
  readonly _tag: "Template";
  readonly template: TemplateStringsArray;
  readonly values: ReadonlyArray<Interpolation>;
}

export type Interpolation =
  | string
  | Template
  | WithSpan
  | WithIndent
  | NewLine
  | DeclareImport
  | Import
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

export interface WithIndent {
  readonly _tag: "WithIndent";
  readonly value: Interpolation;
}

export interface DeclareImport {
  readonly _tag: "DeclareImport";
  readonly imports: NamedImport | NamespaceImport;
  readonly moduleSpecifier: string;
}

export interface Import {
  readonly _tag: "Import";
  readonly moduleSpecifier: string;
  readonly name: string;

  readonly asNamedImport: () => DeclareImport;
  readonly asNamespaceImport: (namespace: string) => DeclareImport;
}

export function t(
  template: TemplateStringsArray,
  ...values: ReadonlyArray<Interpolation>
): Interpolation {
  return { _tag: "Template", template, values };
}

const fakeTemplateArray = (length: number): TemplateStringsArray => {
  const raw = Array.from({ length }, () => "");
  return Object.assign(raw, { raw });
};

t.many = (...values: ReadonlyArray<Interpolation>): Interpolation => {
  return t(
    fakeTemplateArray(values.length + 1),
    ...values
  );
};

t.span =
  (span: Span, name?: string, content?: string) =>
  (...value: ReadonlyArray<Interpolation>): Interpolation => ({
    _tag: "WithSpan",
    span,
    name,
    content,
    value: value.flat(),
  });

t.identifier = (identifer: Identifier) =>
  t.span(identifer.span, identifer.text)(identifer.text);

t.indent = (...value: ReadonlyArray<Interpolation>): Interpolation => ({
  _tag: "WithIndent",
  value: value.flat(),
});

t.intercolate =
  (seperator: Interpolation) =>
  (...values: ReadonlyArray<Interpolation>): Interpolation =>
    values
      .flat()
      .flatMap((value, i) => (i === 0 ? [value] : [seperator, value]));

t.newLine = (lines: number = 1): NewLine => ({ _tag: "NewLine", lines });

t.namedImport = (
  moduleSpecifier: string,
  name: string,
  alias?: string
): DeclareImport => ({
  _tag: "DeclareImport",
  imports: new NamedImport(name, alias),
  moduleSpecifier,
});

t.namespaceImport = (
  moduleSpecifier: string,
  namespace: string
): DeclareImport => ({
  _tag: "DeclareImport",
  imports: new NamespaceImport(namespace),
  moduleSpecifier,
});

t.import = (moduleSpecifier: string, name: string): Import => ({
  _tag: "Import",
  moduleSpecifier,
  name,
  asNamedImport: () => t.namedImport(moduleSpecifier, name),
  asNamespaceImport: (namespace: string) =>
    t.namespaceImport(moduleSpecifier, namespace),
});

export function templateToString(interpolation: Interpolation): string {
  const imports = new ImportManager();

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
    case "WithIndent":
      return indent(templateToString(i.value));
    case "NewLine":
      return "\n".repeat(i.lines);
    case "DeclareImport": {
      switch (i.imports._tag) {
        case "NamedImport":
          imports.addNamedImport(
            i.moduleSpecifier,
            i.imports.name,
            i.imports.alias
          );
          break;
        case "NamespaceImport":
          imports.addNamespaceImport(i.moduleSpecifier, i.imports.namespace);
          break;
      }

      return "";
    }
    case "Import": {
      return imports.identifer(i.moduleSpecifier, i.name);
    }
  }
}
