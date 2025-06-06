import {
  ArrayLiteral,
  BinaryExpression,
  Block,
  BooleanLiteral,
  ElseBlock,
  ElseIfBlock,
  Expression,
  ForInStatement,
  ForOfStatement,
  FunctionCall,
  FunctionExpression,
  IfBlock,
  IfStatement,
  MatchCase,
  MatchExpression,
  MemberExpression,
  NullLiteral,
  NumberLiteral,
  ParenthesizedExpression,
  RecordLiteral,
  Span,
  Statement,
  StringLiteral,
  TokenKind,
  UnaryExpression,
  UndefinedLiteral,
  WhileStatement,
  Pattern,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { operatorTemplate } from "./operatorTemplate.js";
import { HktsByName, typeArgumentsTemplate, typeTemplate } from "./typeTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { variableDeclarationTemplate } from "./variableDeclarationTemplate.js";
import { functionDeclarationTemplate } from "./functionDeclarationTemplate.js";
import { identifierOrDestructureTemplate } from "./identifierOrDestructureTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";
import { declarationTemplate } from "./declarationTemplate.js";

export function statementTemplate(statement: Statement, hktsByName?: HktsByName): Interpolation {
  switch (statement._tag) {
    case "BreakStatement":
      return t.span(statement.span)(`break`);
    case "Comment":
      return t.span(statement.span)(statement.text);
    case "ContinueStatement":
      return t.span(statement.span)(`continue`);
    case "ForOfStatement":
      return forOfStatementTemplate(statement, hktsByName);
    case "FunctionDeclaration":
      return functionDeclarationTemplate(statement, hktsByName);
    case "IfStatement":
      return ifStatementTemplate(statement, hktsByName);
    case "ReturnStatement":
      return t.span(statement.span)(
        t.span(statement.keyword)(`return`),
        ` `,
        expressionTemplate(statement.expression, hktsByName)
      );
    case "VariableDeclaration":
      return variableDeclarationTemplate(statement, hktsByName);
    case "WhileStatement":
      return whileStatementTemplate(statement, hktsByName);
    case "ForInStatement":
      return forInStatementTemplate(statement, hktsByName);
    default:
      return declarationTemplate(statement, hktsByName);
  }
}

export function expressionTemplate(expression: Expression, hktsByName?: HktsByName): Interpolation {
  switch (expression._tag) {
    case "ArrayLiteral":
      return arrayLiteralTemplate(expression, hktsByName);
    case "BinaryExpression":
      return binaryExpressionTemplate(expression, hktsByName);
    case "BooleanLiteral":
      return booleanLiteralTemplate(expression);
    case "FunctionCall":
      return functionCallTemplate(expression, hktsByName);
    case "FunctionExpression":
      return functionExpressionTemplate(expression, hktsByName);
    case "Identifier":
      return t.identifier(expression);
    case "MemberExpression":
      return memberExpressionTemplate(expression, hktsByName);
    case "NullLiteral":
      return nullLiteralTemplate(expression);
    case "NumberLiteral":
      return numberLiteralTemplate(expression);
    case "ParenthesizedExpression":
      return parenthesizedExpressionTemplate(expression, hktsByName);
    case "RecordLiteral":
      return recordLiteralTemplate(expression, hktsByName);
    case "StringLiteral":
      return stringLiteralTemplate(expression);
    case "UnaryExpression":
      return unaryExpressionTemplate(expression, hktsByName);
    case "UndefinedLiteral":
      return undefinedLiteralTemplate(expression);
    case "MatchExpression":
      return matchExpressionTemplate(expression, hktsByName);
  }
}

// TODO: Support multi-line array literals
function arrayLiteralTemplate(expression: ArrayLiteral, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`[${t.intercolate(`, `)(expression.values.map(ex => expressionTemplate(ex, hktsByName)))}]`
  );
}

function binaryExpressionTemplate(expression: BinaryExpression, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.left, hktsByName)} ${operatorTemplate(
      expression.operator
    )} ${expressionTemplate(expression.right, hktsByName)}`
  );
}

function booleanLiteralTemplate(expression: BooleanLiteral): Interpolation {
  return t.span(expression.span)(String(expression.value));
}

function functionCallTemplate(expression: FunctionCall, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.callee, hktsByName)}${typeArgumentsTemplate(
      expression.typeArguments,
      hktsByName
    )}(${t.intercolate(`, `)(expression.parameters.map(e => expressionTemplate(e, hktsByName)))})`
  );
}

