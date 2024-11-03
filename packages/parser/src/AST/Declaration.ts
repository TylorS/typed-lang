import type { Comment } from "./Comment.js";
import type { BrandDeclaration } from "./Declaration/BrandDeclaration.js";
import type { DataDeclaration } from "./Declaration/DataDeclaration.js";
import type { FunctionDeclaration } from "./Declaration/FunctionDeclaration.js";
import type { ImportDeclaration } from "./Declaration/ImportDeclaration.js";
import type { InstanceDeclaration } from "./Declaration/InstanceDeclaration.js";
import type { TypeAliasDeclaration } from "./Declaration/TypeAliasDeclaration.js";
import type { TypeClassDeclaration } from "./Declaration/TypeClassDeclaration.js";
import type { VariableDeclaration } from "./Declaration/VariableDeclaration.js";

export type Declaration =
  | BrandDeclaration
  | DataDeclaration
  | FunctionDeclaration
  | ImportDeclaration
  | InstanceDeclaration
  | TypeAliasDeclaration
  | TypeClassDeclaration
  | VariableDeclaration
  | Comment;

export * from "./Declaration/BrandDeclaration.js";
export * from "./Declaration/DataDeclaration.js";
export * from "./Declaration/FunctionDeclaration.js";
export * from "./Declaration/ImportDeclaration.js";
export * from "./Declaration/InstanceDeclaration.js";
export * from "./Declaration/TypeAliasDeclaration.js";
export * from "./Declaration/TypeClassDeclaration.js";
export * from "./Declaration/VariableDeclaration.js";
