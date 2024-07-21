import * as AST from "./AST/index.js";
import { Span, SpanLocation } from "./Span";
import { Token, TokenKind } from "./Token.js";
import { tokenize } from "./Tokenizer.js";

class Parser {
  private pos = 0;
  constructor(readonly tokens: readonly Token[]) {}

  get isEOF(): boolean {
    return this.pos >= this.tokens.length;
  }

  token(): Token {
    return this.tokens[this.pos];
  }

  peek(): Token | undefined {
    return this.tokens[this.pos + 1];
  }

  consume(): Token {
    return this.tokens[this.pos++];
  }

  consumeToken(kind: TokenKind): Token {
    const token = this.token();

    if (token?.kind === kind) {
      return this.consume();
    }

    throw new Error(
      `Expected token of kind ${kind} but got ${token.kind}:: ${token.text}`
    );
  }

  consumeTokenIf<KINDS extends readonly TokenKind[]>(
    ...kinds: KINDS
  ): (Token & { readonly kind: KINDS[number] }) | undefined {
    const token = this.token();
    if (token && kinds.includes(token.kind)) {
      this.pos++;
      return token as Extract<Token, { readonly kind: KINDS[number] }>;
    }
    return undefined;
  }

  skipWhitespace() {
    while (this.token()?.kind === TokenKind.Whitespace) {
      this.pos++;
    }
  }
}

export function parse(fileName: string, source: string): AST.SourceFile {
  const tokens = tokenize(source);
  const parser = new Parser(tokens);
  const declarations: AST.Declaration[] = [];

  while (!parser.isEOF) {
    parser.skipWhitespace();
    declarations.push(parseDeclaration(parser));
    parser.skipWhitespace();
  }

  return new AST.SourceFile(
    fileName,
    source,
    declarations,
    new Span(tokens[0].span.start, tokens[tokens.length - 1].span.end)
  );
}

function parseDeclaration(parser: Parser): AST.Declaration {
  const exportKeyword = parser.consumeTokenIf(TokenKind.ExportKeyword);
  parser.skipWhitespace();
  const current = parser.consumeTokenIf(
    TokenKind.DataKeyword,
    TokenKind.TypeKeyword,
    TokenKind.BrandKeyword,
    TokenKind.FunctionKeyword,
    TokenKind.TypeClassKeyword,
    TokenKind.ConstKeyword,
    TokenKind.Comment
  );

  if (current === undefined) {
    throw new Error(
      `Unexpected token in module scope: ${parser.token().kind} :: ${
        parser.token().text
      }`
    );
  }
  parser.skipWhitespace();

  switch (current.kind) {
    case TokenKind.DataKeyword:
      return parseDataDeclaration(parser, current.span.start, exportKeyword);
    case TokenKind.TypeKeyword:
      return parseTypeAlias(parser, current.span.start, exportKeyword);
    case TokenKind.BrandKeyword:
      return parseBrandDeclaration(parser, current.span.start, exportKeyword);
    case TokenKind.FunctionKeyword:
      return parseFunctionDeclaration(
        parser,
        current.span.start,
        exportKeyword
      );
    case TokenKind.TypeClassKeyword:
      return parseTypeClassDeclaration(
        parser,
        current.span.start,
        exportKeyword
      );
    case TokenKind.ConstKeyword:
      return parseVariableDeclaration(
        parser,
        current.span.start,
        exportKeyword
      );
    case TokenKind.Comment: {
      if (exportKeyword) {
        throw new Error(`Unexpected export keyword before comment`);
      }
      return new AST.Comment(current.text, current.span);
    }
    default:
      throw new Error(`Unexpected token: ${current.kind} :: ${current.text}`);
  }
}

function parseDataDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.DataDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const typeParameters = parseTypeParameters(parser);
  parser.skipWhitespace();
  const equals = parser.consumeToken(TokenKind.EqualSign);
  parser.skipWhitespace();
  const constructors = parseConstructors(parser);
  parser.skipWhitespace();

  return new AST.DataDeclaration(
    name,
    typeParameters,
    equals.span,
    constructors,
    new Span(
      exportKeyword?.span.start ?? start,
      constructors[constructors.length - 1].span.end
    ),
    exportKeyword?.span
  );
}