// TODO: WE NEED MUCH BETTER SUPPORT FOR HKT's
function functionExpressionTemplate(
  expression: FunctionExpression,
  hktsByName?: HktsByName
): Interpolation {
  return t.span(expression.span)(
    typeParametersTemplate(expression.typeParameters.flatMap(t => unwrapHkt(t, hktsByName)), {
      parameterVariance: false,
      functionDefaultValue: true,
      constants: true,
    }),
    t`(${t.intercolate(`, `)(
      expression.parameters.map(
        (f) =>
          // TODO: Need to support replacing of HKTs
          t`${t.identifier(f.name)}: ${f.value === undefined ? t.identifier(f.name) : typeTemplate(f.value, hktsByName)
            }`
      )
    )})`,
    expression.returnType ? t`: ${typeTemplate(expression.returnType, hktsByName)}` : "",
    t` => ${expression.block._tag === "Block"
      ? blockTemplate(expression.block, hktsByName)
      : expressionTemplate(expression.block, hktsByName)
      }`
  );
}

function memberExpressionTemplate(expression: MemberExpression, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`${expressionTemplate(expression.object, hktsByName)}${expression.questionMark ? t.span(expression.questionMark)(`?`) : ""
      }.${t.identifier(expression.property)}`
  );
}

function nullLiteralTemplate(expression: NullLiteral): Interpolation {
  return t.span(expression.span)(`null`);
}

function numberLiteralTemplate(expression: NumberLiteral): Interpolation {
  return t.span(expression.span)(`${expression.value}`);
}

function parenthesizedExpressionTemplate(
  expression: ParenthesizedExpression,
  hktsByName?: HktsByName
): Interpolation {
  return t.span(expression.span)(
    t`(${expressionTemplate(expression.expression, hktsByName)})`
  );
}

function recordLiteralTemplate(expression: RecordLiteral, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`{ ${t.intercolate([`,`, t.newLine()])(
      expression.fields.map(
        (field) =>
          t`${t.identifier(field.name)}: ${expressionTemplate(field.value, hktsByName)}`
      )
    )} }`
  );
}

function stringLiteralTemplate(expression: StringLiteral): Interpolation {
  return t.span(expression.span)(`"${expression.value}"`);
}

function unaryExpressionTemplate(expression: UnaryExpression, hktsByName?: HktsByName): Interpolation {
  return t.span(expression.span)(
    t`${operatorTemplate(expression.operator)}${expressionTemplate(
      expression.argument,
      hktsByName
    )}`
  );
}

function undefinedLiteralTemplate(expression: UndefinedLiteral): Interpolation {
  return t.span(expression.span)(`undefined`);
}

export function blockTemplate(block: Block, hktsByName?: HktsByName): Interpolation {
  return t.span(block.span)(
    t`{`,
    t.newLine(),
    t.indent(
      t.intercolate([t.newLine(), t.newLine()])(
        block.statements.map(stmt => statementTemplate(stmt, hktsByName))
      )
    ),
    t.newLine(),
    t`}`
  );
}

function forOfStatementTemplate(statement: ForOfStatement, hktsByName?: HktsByName): Interpolation {
  return t.span(statement.span)(
    t.span(statement.keyword)(`for`),
    ` (`,
    t`${variableKindTemplate(statement.variable)} `,
    identifierOrDestructureTemplate(statement.name),
    ` of `,
    expressionTemplate(statement.iterable, hktsByName),
    `) `,
    blockTemplate(statement.block, hktsByName)
  );
}

function forInStatementTemplate(statement: ForInStatement, hktsByName?: HktsByName): Interpolation {
  return t.span(statement.span)(
    t.span(statement.keyword)(`for`),
    ` (`,
    t`${variableKindTemplate(statement.variable)} `,
    identifierOrDestructureTemplate(statement.name),
    ` in `,
    expressionTemplate(statement.object, hktsByName),
    `) `,
    blockTemplate(statement.block, hktsByName)
  );
}

