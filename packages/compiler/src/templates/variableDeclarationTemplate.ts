import { VariableDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";
import { expressionTemplate } from "./expressionTemplate.js";
import { identifierOrDestructureTemplate } from "./identifierOrDestructureTemplate.js";

export function variableDeclarationTemplate(
  decl: VariableDeclaration
): Interpolation {
  return t.span(decl.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    t.span(decl.keyword[1])(decl.keyword[0]),
    identifierOrDestructureTemplate(decl.name),
    decl.typeAnnotation ? typeTemplate(decl.typeAnnotation) : "",
    ` `,
    t.span(decl.equals)(`=`),
    ` `,
    expressionTemplate(decl.expression)
  );
}
