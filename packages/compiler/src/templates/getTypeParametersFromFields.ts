import {
  Field,
  Identifier,
  TypeParameter,
  TypeReference,
} from "@typed-lang/parser";
import { getTypeReferencesFromType } from "./getTypeReferencesFromType.js";

export function getTypeParametersFromFields(fields: ReadonlyArray<Field>) {
  const typeParameters: TypeReference[] = [];

  for (const field of fields) {
    if (field.value === undefined) {
      if (field._tag === "NamedField") {
        typeParameters.push(
          new TypeReference(
            field.name,
            [],
            field.span
          )
        );
      } else {
        typeParameters.push(
          new TypeReference(
            new Identifier(`arg${String(field.index)}`, field.span),
            [],
            field.span
          )
        );
      }
    } else {
      typeParameters.push(...getTypeReferencesFromType(field.value));
    }
  }

  return typeParameters.map(
    (t) => new TypeParameter(t.name as Identifier, undefined, t.span)
  );
}