function variableKindTemplate(
  variable: [
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

function ifStatementTemplate(statement: IfStatement, hktsByName?: HktsByName): Interpolation {
  return t.span(statement.span)(
    ifBlockTemplate(statement.ifBlock, hktsByName),
    t.intercolate(t.newLine())(statement.elseIfBlocks.map(b => elseIfBlockTemplate(b, hktsByName)),
      statement.elseBlock ? elseBlockTemplate(statement.elseBlock, hktsByName) : ""
    ))
}

function ifBlockTemplate(block: IfBlock, hktsByName?: HktsByName): Interpolation {
  return t.span(block.span)(
    t.span(block.keyword)(`if`),
    ` (`,
    expressionTemplate(block.condition, hktsByName),
    `) `,
    blockTemplate(block.block, hktsByName)
  );
}

function elseIfBlockTemplate(block: ElseIfBlock, hktsByName?: HktsByName): Interpolation {
  return t.span(block.span)(
    t.span(block.elseKeyword)(`else`),
    ` `,
    t.span(block.ifKeyword)(`if`),
    ` (`,
    expressionTemplate(block.condition, hktsByName),
    `) `,
    blockTemplate(block.block, hktsByName)
  );
}

function elseBlockTemplate(block: ElseBlock, hktsByName?: HktsByName): Interpolation {
  return t.span(block.span)(
    t.span(block.keyword)(`else`),
    ` `,
    blockTemplate(block.block, hktsByName)
  );
}

function whileStatementTemplate(statement: WhileStatement, hktsByName?: HktsByName): Interpolation {
  return t.span(statement.span)(
    t.span(statement.keyword)(`while`),
    ` (`,
    expressionTemplate(statement.condition, hktsByName),
    `)`,
    blockTemplate(statement.block, hktsByName)
  );
}

function matchExpressionTemplate(expression: MatchExpression, hktsByName?: HktsByName): Interpolation {
  const valueName = "__matchValue";
  return t.span(expression.span)(
    t`(() => {`,
    t.newLine(),
    t.indent(
      t`const ${valueName} = `,
      expressionTemplate(expression.matching, hktsByName),
      t`;`,
      t.newLine(),
      t`switch (true) {`,
      t.newLine(),
      t.indent(
        t.intercolate([t.newLine(), t.newLine()])(
          expression.cases.map((c) => matchCaseTemplate(c, valueName, hktsByName))
        )
      ),
      t.newLine(),
      t`default: throw new Error("Unhandled match case");`,
      t.newLine(),
      t`}`,
      t.newLine(),
      t`})()`
    )
  );
}

function matchCaseTemplate(matchCase: MatchCase, valueName: string, hktsByName?: HktsByName): Interpolation {
  return t.span(matchCase.span)(
    t`case `,
    patternTestTemplate(matchCase.pattern, valueName),
    t`:`,
    t.newLine(),
    t.indent(
      matchCase.body._tag === "Block"
        ? blockTemplate(matchCase.body, hktsByName)
        : expressionTemplate(matchCase.body, hktsByName)
    )
  );
}

function patternTestTemplate(pattern: Pattern, valueName: string): Interpolation {
  switch (pattern._tag) {
    case "Identifier":
      return t`${valueName} === ${t.identifier(pattern)}`;
    case "StringLiteral":
      return t`${valueName} === "${pattern.value}"`;
    case "NumberLiteral":
      return t`${valueName} === ${String(pattern.value)}`;
    case "BooleanLiteral":
      return t`${valueName} === ${String(pattern.value)}`;
    case "NullLiteral":
      return t`${valueName} === null`;
    case "UndefinedLiteral":
      return t`${valueName} === undefined`;
    case "ArrayPattern":
      return t`${valueName} && Array.isArray(${valueName}) && ${valueName}.length === ${String(pattern.elements.length)} && ${t.intercolate(" && ")(
        pattern.elements.map((element, index) =>
          patternTestTemplate(element, `${valueName}[${index}]`)
        )
      )}`;
    case 'ArrayLiteral':
      return t`${valueName} && Array.isArray(${valueName}) && ${valueName}.length === ${String(pattern.values.length)} && ${t.intercolate(" && ")(
        pattern.values.map((value, index) =>
          t`${valueName}[${String(index)}] === ${expressionTemplate(value)}`
        )
      )}`;
    case 'RecordLiteral':
      return t`${valueName} && typeof ${valueName} === "object" && Object.keys(${valueName}).length === ${String(pattern.fields.length)} && ${t.intercolate(" && ")(
        pattern.fields.map(field =>
          t`${valueName}.${t.identifier(field.name)} === ${expressionTemplate(field.value)}`
        )
      )}`;
    default:
      throw new Error(`Unhandled pattern type: ${JSON.stringify(pattern, null, 2)}`);
  }
}