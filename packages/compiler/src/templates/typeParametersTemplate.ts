import { TypeParameter } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";

export type TypeParametersTemplateParams = {
  readonly constants: boolean;
  readonly parameterVariance: boolean;
  readonly functionDefaultValue: boolean;
};

export function typeParametersTemplate(
  typeParameters: ReadonlyArray<TypeParameter>,
  params: TypeParametersTemplateParams
): Interpolation {
  if (typeParameters.length === 0) {
    return "";
  }
  return t`<${t.intercolate(", ")(
    typeParameters.map((typeParam) => typeParameterTemplate(typeParam, params))
  )}>`;
}

export function typeParameterTemplate(
  typeParameter: TypeParameter,
  params: TypeParametersTemplateParams
): Interpolation {
  if (params.functionDefaultValue && typeParameter.constraint) {
    return t.span(typeParameter.span)(
      params.parameterVariance && typeParameter.variance
        ? `${typeParameter.variance} `
        : params.constants
        ? "const "
        : "",
      t.identifier(typeParameter.name),
      "extends ",
      typeTemplate(typeParameter.constraint),
      varianceFunctionDefaultValue(typeParameter.variance)
    );
  }

  return t.span(typeParameter.span)(
    params.parameterVariance && typeParameter.variance
      ? `${typeParameter.variance} `
      : params.constants
      ? "const "
      : "",
    t.identifier(typeParameter.name),
    params.functionDefaultValue
      ? varianceFunctionDefaultValue(typeParameter.variance)
      : ""
  );
}

function varianceFunctionDefaultValue(
  variance: "in" | "out" | "in out" | undefined
): string {
  if (variance === "out") return " = never";
  return "";
}
