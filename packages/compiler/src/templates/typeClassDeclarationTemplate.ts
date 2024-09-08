import { TypeClassDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";

export function typeClassDeclarationTemplate(
  decl: TypeClassDeclaration
): Interpolation {
  return t`${
    decl.exported ? t.span(decl.exported)(`export`) : ""
  }interface ${t.identifier(decl.name)}${typeParametersTemplate(
    decl.typeParameters.flatMap(unwrapHkt),
    {
      parameterVariance: true,
      functionDefaultValue: false,
      constants: false,
    }
  )} {}`;
}
