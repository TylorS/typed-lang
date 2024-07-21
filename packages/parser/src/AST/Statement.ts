import { Comment } from "./Comment.js";
import { ControlFlow } from "./ControlFlow.js";
import { FunctionDeclaration, VariableDeclaration } from "./Declaration.js";

export type Statement =
  | FunctionDeclaration
  | VariableDeclaration
  | ControlFlow
  | Comment;
