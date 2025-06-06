import { TypeParameter, HigherKindedType, Identifier } from "@typed-lang/parser";
import { HktsByName } from "./typeTemplate";

export const unwrapHkt = (
  t: TypeParameter | HigherKindedType,
  hktsByName?: HktsByName
): ReadonlyArray<TypeParameter> => {
  if (!hktsByName) return t._tag === "HigherKindedType" ? t.parameters.flatMap(_ => unwrapHkt(_)) : [t];
  if (t._tag === 'TypeParameter') return [t]
  const { params } = hktsByName.get(t.name.text)!
  const length = params.length
  const name = `Kind${length === 1 ? '' : String(length)}<${t.name.text}>`

  return [
    new TypeParameter(new Identifier(name, t.span), undefined, t.span)
  ]
};