function parseTypeParameters(parser: Parser): AST.TypeParameter[] {
  const typeParameters: AST.TypeParameter[] = [];
  if (parser.consumeTokenIf(TokenKind.LessThan)) {
    do {
      parser.skipWhitespace();
      const name = parser.consumeToken(TokenKind.Identifier);
      parser.skipWhitespace();
      const constraint = parseTypeConstraint(parser);
      typeParameters.push(
        new AST.TypeParameter(
          new AST.Identifier(name.text, name.span),
          constraint,
          name.span
        )
      );
    } while (parser.consumeTokenIf(TokenKind.Comma));
    parser.skipWhitespace();
    parser.consumeToken(TokenKind.GreaterThan);
  }
  return typeParameters;
}

function parseTypeConstraint(parser: Parser): AST.Type | undefined {
  if (parser.consumeTokenIf(TokenKind.Colon)) {
    parser.skipWhitespace();
    const type = parseType(parser);
    parser.skipWhitespace();
    return type;
  }
  return undefined;
}

function parseConstructors(parser: Parser): AST.DataConstructor[] {
  const constructors: AST.DataConstructor[] = [];
  parser.skipWhitespace();
  parser.consumeTokenIf(TokenKind.Pipe);
  do {
    parser.skipWhitespace();
    constructors.push(parseConstructor(parser));
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(TokenKind.Pipe));
  return constructors;
}

function parseConstructor(parser: Parser): AST.DataConstructor {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();

  if (parser.consumeTokenIf(TokenKind.OpenParen)) {
    const [fields, end] = parseFields(
      parser,
      [TokenKind.Comma, TokenKind.Whitespace],
      TokenKind.CloseParen
    );
    return new AST.TupleConstructor(
      name,
      fields,
      new Span(name.span.start, end.span.end)
    );
  }

  if (parser.consumeTokenIf(TokenKind.OpenBrace)) {
    const [fields, end] = parseFields(
      parser,
      [TokenKind.Semicolon, TokenKind.Whitespace],
      TokenKind.CloseBrace
    );
    return new AST.RecordConstructor(
      name,
      fields as readonly AST.NamedField[],
      new Span(name.span.start, end.span.end)
    );
  }

  return new AST.VoidConstructor(name, name.span);
}

function consumeIdentifier(parser: Parser): AST.Identifier {
  const token = parser.consumeToken(TokenKind.Identifier);
  return new AST.Identifier(token.text, token.span);
}

function consumeIdentifierOrPropertyAccess(
  parser: Parser
): AST.Identifier | AST.PropertyAccess {
  return consumePropertyAccessFromIdentifier(parser, consumeIdentifier(parser));
}

function consumePropertyAccessFromIdentifier(
  parser: Parser,
  left: AST.Identifier
): AST.Identifier | AST.PropertyAccess {
  const dot = parser.consumeTokenIf(TokenKind.Period);
  if (dot === undefined) return left;
  const right = consumeIdentifierOrPropertyAccess(parser);

  return new AST.PropertyAccess(
    left,
    dot.span,
    right,
    new Span(left.span.start, right.span.end)
  );
}

function parseFields(
  parser: Parser,
  separators: readonly TokenKind[],
  terminator: TokenKind
): readonly [AST.Field[], Token] {
  const fields: AST.Field[] = [];
  const fieldIndex = (): number => fields.length;
  do {
    parser.skipWhitespace();
    fields.push(parseField(parser, fieldIndex));
    parser.skipWhitespace();
  } while (separators.some((kind) => parser.consumeTokenIf(kind)));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [fields, end];
}

function parseField(parser: Parser, fieldIndex: () => number): AST.Field {
  const current = parser.token();

  if (current.kind === TokenKind.Identifier) {
    const next = parser.peek();

    if (next?.kind === TokenKind.Colon) {
      return parseNamedField(parser);
    }
  }

  return parsePositionalField(parser, fieldIndex());
}

