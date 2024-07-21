import { Comment } from "./Comment.js";
import { BrandDeclaration } from "./Declaration/BrandDeclaration.js";
import { DataDeclaration } from "./Declaration/DataDeclaration.js";
import { FunctionDeclaration } from "./Declaration/FunctionDeclaration.js";
import { ImportDeclaration } from "./Declaration/ImportDeclaration.js";
import { TypeAliasDeclaration } from "./Declaration/TypeAliasDeclaration.js";
import { TypeClassDeclaration } from "./Declaration/TypeClassDeclaration.js";
import { VariableDeclaration } from "./Declaration/VariableDeclaration.js";

export type Declaration =
  | BrandDeclaration
  | DataDeclaration
  | FunctionDeclaration
  | ImportDeclaration
  | TypeAliasDeclaration
  | TypeClassDeclaration
  | VariableDeclaration
  | Comment;

export * from "./Declaration/BrandDeclaration.js";
export * from "./Declaration/DataDeclaration.js";
export * from "./Declaration/FunctionDeclaration.js";
export * from "./Declaration/ImportDeclaration.js";
export * from "./Declaration/TypeAliasDeclaration.js";
export * from "./Declaration/TypeClassDeclaration.js";
export * from "./Declaration/VariableDeclaration.js";
