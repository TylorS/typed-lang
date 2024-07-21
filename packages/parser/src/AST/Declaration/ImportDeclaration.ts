import { Span } from "../../Span.js";
import { Identifier } from "../Nodes/Identifier.js";
import { StringLiteral } from "../Nodes/Literal.js";

export class ImportDeclaration {
  readonly _tag = "ImportDeclaration";

  constructor(
    readonly imports: NamespaceImport | NamedImports,
    readonly moduleSpecifier: StringLiteral,
    readonly span: Span
  ) {}
}

export class NamespaceImport {
  readonly _tag = "NamespaceImport";

  constructor(readonly name: Identifier, readonly span: Span) {}
}

export class NamedImports {
  readonly _tag = "NamedImports";

  constructor(readonly imports: readonly ImportSpecifier[], readonly span: Span) {}
}

export class ImportSpecifier {
  readonly _tag = "ImportSpecifier";

  constructor(
    readonly name: Identifier,
    readonly alias: Identifier | null,
    readonly span: Span
  ) {}
}