import { FunctionDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { typeTemplate } from "./typeTemplate.js";
import { blockTemplate } from "./expressionTemplate.js";

export function functionDeclarationTemplate(
  decl: FunctionDeclaration
): Interpolation {
  return t.span(decl.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    `function `,
    t.identifier(decl.name),
    typeParametersTemplate(decl.typeParameters),
    t`(`,
    t.intercolate(t`, `)(
      decl.parameters.map(
        (p) => t`${t.identifier(p.name)}: ${typeTemplate(p.value)}`
      )
    ),
    t`) `,
    blockTemplate(decl.block)
  );
}
