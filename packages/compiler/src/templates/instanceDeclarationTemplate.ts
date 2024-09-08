import { InstanceDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { expressionTemplate } from "./expressionTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";


// TODO: We need much better support for HKTs
export function instanceDeclarationTemplate(
  decl: InstanceDeclaration
): Interpolation {
  return t`export const ${t.identifier(decl.name)}${typeParametersTemplate(
    decl.typeParameters.flatMap(unwrapHkt),
    {
      parameterVariance: false,
      functionDefaultValue: false,
    }
  )} = {
    ${t.intercolate(t`,\n  `)(
      decl.fields.map(
        (f) => t`${t.identifier(f.name)}: ${expressionTemplate(f.expression)}`
      )
    )}
  }`;
}
