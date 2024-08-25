import {
  Field,
  Identifier,
  Type,
  TypeReference,
} from "@typed-lang/parser";

const fieldToTypeReference = (field: Field) => {
  if (field._tag === "NamedField") {
    return field.value === undefined
      ? new TypeReference(field.name, [], field.span)
      : getTypeReferencesFromType(field.value);
  } else {
    return [
      new TypeReference(
        new Identifier(`arg${field.index}`, field.span),
        [],
        field.span
      ),
    ];
  }
};

export function getTypeReferencesFromType(type: Type): TypeReference[] {
  switch (type._tag) {
    case "TypeReference":
      return [type];
    case "TupleType":
      return type.members.flatMap((f) => getTypeReferencesFromType(f));
    case "RecordType":
      return type.fields.flatMap(fieldToTypeReference);
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
        ...type.parameters.flatMap(fieldToTypeReference),
        ...getTypeReferencesFromType(type.returnType),
      ];
    // TODO:
    case "HigherKindedType":
    default:
      return [];
  }
}
