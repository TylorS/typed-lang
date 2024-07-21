import { NamedField } from "../Nodes/Field.js";
import { Span } from "../../Span.js";

export class RecordType {
  readonly _tag = "RecordType";

  constructor(
    readonly fields: ReadonlyArray<NamedField>,
    readonly span: Span
  ) {}
}
