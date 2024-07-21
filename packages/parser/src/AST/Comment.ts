import { Span } from "../Span.js";

export class Comment {
  readonly _tag = "Comment";

  constructor(readonly text: string, readonly span: Span) {}
}
