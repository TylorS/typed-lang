import { TypeParameter } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";

export function typeParametersTemplate(
  typeParameters: ReadonlyArray<TypeParameter>
): Interpolation {
  if (typeParameters.length === 0) {
    return "";
  }
  return t`<${typeParameters.map(typeParameterTemplate)}>`;
}

function typeParameterTemplate(typeParameter: TypeParameter): Interpolation {
  // TODO: Support constraints
  return t.span(typeParameter.span)(typeParameter.name.text);
}
