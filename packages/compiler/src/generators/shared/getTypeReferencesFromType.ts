import { Type, TypeReference } from "@typed-lang/parser";

export function getTypeReferencesFromType(type: Type): TypeReference[] {
  switch (type._tag) {
    case "TypeReference":
      return [type];
    case "TupleType":
      return type.fields.flatMap((f) => getTypeReferencesFromType(f.type));
    case "RecordType":
      return type.fields.flatMap((f) => getTypeReferencesFromType(f.type));
    case "ArrayType":
      return getTypeReferencesFromType(type.element);
  }
}
