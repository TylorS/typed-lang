import { Type, TypeReference } from "@typed-lang/parser";

export function getTypeReferencesFromType(type: Type): TypeReference[] {
  switch (type._tag) {
    case "TypeReference":
      return [type];
    case "TupleType":
      return type.members.flatMap((f) => getTypeReferencesFromType(f));
    case "RecordType":
      return type.fields.flatMap((f) => getTypeReferencesFromType(f.value));
    case "ArrayType":
      return getTypeReferencesFromType(type.element);
    case "SetType":
      return getTypeReferencesFromType(type.value);
    case "MapType":
      return [
        ...getTypeReferencesFromType(type.key),
        ...getTypeReferencesFromType(type.value),
      ];
    case "FunctionType":
      return [
        ...type.parameters.flatMap((p) => getTypeReferencesFromType(p.value)),
        ...getTypeReferencesFromType(type.returnType),
      ];
    // TODO:
    case "HigherKindedType":
    default:
      return [];
  }
}
