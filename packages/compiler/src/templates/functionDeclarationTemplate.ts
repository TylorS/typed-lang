import { FunctionDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { HktsByName, typeTemplate } from "./typeTemplate.js";
import { blockTemplate } from "./expressionTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";

// TODO: WE NEED MUCH BETTER SUPPORT FOR HKT's
export function functionDeclarationTemplate(
  decl: FunctionDeclaration,
  hktsByName?: HktsByName
): Interpolation {
  return t.span(decl.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    `function `,
    t.identifier(decl.name),
    typeParametersTemplate(decl.typeParameters.flatMap(t => unwrapHkt(t, hktsByName)), {
      parameterVariance: false,
      functionDefaultValue: false,
      constants: true,
    }),
    t`(`,
    t.intercolate(t`, `)(
      // TODO: Need to support replacing of HKTs
      decl.parameters.map(
        (p) =>
          t`${t.identifier(p.name)}: ${p.value ? typeTemplate(p.value) : t.identifier(p.name)
            }`
      )
    ),
    t`)`,
    decl.returnType ? t`${t`: ${typeTemplate(decl.returnType)}`} ` : "",
    blockTemplate(decl.block)
  );
}
