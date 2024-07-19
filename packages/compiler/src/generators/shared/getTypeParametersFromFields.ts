import { Field, TypeParameter, TypeReference } from "@typed-lang/parser";
import { getTypeReferencesFromType } from "./getTypeReferencesFromType.js";

export function getTypeParametersFromFields(fields: ReadonlyArray<Field>) {
  const typeParameters: TypeReference[] = [];

  for (const field of fields) {
    typeParameters.push(...getTypeReferencesFromType(field.type));
  }

  return typeParameters.map((t) => new TypeParameter(t.name, t.span));
}