function parseNamedField(parser: Parser): AST.NamedField {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.Colon);
  parser.skipWhitespace();
  const type = parseType(parser);
  parser.skipWhitespace();
  return new AST.NamedField(
    name,
    type,
    new Span(name.span.start, type.span.end)
  );
}

function parsePositionalField(
  parser: Parser,
  index: number
): AST.PositionalField {
  const type = parseType(parser);
  parser.skipWhitespace();
  return new AST.PositionalField(index, type, type.span);
}

function parseType(parser: Parser): AST.Type {
  parser.skipWhitespace();

  const current = parser.token();

  switch (current.kind) {
    case TokenKind.Identifier:
      return parseTypeFromIdentifier(parser);
    case TokenKind.BooleanLiteral:
      return parseTypeFromBooleanLiteral(parser);
    case TokenKind.NumberLiteral:
      return parseTypeFromNumberLiteral(parser);
    case TokenKind.StringLiteral:
      return parseTypeFromStringLiteral(parser);
    case TokenKind.OpenBracket:
      return parseTypeFromOpenBracket(parser);
    case TokenKind.OpenBrace:
      return parseTypeFromOpenBrace(parser);
    case TokenKind.OpenParen:
      return parseFunctionTypeFromOpenParam(parser);
    case TokenKind.LessThan:
      return parseTypeFromLessThan(parser);
    case TokenKind.Period:
      return parseRestType(parser);
  }

  throw new Error(
    `Unexpected token: ${current.kind} :: ${current.text} in position where a type was expected`
  );
}

function parseTypeFromIdentifier(parser: Parser): AST.Type {
  const identifier = consumeIdentifierOrPropertyAccess(parser);
  parser.skipWhitespace();

  if (identifier._tag === "Identifier") {
    switch (identifier.text) {
      case "Array":
        return parseTypeFromArrayIdentifier(parser, identifier);
      case "Map":
        return parseTypeFromMapIdentifier(parser, identifier);
      case "Set":
        return parseTypeFromSetIdentifier(parser, identifier);
      case "Boolean":
        return new AST.BooleanType(identifier.span);
      case "Number":
        return new AST.NumberType(identifier.span);
      case "String":
        return new AST.StringType(identifier.span);
      case "Any":
        return new AST.AnyType(identifier.span);
      case "BigInt":
        return new AST.BigIntType(identifier.span);
      case "Symbol":
        return new AST.SymbolType(identifier.span);
      case "Undefined":
        return new AST.UndefinedType(identifier.span);
      case "Null":
        return new AST.NullType(identifier.span);
      case "Void":
        return new AST.VoidType(identifier.span);
      case "Never":
        return new AST.NeverType(identifier.span);
      case "Unknown":
        return new AST.UnknownType(identifier.span);
      case "Object":
        return new AST.ObjectType(identifier.span);
      case "Function":
        return new AST.FunctionKeywordType(identifier.span);
    }
  }

  return parseTypeReferenceFromIdentifer(parser, identifier);
}

function parseTypeReferenceFromIdentifer(
  parser: Parser,
  identifier: AST.Identifier | AST.PropertyAccess
): AST.TypeReference {
  const typeArguments = parseTypeArguments(parser);

  return new AST.TypeReference(
    identifier,
    typeArguments,
    typeArguments.length
      ? new Span(
          identifier.span.start,
          typeArguments[typeArguments.length - 1].span.end
        )
      : identifier.span
  );
}

function parseTypeFromBooleanLiteral(parser: Parser): AST.BooleanLiteralType {
  const token = parser.consumeToken(TokenKind.BooleanLiteral);
  return new AST.BooleanLiteralType(token.text === "true", token.span);
}

function parseTypeFromNumberLiteral(parser: Parser): AST.NumericLiteralType {
  const token = parser.consumeToken(TokenKind.NumberLiteral);
  return new AST.NumericLiteralType(Number(token.text), token.span);
}

function parseTypeFromStringLiteral(parser: Parser): AST.StringLiteralType {
  const token = parser.consumeToken(TokenKind.StringLiteral);
  return new AST.StringLiteralType(token.text, token.span);
}

