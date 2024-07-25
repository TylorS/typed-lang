import { TypeParameter } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";

export function typeParametersTemplate(
  typeParameters: ReadonlyArray<TypeParameter>
): Interpolation {
  if (typeParameters.length === 0) {
    return "";
  }
  return t`<${t.intercolate(', ')(typeParameters.map(typeParameterTemplate))}>`;
}

function typeParameterTemplate(typeParameter: TypeParameter): Interpolation {
  if (typeParameter.constraint) {
    return t.span(typeParameter.span)(
      t.identifier(typeParameter.name),
      ": ",
      typeTemplate(typeParameter.constraint)
    );
  }

  return t.span(typeParameter.span)(t.identifier(typeParameter.name));
}
