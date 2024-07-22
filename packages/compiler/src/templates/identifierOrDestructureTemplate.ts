import { Destructure, Identifier } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";

export function identifierOrDestructureTemplate(
  idOrDestructure: Identifier | Destructure
): Interpolation {
  switch (idOrDestructure._tag) {
    case "Identifier":
      return t.identifier(idOrDestructure);
    case "RecordDestructure":
      return t`{ ${idOrDestructure.fields
        .map((f) => t.identifier(f))
        .join(", ")} }`;
    case "TupleDestructure":
      return t`[${idOrDestructure.fields
        .map((f) => t.identifier(f))
        .join(", ")}]`;
  }
}