function parseTypeFromArrayIdentifier(
  parser: Parser,
  identifier: AST.Identifier
): AST.ArrayType {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.LessThan);
  parser.skipWhitespace();
  const type = parseType(parser);
  parser.skipWhitespace();
  const end = parser.consumeToken(TokenKind.GreaterThan);
  return new AST.ArrayType(type, new Span(identifier.span.start, end.span.end));
}

function parseTypeFromMapIdentifier(
  parser: Parser,
  identifier: AST.Identifier
): AST.MapType {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.LessThan);
  parser.skipWhitespace();
  const key = parseType(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.Comma);
  parser.skipWhitespace();
  const value = parseType(parser);
  parser.skipWhitespace();
  const end = parser.consumeToken(TokenKind.GreaterThan);
  return new AST.MapType(
    key,
    value,
    new Span(identifier.span.start, end.span.end)
  );
}

function parseTypeFromSetIdentifier(
  parser: Parser,
  identifier: AST.Identifier
): AST.SetType {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.LessThan);
  parser.skipWhitespace();
  const type = parseType(parser);
  parser.skipWhitespace();
  const end = parser.consumeToken(TokenKind.GreaterThan);
  return new AST.SetType(type, new Span(identifier.span.start, end.span.end));
}

function parseTypeFromOpenBracket(parser: Parser): AST.TupleType {
  const start = parser.consumeToken(TokenKind.OpenBracket);
  parser.skipWhitespace();
  const [types, end] = parseTypes(
    parser,
    TokenKind.Comma,
    TokenKind.CloseBracket
  );
  return new AST.TupleType(types, new Span(start.span.start, end.span.end));
}

function parseTypeFromOpenBrace(parser: Parser): AST.RecordType {
  const start = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const [fields, end] = parseFields(
    parser,
    [TokenKind.Semicolon, TokenKind.Whitespace],
    TokenKind.CloseBrace
  );
  return new AST.RecordType(
    fields as readonly AST.NamedField[],
    new Span(start.span.start, end.span.end)
  );
}

function parseFunctionTypeFromOpenParam(
  parser: Parser,
  typeParameters: ReadonlyArray<AST.TypeParameter> = []
): AST.FunctionType {
  const start = parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const [fields] = parseFields(parser, [TokenKind.Comma], TokenKind.CloseParen);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.EqualSign);
  parser.consumeToken(TokenKind.GreaterThan);
  parser.skipWhitespace();
  const returnType = parseType(parser);
  return new AST.FunctionType(
    typeParameters,
    fields,
    returnType,
    new Span(start.span.start, returnType.span.end)
  );
}

function parseTypeFromLessThan(parser: Parser): AST.Type {
  const typeParameters = parseTypeParameters(parser);
  parser.skipWhitespace();
  return parseFunctionTypeFromOpenParam(parser, typeParameters);
}

function parseTypes(
  parser: Parser,
  separator: TokenKind,
  terminator: TokenKind
): readonly [AST.Type[], Token] {
  const types: AST.Type[] = [];
  do {
    parser.skipWhitespace();
    types.push(parseType(parser));
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(separator));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [types, end];
}

function parseTypeArguments(parser: Parser): AST.Type[] {
  if (parser.consumeTokenIf(TokenKind.LessThan)) {
    const [types] = parseTypes(parser, TokenKind.Comma, TokenKind.GreaterThan);
    return types;
  }
  return [];
}

function parseTypeAlias(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.TypeAliasDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const typeParameters = parseTypeParameters(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.EqualSign);
  parser.skipWhitespace();
  const type = parseType(parser);
  parser.skipWhitespace();
  return new AST.TypeAliasDeclaration(
    name,
    typeParameters,
    type,
    new Span(exportKeyword ? exportKeyword.span.start : start, type.span.end),
    exportKeyword?.span
  );
}

