import { BrandDeclaration } from "./Declaration/BrandDeclaration.js";
import { DataDeclaration } from "./Declaration/DataDeclaration.js";
import { FunctionDeclaration } from "./Declaration/FunctionDeclaration.js";
import { TypeAliasDeclaration } from "./Declaration/TypeAliasDeclaration.js";
import { VariableDeclaration } from "./Declaration/VariableDeclaration.js";

export type Statement =
  | BrandDeclaration
  | DataDeclaration
  | FunctionDeclaration
  | TypeAliasDeclaration
  | VariableDeclaration