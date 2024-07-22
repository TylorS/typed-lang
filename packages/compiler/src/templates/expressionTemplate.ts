import {
  ArrayLiteral,
  BinaryExpression,
  Block,
  BooleanLiteral,
  ElseBlock,
  ElseIfBlock,
  Expression,
  ForOfStatement,
  FunctionCall,
  FunctionExpression,
  IfBlock,
  IfStatement,
  MemberExpression,
  NullLiteral,
  NumberLiteral,
  ParenthesizedExpression,
  RecordLiteral,
  Statement,
  StringLiteral,
  UnaryExpression,
  UndefinedLiteral,
  WhileStatement,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { operatorTemplate } from "./operatorTemplate.js";
import { typeArgumentsTemplate, typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { variableDeclarationTemplate } from "./variableDeclarationTemplate.js";
import { functionDeclarationTemplate } from "./functionDeclarationTemplate.js";
import { identifierOrDestructureTemplate } from "./identifierOrDestructureTemplate.js";

export function statementTemplate(statement: Statement): Interpolation {
  switch (statement._tag) {
    case "BreakStatement":
      return t.span(statement.span)(`break`);
    case "Comment":
      return t.span(statement.span)(statement.text);
    case "ContinueStatement":
      return t.span(statement.span)(`continue`);
    case "ForOfStatement":
      return forOfStatementTemplate(statement);
    case "FunctionDeclaration":
      return functionDeclarationTemplate(statement);
    case "IfStatement":
      return ifStatementTemplate(statement);
    case "ReturnStatement":
      return t.span(statement.span)(
        t.span(statement.keyword)(`return`),
        ` `,
        expressionTemplate(statement.expression)
      );
    case "VariableDeclaration":
      return variableDeclarationTemplate(statement);
    case "WhileStatement":
      return whileStatementTemplate(statement);
  }
}

export function expressionTemplate(expression: Expression): Interpolation {
  switch (expression._tag) {
    case "ArrayLiteral":
      return arrayLiteralTemplate(expression);
    case "BinaryExpression":
      return binaryExpressionTemplate(expression);
    case "BooleanLiteral":
      return booleanLiteralTemplate(expression);
    case "FunctionCall":
      return functionCallTemplate(expression);
    case "FunctionExpression":
      return functionExpressionTemplate(expression);
    case "Identifier":
      return t.identifier(expression);
    case "MemberExpression":
      return memberExpressionTemplate(expression);
    case "NullLiteral":
      return nullLiteralTemplate(expression);
    case "NumberLiteral":
      return numberLiteralTemplate(expression);
    case "ParenthesizedExpression":
      return parenthesizedExpressionTemplate(expression);
    case "RecordLiteral":
      return recordLiteralTemplate(expression);
    case "StringLiteral":
      return stringLiteralTemplate(expression);
    case "UnaryExpression":
      return unaryExpressionTemplate(expression);
    case "UndefinedLiteral":
      return undefinedLiteralTemplate(expression);
  }
}

// TODO: Support multi-line array literals
function arrayLiteralTemplate(expression: ArrayLiteral): Interpolation {
  return t.span(expression.span)(
    t`[${t.intercolate(`, `)(expression.values.map(expressionTemplate))}]`
  );
}

function binaryExpressionTemplate(expression: BinaryExpression): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.left)} ${operatorTemplate(
      expression.operator
    )} ${expressionTemplate(expression.right)}`
  );
}

function booleanLiteralTemplate(expression: BooleanLiteral): Interpolation {
  return t.span(expression.span)(String(expression.value));
}

function functionCallTemplate(expression: FunctionCall): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.callee)}${typeArgumentsTemplate(
      expression.typeArguments
    )}(${t.intercolate(`, `)(expression.parameters.map(expressionTemplate))})`
  );
}

function functionExpressionTemplate(
  expression: FunctionExpression
): Interpolation {
  return t.span(expression.span)(
    typeParametersTemplate(expression.typeParameters),
    t`( ${t.intercolate(`, `)(
      expression.parameters.map(
        (f) => t`${t.identifier(f.name)}: ${typeTemplate(f.value)}`
      )
    )} ) => ${blockTemplate(expression.block)}`
  );
}

function memberExpressionTemplate(expression: MemberExpression): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.object)}.${t.identifier(
      expression.property
    )}`
  );
}

function nullLiteralTemplate(expression: NullLiteral): Interpolation {
  return t.span(expression.span)(`null`);
}

function numberLiteralTemplate(expression: NumberLiteral): Interpolation {
  return t.span(expression.span)(`${expression.value}`);
}

function parenthesizedExpressionTemplate(
  expression: ParenthesizedExpression
): Interpolation {
  return t.span(expression.span)(
    t`(${expressionTemplate(expression.expression)})`
  );
}

function recordLiteralTemplate(expression: RecordLiteral): Interpolation {
  return t.span(expression.span)(
    t`{ ${t.intercolate([`,`, t.newLine()])(
      expression.fields.map(
        (field) =>
          t`${t.identifier(field.name)}: ${expressionTemplate(field.value)}`
      )
    )} }`
  );
}

function stringLiteralTemplate(expression: StringLiteral): Interpolation {
  return t.span(expression.span)(`"${expression.value}"`);
}

function unaryExpressionTemplate(expression: UnaryExpression): Interpolation {
  return t.span(expression.span)(
    t`${operatorTemplate(expression.operator)}${expressionTemplate(
      expression.argument
    )}`
  );
}

function undefinedLiteralTemplate(expression: UndefinedLiteral): Interpolation {
  return t.span(expression.span)(`undefined`);
}

export function blockTemplate(block: Block): Interpolation {
  return t.span(block.span)(
    t`{`,
    t.newLine(),
    t.ident(
      t.intercolate([t.newLine(), t.newLine()])(
        block.statements.map(statementTemplate)
      )
    ),
    t.newLine(),
    t`}`
  );
}

function forOfStatementTemplate(statement: ForOfStatement): Interpolation {
  return t.span(statement.span)(
    t.span(statement.keyword)(`for`),
    ` (`,
    `const `,
    identifierOrDestructureTemplate(statement.name),
    ` of `,
    expressionTemplate(statement.iterable),
    `)`,
    blockTemplate(statement.block)
  );
}

function ifStatementTemplate(statement: IfStatement): Interpolation {
  return t.span(statement.span)(
    ifBlockTemplate(statement.ifBlock),
    t.intercolate(t.newLine())(statement.elseIfBlocks.map(elseIfBlockTemplate)),
    statement.elseBlock ? elseBlockTemplate(statement.elseBlock) : ""
  );
}

function ifBlockTemplate(block: IfBlock): Interpolation {
  return t.span(block.span)(
    t.span(block.keyword)(`if`),
    ` (`,
    expressionTemplate(block.condition),
    `) `,
    blockTemplate(block.block)
  );
}

function elseIfBlockTemplate(block: ElseIfBlock): Interpolation {
  return t.span(block.span)(
    t.span(block.elseKeyword)(`else`),
    ` `,
    t.span(block.ifKeyword)(`if`),
    ` (`,
    expressionTemplate(block.condition),
    `) `,
    blockTemplate(block.block)
  );
}

function elseBlockTemplate(block: ElseBlock): Interpolation {
  return t.span(block.span)(
    t.span(block.keyword)(`else`),
    ` `,
    blockTemplate(block.block)
  );
}

function whileStatementTemplate(statement: WhileStatement): Interpolation {
  return t.span(statement.span)(
    t.span(statement.keyword)(`while`),
    ` (`,
    expressionTemplate(statement.condition),
    `)`,
    blockTemplate(statement.block)
  );
}