function parseRestType(parser: Parser): AST.RestType {
  const start = parser.consumeToken(TokenKind.Period);
  parser.consumeToken(TokenKind.Period);
  parser.consumeToken(TokenKind.Period);
  parser.skipWhitespace();
  const type = parseType(parser);
  return new AST.RestType(type, new Span(start.span.start, type.span.end));
}

function parseBrandDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.BrandDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const equals = parser.consumeToken(TokenKind.EqualSign);
  parser.skipWhitespace();
  const type = parseType(parser);
  parser.skipWhitespace();
  return new AST.BrandDeclaration(
    name,
    equals.span,
    type,
    new Span(exportKeyword ? exportKeyword.span.start : start, type.span.end),
    exportKeyword?.span
  );
}

function parseFunctionDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.FunctionDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();  
  const typeParams = parseTypeParameters(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const [fields] = parseFields(
    parser,
    [TokenKind.Comma, TokenKind.Whitespace],
    TokenKind.CloseParen
  );
  parser.skipWhitespace();

  let returnType: AST.Type | undefined;
  if (parser.consumeTokenIf(TokenKind.Colon)) {
    parser.skipWhitespace();
    returnType = parseType(parser);
  }

  const block = parseBlock(parser);
  parser.skipWhitespace();
  return new AST.FunctionDeclaration(
    name,
    typeParams,
    fields as readonly AST.NamedField[],
    returnType,
    block,
    new Span(exportKeyword ? exportKeyword.span.start : start, block.span.end),
    exportKeyword?.span
  );
}

function parseBlock(parser: Parser): AST.Block {
  const start = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const statements: AST.Statement[] = [];
  while (!parser.isEOF && !parser.consumeTokenIf(TokenKind.CloseBrace)) {
    statements.push(parseStatement(parser));
    parser.skipWhitespace();
  }
  return new AST.Block(
    statements,
    new Span(start.span.start, statements[statements.length - 1].span.end)
  );
}

function parseStatement(parser: Parser) {
  const current = parser.consumeTokenIf(
    TokenKind.FunctionKeyword,
    TokenKind.ConstKeyword,
    TokenKind.IfKeyword,
    TokenKind.Comment,
    TokenKind.ReturnKeyword
  );

  if (current === undefined) {
    throw new Error(
      `Unexpected token in block: ${parser.token().kind} :: ${
        parser.token().text
      }`
    );
  }

  switch (current.kind) {
    case TokenKind.FunctionKeyword:
      return parseFunctionDeclaration(parser, current.span.start, undefined);
    case TokenKind.ConstKeyword:
      return parseVariableDeclaration(parser, current.span.start);
    case TokenKind.IfKeyword:
      return parseIfStatement(parser, current.span);
    case TokenKind.Comment:
      return new AST.Comment(current.text, current.span);
    case TokenKind.ReturnKeyword: {
      parser.skipWhitespace();
      const expr = parseExpression(parser);
      return new AST.ReturnStatement(
        current.span,
        expr,
        new Span(current.span.start, expr.span.end)
      );
    }
    default:
      throw new Error(
        `Unexpected token in block: ${current.kind} :: ${current.text}`
      );
  }
}

function parseVariableDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined = undefined
): AST.VariableDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();

  let type: AST.Type | undefined;
  if (parser.consumeTokenIf(TokenKind.Colon)) {
    parser.skipWhitespace();
    type = parseType(parser);
    parser.skipWhitespace();
  }

  const equals = parser.consumeToken(TokenKind.EqualSign);
  parser.skipWhitespace();
  const value = parseExpression(parser);
  parser.skipWhitespace();
  return new AST.VariableDeclaration(
    name,
    type,
    equals.span,
    value,
    new Span(exportKeyword ? exportKeyword.span.start : start, value.span.end),
    exportKeyword?.span
  );
}

