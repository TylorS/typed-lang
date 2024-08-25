import { TypeParameter, HigherKindedType } from "@typed-lang/parser";

export const unwrapHkt = (
  t: TypeParameter | HigherKindedType
): ReadonlyArray<TypeParameter> =>
  t._tag === "HigherKindedType" ? t.parameters.flatMap(unwrapHkt) : [t];
