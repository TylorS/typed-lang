import { Span } from "../Span.js";
import { BrandDeclaration } from "./Declaration/BrandDeclaration.js";
import { DataDeclaration } from "./Declaration/DataDeclaration.js";
import { FunctionDeclaration } from "./Declaration/FunctionDeclaration.js";
import { TypeAliasDeclaration } from "./Declaration/TypeAliasDeclaration.js";
import { VariableDeclaration } from "./Declaration/VariableDeclaration.js";
import { Expression } from "./Expression.js";

export type Statement =
  | BrandDeclaration
  | DataDeclaration
  | FunctionDeclaration
  | TypeAliasDeclaration
  | VariableDeclaration
  | ExpressionStatement
  | ReturnStatement;

export class ExpressionStatement {
  readonly _tag = "ExpressionStatement";

  constructor(readonly expression: Expression) {}
}

export class ReturnStatement {
  readonly _tag = "ReturnStatement";

  constructor(readonly keyword: Span, readonly expression: Expression) {}
}