function parseIfStatement(parser: Parser, start: Span): AST.IfStatement {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const condition = parseExpression(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.CloseParen);
  parser.skipWhitespace();
  const block = parseBlock(parser);
  parser.skipWhitespace();
  const elseIfBlocks = parseElseIfBlocks(parser);
  parser.skipWhitespace();
  const elseBlock = parseElseBlock(parser);

  const end =
    elseBlock?.span.end ??
    elseIfBlocks[elseIfBlocks.length - 1]?.span.end ??
    block.span.end;

  return new AST.IfStatement(
    new AST.IfBlock(
      start,
      condition,
      block,
      new Span(start.start, block.span.end)
    ),
    elseIfBlocks,
    elseBlock,
    new Span(start.start, end)
  );
}

function parseElseIfBlocks(parser: Parser): AST.ElseIfBlock[] {
  const elseIfBlocks: AST.ElseIfBlock[] = [];

  while (parser.token().kind === TokenKind.ElseKeyword) {
    const block = parseElseIfBlock(parser);
    if (block === undefined) break;
    elseIfBlocks.push(block);
  }

  return elseIfBlocks;
}

function parseElseBlock(parser: Parser): AST.ElseBlock | undefined {
  const elseKeyword = parser.consumeTokenIf(TokenKind.ElseKeyword);
  if (elseKeyword === undefined) return undefined;

  parser.skipWhitespace();
  const block = parseBlock(parser);
  return new AST.ElseBlock(
    elseKeyword.span,
    block,
    new Span(elseKeyword.span.start, block.span.end)
  );
}

function parseElseIfBlock(parser: Parser): AST.ElseIfBlock | undefined {
  const elseKeyword = parser.consumeToken(TokenKind.ElseKeyword);
  parser.skipWhitespace();
  const ifKeyword = parser.consumeTokenIf(TokenKind.IfKeyword);
  if (ifKeyword === undefined) return undefined;

  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const condition = parseExpression(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.CloseParen);
  parser.skipWhitespace();
  const block = parseBlock(parser);
  return new AST.ElseIfBlock(
    elseKeyword.span,
    ifKeyword.span,
    condition,
    block,
    new Span(elseKeyword.span.start, block.span.end)
  );
}

function parseExpression(parser: Parser): AST.Expression {
  const token = parser.token();

  // TOOD: Support Unary expressions

  switch (token.kind) {
    case TokenKind.Identifier:
      return parseExpressionFromIdentifier(parser);
    case TokenKind.StringLiteral:
      return parseExpressionFromStringLiteral(parser);
    case TokenKind.NumberLiteral:
      return parseExpressionFromNumberLiteral(parser);
    case TokenKind.BooleanLiteral:
      return parseExpressionFromBooleanLiteral(parser);
    case TokenKind.OpenBrace:
      return parseExpressionFromOpenBrace(parser);
    case TokenKind.OpenBracket:
      return parseExpressionFromOpenBracket(parser);
    case TokenKind.OpenParen:
      return parseExpressionFromOpenParen(parser);
    default:
      throw new Error(
        `Unexpected token in expression: ${token.kind} :: ${token.text}`
      );
  }
}

function parseExpressionFromIdentifier(parser: Parser): AST.Expression {
  // TODO: Supoort member expressions
  // TODO: Support function calls

  const identifier = consumeIdentifier(parser);
  parser.skipWhitespace();
  const operator = parseOperator(parser);
  parser.skipWhitespace();

  if (operator === undefined) return identifier;

  const nextExpression = parseExpression(parser);
  parser.skipWhitespace();

  return new AST.BinaryExpression(
    operator,
    identifier,
    nextExpression,
    new Span(identifier.span.start, nextExpression.span.end)
  );
}

// TODO: Support additional operators types
function parseOperator(parser: Parser): AST.Operator | undefined {
  const token = parser.consumeTokenIf(
    TokenKind.Plus,
    TokenKind.Minus,
    TokenKind.Asterisk,
    TokenKind.ForwardSlash
  );
  if (token === undefined) return undefined;

  switch (token.kind) {
    case TokenKind.Plus:
      return new AST.Operator(AST.OperatorKind.Add, token.span);
    case TokenKind.Minus:
      return new AST.Operator(AST.OperatorKind.Subtract, token.span);
    case TokenKind.Asterisk:
      return new AST.Operator(AST.OperatorKind.Multiply, token.span);
    case TokenKind.ForwardSlash:
      return new AST.Operator(AST.OperatorKind.Divide, token.span);
  }
}

