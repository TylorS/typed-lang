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
    typeParameters.push(...getTypeReferencesFromType(field.value));
  }

  return typeParameters.map(
    (t) => new TypeParameter(t.name as Identifier, undefined, t.span)
  );
}
