import { Span, TokenKind, VariableDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { typeTemplate } from "./typeTemplate.js";
import { expressionTemplate } from "./expressionTemplate.js";
import { identifierOrDestructureTemplate } from "./identifierOrDestructureTemplate.js";

export function variableDeclarationTemplate(
  decl: VariableDeclaration
): Interpolation {
  return t.span(decl.span)(
    decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
    t`${variableKindTemplate(decl.keyword)} `,
    identifierOrDestructureTemplate(decl.name),
    decl.typeAnnotation ? typeTemplate(decl.typeAnnotation) : "",
    ` `,
    t.span(decl.equals)(`=`),
    ` `,
    expressionTemplate(decl.expression)
  );
}

function variableKindTemplate(
  variable: readonly [
    TokenKind.ConstKeyword | TokenKind.LetKeyword | TokenKind.VarKeyword,
    Span
  ]
) {
  return t.span(variable[1])(
    variable[0] === TokenKind.ConstKeyword
      ? `const`
      : variable[0] === TokenKind.LetKeyword
      ? `let`
      : `var`
  );
}