function parseExpressionFromStringLiteral(parser: Parser): AST.StringLiteral {
  const token = parser.consumeToken(TokenKind.StringLiteral);
  return new AST.StringLiteral(token.text, token.span);
}

function parseExpressionFromNumberLiteral(parser: Parser): AST.NumberLiteral {
  const token = parser.consumeToken(TokenKind.NumberLiteral);
  return new AST.NumberLiteral(Number(token.text), token.span);
}

function parseExpressionFromBooleanLiteral(parser: Parser): AST.BooleanLiteral {
  const token = parser.consumeToken(TokenKind.BooleanLiteral);
  return new AST.BooleanLiteral(token.text === "true", token.span);
}

function parseExpressionFromOpenBrace(parser: Parser): AST.RecordLiteral {
  const start = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const [fields, end] = parseRecordFields(
    parser,
    [TokenKind.Comma],
    TokenKind.CloseBrace
  );
  return new AST.RecordLiteral(
    fields,
    new Span(start.span.start, end.span.end)
  );
}

function parseRecordFields(
  parser: Parser,
  separators: readonly TokenKind[],
  terminator: TokenKind
): readonly [AST.RecordField[], Token] {
  const fields: AST.RecordField[] = [];
  do {
    parser.skipWhitespace();
    fields.push(parseRecordField(parser));
    parser.skipWhitespace();
  } while (separators.some((kind) => parser.consumeTokenIf(kind)));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [fields, end];
}

function parseRecordField(parser: Parser): AST.RecordField {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.Colon);
  parser.skipWhitespace();
  const value = parseExpression(parser);
  parser.skipWhitespace();
  return new AST.RecordField(name, value, new Span(name.span.start, value.span.end));
}

function parseExpressionFromOpenBracket(parser: Parser): AST.ArrayLiteral {
  const start = parser.consumeToken(TokenKind.OpenBracket);
  parser.skipWhitespace();
  const [values, end] = parseExpressions(
    parser,
    TokenKind.Comma,
    TokenKind.CloseBracket
  );
  return new AST.ArrayLiteral(values, new Span(start.span.start, end.span.end));
}

function parseExpressions(
  parser: Parser,
  separator: TokenKind,
  terminator: TokenKind
): readonly [AST.Expression[], Token] {
  const expressions: AST.Expression[] = [];
  do {
    parser.skipWhitespace();
    expressions.push(parseExpression(parser));
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(separator));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [expressions, end];
}

function parseExpressionFromOpenParen(parser: Parser): AST.ParenthesizedExpression {
  // TODO: Support FunctionExpressions

  const openParen = parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const expression = parseExpression(parser);
  parser.skipWhitespace();
  const closeParen = parser.consumeToken(TokenKind.CloseParen);
  return new AST.ParenthesizedExpression(
    openParen.span,
    expression,
    closeParen.span,
    new Span(openParen.span.start, closeParen.span.end)
  );
}

function parseTypeClassDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.TypeClassDeclaration {
  parser.skipWhitespace();
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const typeParameters = parseTypeParameters(parser);
  parser.skipWhitespace();
  const openBrace = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  try {
    const [fields, closeBrace] = parseFields(parser, [TokenKind.Semicolon, TokenKind.Whitespace], TokenKind.CloseBrace);
    parser.skipWhitespace();
    return new AST.TypeClassDeclaration(
      name,
      typeParameters,
      openBrace.span,
      fields as readonly AST.NamedField[],
      closeBrace.span,
      new Span(exportKeyword ? exportKeyword.span.start : start, closeBrace.span.end),
      exportKeyword?.span
    );
  } catch { 
    const closeBrace = parser.consumeToken(TokenKind.CloseBrace);
    return new AST.TypeClassDeclaration(
      name,
      typeParameters,
      openBrace.span,
      [],
      closeBrace.span,
      new Span(exportKeyword ? exportKeyword.span.start : start, closeBrace.span.end),
      exportKeyword?.span
    );
  }
}
