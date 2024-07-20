import { NamedField } from "../Nodes/Field.js";

export class RecordType {
  readonly _tag = "RecordType";

  constructor(readonly fields: ReadonlyArray<NamedField>) {}
}