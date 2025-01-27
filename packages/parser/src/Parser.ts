import * as AST from "./AST/index.js";
import { Span, SpanLocation } from "./Span";
import { Token, TokenKind } from "./Token.js";
import { tokenize } from "./Tokenizer.js";

class Parser {
  public pos = 0;
  constructor(readonly source: string, readonly tokens: readonly Token[]) {}

  get isEOF(): boolean {
    return this.pos >= this.tokens.length;
  }

  token(): Token {
    return this.tokens[this.pos];
  }

  peek(offset = 1): Token | undefined {
    return this.tokens[this.pos + offset];
  }

  previousToken(): Token {
    return this.tokens[this.pos - 1];
  }

  consume(): Token {
    return this.tokens[this.pos++];
  }

  consumeToken<const KINDS extends readonly TokenKind[]>(
    ...kinds: KINDS
  ): Token & { readonly kind: KINDS[number] } {
    const token = this.token();

    if (token && kinds.includes(token.kind)) {
      return this.consume() as Extract<Token, { readonly kind: KINDS[number] }>;
    }

    throw new Error(
      `Expected token of kind ${kinds.join(", ")} but got ${token.kind}:: ${
        token.text
      } at ${JSON.stringify(this.source.slice(token.span.start.position))}`
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
  const parser = new Parser(source, tokens);
  const statements: AST.Statement[] = [];

  while (!parser.isEOF) {
    parser.skipWhitespace();
    statements.push(parseStatement(parser));
    parser.skipWhitespace();
  }

  return new AST.SourceFile(
    fileName,
    source,
    statements,
    new Span(tokens[0].span.start, tokens[tokens.length - 1].span.end)
  );
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
      const variance = parseVarianceAnnotation(parser);
      const name = parser.consumeToken(TokenKind.Identifier);
      parser.skipWhitespace();
      const constraint = parseTypeConstraint(parser);
      typeParameters.push(
        new AST.TypeParameter(
          new AST.Identifier(name.text, name.span),
          constraint,
          name.span,
          variance
        )
      );
    } while (parser.consumeTokenIf(TokenKind.Comma));
    parser.skipWhitespace();
    parser.consumeToken(TokenKind.GreaterThan);
  }
  return typeParameters;
}

function parseVarianceAnnotation(
  parser: Parser
): "in" | "out" | "in out" | undefined {
  parser.skipWhitespace();
  const next = parser.token();

  if (next?.kind === TokenKind.Identifier) {
    if (next.text === "in") {
      parser.skipWhitespace();

      const next2 = parser.token();
      if (next2?.kind === TokenKind.Identifier && next2.text === "out") {
        parser.pos++;
        parser.skipWhitespace();
        return "in out";
      }

      return "in";
    } else if (next.text === "out") {
      parser.pos++;
      parser.skipWhitespace();
      return "out";
    }
  }
}

function parseTypeParametersOrHigherKindedType(
  parser: Parser
): Array<AST.TypeParameter | AST.HigherKindedType> {
  const typeParameters: Array<AST.TypeParameter | AST.HigherKindedType> = [];
  if (parser.consumeTokenIf(TokenKind.LessThan)) {
    do {
      parser.skipWhitespace();
      const variance = parseVarianceAnnotation(parser);
      const name = parser.consumeToken(
        TokenKind.Identifier,
        TokenKind.Underscore
      );

      parser.skipWhitespace();
      if (parser.token().kind === TokenKind.LessThan) {
        parser.skipWhitespace();
        const parameters = parseTypeParametersOrHigherKindedType(parser);
        parser.skipWhitespace();
        const constraint = parseTypeConstraint(parser);
        typeParameters.push(
          new AST.HigherKindedType(
            new AST.Identifier(name.text, name.span),
            parameters,
            constraint,
            new Span(
              name.span.start,
              constraint?.span.end ??
                parameters[parameters.length - 1]?.span.end ??
                name.span.end
            )
          )
        );
      } else {
        const constraint = parseTypeConstraint(parser);
        typeParameters.push(
          new AST.TypeParameter(
            new AST.Identifier(name.text, name.span),
            constraint,
            new Span(name.span.start, constraint?.span.end ?? name.span.end),
            variance
          )
        );
      }
      parser.skipWhitespace();
    } while (parser.consumeTokenIf(TokenKind.Comma, TokenKind.Whitespace));

    parser.skipWhitespace();
    parser.consumeToken(TokenKind.GreaterThan);
  }
  return typeParameters;
}

function parseTypeConstraint(parser: Parser): AST.Type | undefined {
  if (parser.consumeTokenIf(TokenKind.ExtendsKeyword)) {
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
    const [fields, end] = parseNamedFields(
      parser,
      [TokenKind.Semicolon, TokenKind.Whitespace],
      TokenKind.CloseBrace
    );
    return new AST.RecordConstructor(
      name,
      fields,
      new Span(name.span.start, end.span.end)
    );
  }

  return new AST.VoidConstructor(name, name.span);
}

function consumeIdentifier(parser: Parser): AST.Identifier {
  parser.skipWhitespace();
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

function consumeIdentifierOrMemberExpression(
  parser: Parser
): AST.Identifier | AST.MemberExpression {
  return consumeMemberExpressionFromIdentifier(
    parser,
    consumeIdentifier(parser)
  );
}

function consumeMemberExpressionFromIdentifier(
  parser: Parser,
  object: AST.Identifier | AST.MemberExpression
): AST.Identifier | AST.MemberExpression {
  const questionMark = parser.consumeTokenIf(TokenKind.QuestionMark);
  const dot = parser.consumeTokenIf(TokenKind.Period);
  if (dot === undefined) return object;
  const property = consumeAsIdentifier(parser);

  return new AST.MemberExpression(
    object,
    questionMark?.span ?? null,
    dot.span,
    property,
    new Span(object.span.start, property.span.end)
  );
}

function consumeAsIdentifier(parser: Parser): AST.Identifier {
  const nextToken = parser.consume();
  return new AST.Identifier(nextToken.text, nextToken.span);
}

function parseNamedFields(
  parser: Parser,
  separators: readonly TokenKind[],
  terminator: TokenKind
): readonly [AST.NamedField[], Token] {
  const fields: AST.NamedField[] = [];
  do {
    parser.skipWhitespace();
    fields.push(parseNamedField(parser));
    parser.skipWhitespace();
  } while (separators.some((kind) => parser.consumeTokenIf(kind)));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [fields, end];
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

  if (parser.consumeTokenIf(TokenKind.Colon)) {
    parser.skipWhitespace();

    const type = parseType(parser);
    parser.skipWhitespace();
    return new AST.NamedField(
      name,
      type,
      new Span(name.span.start, type.span.end)
    );
  }
  return new AST.NamedField(name, undefined, name.span);
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
  const [fields, end] = parseNamedFields(
    parser,
    [TokenKind.Semicolon, TokenKind.Whitespace],
    TokenKind.CloseBrace
  );
  return new AST.RecordType(fields, new Span(start.span.start, end.span.end));
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
  parser.skipWhitespace();
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
  const typeParams = parseTypeParametersOrHigherKindedType(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const [fields] = parseNamedFields(
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
    fields,
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

function parseStatement(parser: Parser): AST.Statement {
  const exportKeyword = parser.consumeTokenIf(TokenKind.ExportKeyword);
  if (exportKeyword) {
    parser.skipWhitespace();
  }

  const current = parser.consumeTokenIf(
    TokenKind.FunctionKeyword,
    TokenKind.ConstKeyword,
    TokenKind.LetKeyword,
    TokenKind.VarKeyword,
    TokenKind.IfKeyword,
    TokenKind.Comment,
    TokenKind.ReturnKeyword,
    TokenKind.OpenParen,
    TokenKind.ForKeyword,
    TokenKind.DataKeyword,
    TokenKind.TypeKeyword,
    TokenKind.BrandKeyword,
    TokenKind.TypeClassKeyword,
    TokenKind.InstanceKeyword,
    TokenKind.ImportKeyword
  );

  if (current === undefined) {
    throw new Error(
      `Unexpected token in block: ${parser.token().kind} :: ${
        parser.token().text
      } at position ${parser.source.slice(parser.token().span.start.position)}`
    );
  }

  switch (current.kind) {
    case TokenKind.FunctionKeyword:
      return parseFunctionDeclaration(parser, current.span.start, undefined);
    case TokenKind.ConstKeyword:
    case TokenKind.LetKeyword:
    case TokenKind.VarKeyword:
      return parseVariableDeclaration(
        parser,
        current as Token & {
          kind:
            | TokenKind.ConstKeyword
            | TokenKind.LetKeyword
            | TokenKind.VarKeyword;
        },
        exportKeyword
      );
    case TokenKind.IfKeyword:
      return parseIfStatement(parser, current.span);
    case TokenKind.Comment:
      return new AST.Comment(current.text, current.span);
    case TokenKind.ReturnKeyword: {
      parser.skipWhitespace();
      const expr = parseBinaryExpression(parser);
      return new AST.ReturnStatement(
        current.span,
        expr,
        new Span(current.span.start, expr.span.end)
      );
    }
    case TokenKind.ForKeyword:
      return parseForStatement(parser, current.span);
    case TokenKind.DataKeyword:
      return parseDataDeclaration(parser, current.span.start, exportKeyword);
    case TokenKind.TypeKeyword:
      return parseTypeAlias(parser, current.span.start, exportKeyword);
    case TokenKind.BrandKeyword:
      return parseBrandDeclaration(parser, current.span.start, exportKeyword);
    case TokenKind.TypeClassKeyword:
      return parseTypeClassDeclaration(
        parser,
        current.span.start,
        exportKeyword
      );
    case TokenKind.InstanceKeyword:
      return parseInstanceDeclaration(
        parser,
        current.span.start,
        exportKeyword
      );
    case TokenKind.ImportKeyword:
      return parseImportDeclaration(parser, current.span.start);
    default:
      throw new Error(
        `Unexpected token in block: ${current.kind} :: ${
          current.text
        } at position ${parser.source.slice(
          parser.token().span.start.position - 1
        )}`
      );
  }
}

function parseForStatement(
  parser: Parser,
  start: Span
): AST.ForInStatement | AST.ForOfStatement {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  const variable = parser.consumeToken(
    TokenKind.ConstKeyword,
    TokenKind.LetKeyword,
    TokenKind.VarKeyword
  );
  parser.skipWhitespace();
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const inOrOf = parser.consumeToken(TokenKind.InKeyword, TokenKind.OfKeyword);
  parser.skipWhitespace();
  const object = parseBinaryExpression(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.CloseParen);
  parser.skipWhitespace();
  const block = parseBlock(parser);

  if (inOrOf.kind === TokenKind.InKeyword) {
    return new AST.ForInStatement(
      start,
      [variable.kind, variable.span],
      name,
      object,
      block,
      new Span(start.start, block.span.end)
    );
  } else {
    return new AST.ForOfStatement(
      start,
      [variable.kind, variable.span],
      name,
      object,
      block,
      new Span(start.start, block.span.end)
    );
  }
}

function parseVariableDeclaration(
  parser: Parser,
  keyword: Token & {
    kind: TokenKind.ConstKeyword | TokenKind.LetKeyword | TokenKind.VarKeyword;
  },
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
  const value = parseBinaryExpression(parser);
  parser.skipWhitespace();
  return new AST.VariableDeclaration(
    [keyword.kind, keyword.span],
    name,
    type,
    equals.span,
    value,
    new Span(
      exportKeyword ? exportKeyword.span.start : keyword.span.start,
      value.span.end
    ),
    exportKeyword?.span
  );
}

function parseIfStatement(parser: Parser, start: Span): AST.IfStatement {
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const condition = parseBinaryExpression(parser);
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
  const condition = parseBinaryExpression(parser);
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

function parseUnaryExpression(parser: Parser): AST.Expression {
  const operator = parseUnaryOperator(parser);
  if (operator) {
    parser.skipWhitespace();
    const expression = parseUnaryExpression(parser);
    return new AST.UnaryExpression(
      operator,
      expression,
      new Span(operator.span.start, expression.span.end)
    );
  }
  return parsePrimaryExpression(parser);
}

function parsePrimaryExpression(parser: Parser): AST.Expression {
  const token = parser.token();

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
    case TokenKind.LessThan:
      return parseExpressionFromLessThan(parser);
    case TokenKind.MatchKeyword:
      return parseExpressionFromMatchKeyword(parser);
    default: {
      const unaryOperator = parseUnaryOperator(parser);
      if (unaryOperator) {
        parser.skipWhitespace();
        const expression = parsePrimaryExpression(parser);
        return new AST.UnaryExpression(
          unaryOperator,
          expression,
          new Span(unaryOperator.span.start, expression.span.end)
        );
      }

      throw new Error(
        `Unexpected token in expression: ${token.kind} :: ${
          token.text
        } at position ${parser.source.slice(
          parser.token().span.start.position
        )}`
      );
    }
  }
}

function parseUnaryOperator(parser: Parser): AST.Operator | undefined {
  const token = parser.consumeTokenIf(
    TokenKind.Plus,
    TokenKind.Minus,
    TokenKind.Exclamation,
    TokenKind.Tilde,
    TokenKind.NewKeyword
  );
  if (token === undefined) return undefined;

  switch (token.kind) {
    case TokenKind.Plus:
      return new AST.Operator(AST.OperatorKind.Add, token.span);
    case TokenKind.Minus:
      return new AST.Operator(AST.OperatorKind.Subtract, token.span);
    case TokenKind.Exclamation:
      return new AST.Operator(AST.OperatorKind.Not, token.span);
    case TokenKind.Tilde:
      return new AST.Operator(AST.OperatorKind.BitwiseNot, token.span);
    case TokenKind.NewKeyword:
      return new AST.Operator(AST.OperatorKind.New, token.span);
  }
}

function getPrecedence(operator: AST.Operator): number {
  switch (operator.kind) {
    case AST.OperatorKind.Or:
      return 1;
    case AST.OperatorKind.LogicalAnd:
      return 2;
    case AST.OperatorKind.BitwiseOr:
      return 3;
    case AST.OperatorKind.BitwiseXor:
      return 4;
    case AST.OperatorKind.BitwiseAnd:
      return 5;
    case AST.OperatorKind.Equal:
    case AST.OperatorKind.NotEqual:
      return 6;
    case AST.OperatorKind.LessThan:
    case AST.OperatorKind.LessThanOrEqual:
    case AST.OperatorKind.GreaterThan:
    case AST.OperatorKind.GreaterThanOrEqual:
      return 7;
    case AST.OperatorKind.LeftShift:
    case AST.OperatorKind.RightShift:
    case AST.OperatorKind.UnsignedRightShift:
      return 8;
    case AST.OperatorKind.Add:
    case AST.OperatorKind.Subtract:
      return 9;
    case AST.OperatorKind.Multiply:
    case AST.OperatorKind.Divide:
    case AST.OperatorKind.Modulo:
      return 10;
    case AST.OperatorKind.And:
      return 11;
    default:
      return 0;
  }
}

function isRightAssociative(operator: AST.Operator): boolean {
  return operator.kind === AST.OperatorKind.Exponent;
}

function parseBinaryExpression(
  parser: Parser,
  minPrecedence = 0
): AST.Expression {
  parser.skipWhitespace();
  let left = parseUnaryExpression(parser);

  while (true) {
    const operator = parseOperator(parser);
    if (!operator || getPrecedence(operator) < minPrecedence) {
      return left;
    }

    const nextMinPrecedence = isRightAssociative(operator)
      ? getPrecedence(operator)
      : getPrecedence(operator) + 1;

    parser.skipWhitespace();
    const right = parseBinaryExpression(parser, nextMinPrecedence);

    left = new AST.BinaryExpression(
      operator,
      left,
      right,
      new Span(left.span.start, right.span.end)
    );
  }
}

function parseExpressionFromIdentifier(parser: Parser): AST.Expression {
  const identifier = consumeIdentifierOrMemberExpression(parser);
  parser.skipWhitespace();

  const typeArguments = parseTypeArguments(parser);
  if (parser.consumeTokenIf(TokenKind.OpenParen)) {
    const [params, close] = parseExpressions(
      parser,
      TokenKind.Comma,
      TokenKind.CloseParen
    );
    return new AST.FunctionCall(
      identifier,
      typeArguments,
      params,
      new Span(identifier.span.start, close.span.end)
    );
  }

  const operator = parseOperator(parser);
  parser.skipWhitespace();
  if (operator === undefined) return identifier;

  const nextExpression = parsePrimaryExpression(parser);
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
    TokenKind.ForwardSlash,
    TokenKind.Percent,
    TokenKind.Caret,
    TokenKind.Pipe,
    TokenKind.Ampersand,
    TokenKind.EqualSign,
    TokenKind.Exclamation,
    TokenKind.LessThan,
    TokenKind.GreaterThan,
    TokenKind.Tilde,
    TokenKind.QuestionMark,
    TokenKind.Colon,
    TokenKind.InKeyword,
    TokenKind.InstanceOfKeyword,
    TokenKind.NewKeyword
  );
  if (token === undefined) return undefined;

  switch (token.kind) {
    case TokenKind.Plus:
      return new AST.Operator(AST.OperatorKind.Add, token.span);
    case TokenKind.Minus:
      return new AST.Operator(AST.OperatorKind.Subtract, token.span);
    case TokenKind.Asterisk:
      if (parser.consumeTokenIf(TokenKind.Asterisk)) {
        return new AST.Operator(
          AST.OperatorKind.Exponent,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.Multiply, token.span);
    case TokenKind.ForwardSlash:
      return new AST.Operator(AST.OperatorKind.Divide, token.span);
    case TokenKind.Percent:
      return new AST.Operator(AST.OperatorKind.Modulo, token.span);
    case TokenKind.Caret:
      return new AST.Operator(AST.OperatorKind.BitwiseXor, token.span);
    case TokenKind.Pipe:
      if (parser.consumeTokenIf(TokenKind.Pipe)) {
        return new AST.Operator(
          AST.OperatorKind.Or,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.BitwiseOr, token.span);
    case TokenKind.Ampersand:
      if (parser.consumeTokenIf(TokenKind.Ampersand)) {
        return new AST.Operator(
          AST.OperatorKind.And,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.BitwiseAnd, token.span);
    case TokenKind.EqualSign:
      if (parser.consumeTokenIf(TokenKind.EqualSign)) {
        if (parser.consumeTokenIf(TokenKind.EqualSign)) {
          return new AST.Operator(
            AST.OperatorKind.EqualEqualEqual,
            new Span(token.span.start, parser.previousToken().span.end)
          );
        }
        return new AST.Operator(
          AST.OperatorKind.EqualEqual,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.Equal, token.span);
    case TokenKind.Exclamation:
      if (parser.consumeTokenIf(TokenKind.EqualSign)) {
        if (parser.consumeTokenIf(TokenKind.EqualSign)) {
          return new AST.Operator(
            AST.OperatorKind.NotEqualEqual,
            new Span(token.span.start, parser.previousToken().span.end)
          );
        }
        return new AST.Operator(
          AST.OperatorKind.NotEqual,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.Not, token.span);
    case TokenKind.LessThan:
      if (parser.consumeTokenIf(TokenKind.EqualSign)) {
        return new AST.Operator(
          AST.OperatorKind.LessThanOrEqual,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      if (parser.consumeTokenIf(TokenKind.LessThan)) {
        return new AST.Operator(
          AST.OperatorKind.LeftShift,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.LessThan, token.span);
    case TokenKind.GreaterThan:
      if (parser.consumeTokenIf(TokenKind.EqualSign)) {
        return new AST.Operator(
          AST.OperatorKind.GreaterThanOrEqual,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      if (parser.consumeTokenIf(TokenKind.GreaterThan)) {
        if (parser.consumeTokenIf(TokenKind.GreaterThan)) {
          return new AST.Operator(
            AST.OperatorKind.UnsignedRightShift,
            new Span(token.span.start, parser.previousToken().span.end)
          );
        }
        return new AST.Operator(
          AST.OperatorKind.RightShift,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.GreaterThan, token.span);
    case TokenKind.Tilde:
      return new AST.Operator(AST.OperatorKind.BitwiseNot, token.span);
    case TokenKind.QuestionMark:
      if (parser.consumeTokenIf(TokenKind.QuestionMark)) {
        return new AST.Operator(
          AST.OperatorKind.NullishCoalescing,
          new Span(token.span.start, parser.previousToken().span.end)
        );
      }
      return new AST.Operator(AST.OperatorKind.TernaryIf, token.span);
    case TokenKind.Colon:
      return new AST.Operator(AST.OperatorKind.TernaryElse, token.span);
    case TokenKind.InKeyword:
      return new AST.Operator(AST.OperatorKind.In, token.span);
    case TokenKind.InstanceOfKeyword:
      return new AST.Operator(AST.OperatorKind.InstanceOf, token.span);
    case TokenKind.NewKeyword:
      return new AST.Operator(AST.OperatorKind.New, token.span);
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
    [TokenKind.Comma, TokenKind.Whitespace],
    TokenKind.CloseBrace
  );
  return new AST.RecordLiteral(
    fields,
    new Span(start.span.start, end.span.end)
  );
}

function parseExpressionFromMatchKeyword(parser: Parser): AST.Expression {
  const matchKeyword = parser.consumeToken(TokenKind.MatchKeyword);
  parser.skipWhitespace();
  const expression = parsePrimaryExpression(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const cases = parseMatchCases(parser);
  parser.skipWhitespace();
  const closeBrace = parser.consumeToken(TokenKind.CloseBrace);
  return new AST.MatchExpression(
    expression,
    cases,
    new Span(matchKeyword.span.start, closeBrace.span.end)
  );
}

function parseMatchCases(parser: Parser): readonly AST.MatchCase[] {
  const cases: AST.MatchCase[] = [];
  while (parser.token().kind !== TokenKind.CloseBrace) {
    const pattern = parsePattern(parser);
    parser.skipWhitespace();
    parser.consumeToken(TokenKind.Hyphen);
    parser.consumeToken(TokenKind.GreaterThan);
    parser.skipWhitespace();
    const body = parseBlockOrExpression(parser);
    cases.push(
      new AST.MatchCase(
        pattern,
        body,
        new Span(pattern.span.start, body.span.end)
      )
    );
  }

  return cases;
}

function parsePattern(parser: Parser): AST.Pattern {
  const identifier = parser.consumeTokenIf(TokenKind.Identifier);
  if (identifier !== undefined) {
    return new AST.Identifier(identifier.text, identifier.span);
  }

  const literal = parser.consumeTokenIf(
    TokenKind.StringLiteral,
    TokenKind.BooleanLiteral,
    TokenKind.NumberLiteral
  );
  if (literal !== undefined) {
    switch (literal.kind) {
      case TokenKind.StringLiteral:
        return new AST.StringLiteral(literal.text, literal.span);
      case TokenKind.BooleanLiteral:
        return new AST.BooleanLiteral(literal.text === "true", literal.span);
      case TokenKind.NumberLiteral:
        return new AST.NumberLiteral(Number(literal.text), literal.span);
    }
  }

  const openBracket = parser.consumeTokenIf(TokenKind.OpenBracket);
  if (openBracket !== undefined) {
    const [patterns, closeBracket] = parsePatternsSeparatedBy(
      parser,
      TokenKind.Comma,
      TokenKind.CloseBracket
    );

    return new AST.ArrayPattern(
      patterns,
      new Span(openBracket.span.start, closeBracket.span.end)
    );
  }

  throw new Error("Invalid pattern: " + parser.source.slice(parser.pos));
}

function parsePatternsSeparatedBy<EndToken extends TokenKind>(
  parser: Parser,
  separator: TokenKind,
  endToken: EndToken
): readonly [readonly AST.Pattern[], Token & { kind: typeof endToken }] {
  const patterns: AST.Pattern[] = [];

  const ending = parser.consumeTokenIf(endToken);
  if (ending !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [patterns, ending as any];
  }

  do {
    parser.skipWhitespace();
    patterns.push(parsePattern(parser));
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(separator));
  parser.skipWhitespace();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [patterns, parser.consumeToken(endToken) as any];
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
  const value = parsePrimaryExpression(parser);
  parser.skipWhitespace();
  return new AST.RecordField(
    name,
    value,
    new Span(name.span.start, value.span.end)
  );
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
    expressions.push(parsePrimaryExpression(parser));
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(separator));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [expressions, end];
}

function parseExpressionFromOpenParen(parser: Parser): AST.Expression {
  const openParen = parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();

  // Lambda expression
  if (parser.token().kind === TokenKind.CloseParen) {
    parser.consumeToken(TokenKind.CloseParen);
    parser.skipWhitespace();
    const returnType = parseReturnType(parser);
    parser.skipWhitespace();
    parseFatArrow(parser);
    parser.skipWhitespace();
    const block = parseBlockOrExpression(parser);

    return new AST.FunctionExpression(
      null,
      [],
      [],
      returnType,
      block,
      new Span(openParen.span.start, block.span.end)
    );
  }

  const isProbablyNamedFields =
    parser.token().kind === TokenKind.Identifier &&
    (parser.peek(1)?.kind === TokenKind.CloseParen ||
      parser.peek(1)?.kind === TokenKind.Colon ||
      parser.peek(2)?.kind === TokenKind.Colon);

  if (isProbablyNamedFields) {
    const [fields] = parseNamedFields(
      parser,
      [TokenKind.Comma, TokenKind.Whitespace],
      TokenKind.CloseParen
    );

    if (fields.length > 0) {
      parser.skipWhitespace();
      const returnType = parseReturnType(parser);
      parser.skipWhitespace();
      parseFatArrow(parser);
      parser.skipWhitespace();
      const block = parseBlockOrExpression(parser);

      return new AST.FunctionExpression(
        null,
        [],
        fields,
        returnType,
        block,
        new Span(openParen.span.start, block.span.end)
      );
    }
  }

  const expression = parseBinaryExpression(parser);
  parser.skipWhitespace();
  const closeParen = parser.consumeToken(TokenKind.CloseParen);
  parser.skipWhitespace();

  const parenthesizedExpression = new AST.ParenthesizedExpression(
    openParen.span,
    expression,
    closeParen.span,
    new Span(openParen.span.start, closeParen.span.end)
  );

  return parenthesizedExpression;
}

function parseExpressionFromLessThan(parser: Parser): AST.FunctionExpression {
  const typeParameters = parseTypeParametersOrHigherKindedType(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.OpenParen);
  parser.skipWhitespace();
  const [fields] = parseNamedFields(
    parser,
    [TokenKind.Comma, TokenKind.Whitespace],
    TokenKind.CloseParen
  );
  parser.skipWhitespace();
  const returnType = parseReturnType(parser);
  parser.skipWhitespace();
  parseFatArrow(parser);
  parser.skipWhitespace();

  const block = parseBlockOrExpression(parser);

  return new AST.FunctionExpression(
    null,
    typeParameters,
    fields,
    returnType,
    block,
    new Span(typeParameters[0].span.start, block.span.end)
  );
}

function parseFatArrow(parser: Parser) {
  parser.consumeToken(TokenKind.EqualSign);
  parser.consumeToken(TokenKind.GreaterThan);
}

function parseReturnType(parser: Parser): AST.Type | null {
  if (parser.consumeTokenIf(TokenKind.Colon)) {
    parser.skipWhitespace();
    return parseType(parser);
  }
  return null;
}

function parseBlockOrExpression(parser: Parser): AST.Block | AST.Expression {
  if (parser.token().kind === TokenKind.OpenBrace) {
    return parseBlock(parser);
  }

  return parseBinaryExpression(parser);
}

function parseTypeClassDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.TypeClassDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const typeParameters = parseTypeParametersOrHigherKindedType(parser);
  parser.skipWhitespace();
  const openBrace = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const fields: AST.NamedField[] = [];

  if (parser.token().kind === TokenKind.CloseBrace) {
    const closeBrace = parser.consumeToken(TokenKind.CloseBrace);
    parser.skipWhitespace();
    return new AST.TypeClassDeclaration(
      name,
      typeParameters,
      openBrace.span,
      fields,
      closeBrace.span,
      new Span(
        exportKeyword ? exportKeyword.span.start : start,
        closeBrace.span.end
      ),
      exportKeyword?.span
    );
  }

  do {
    parser.skipWhitespace();
    const name = consumeIdentifier(parser);
    parser.consumeToken(TokenKind.Colon);
    parser.skipWhitespace();
    const type = parseType(parser);
    const field = new AST.NamedField(
      name,
      type,
      new Span(name.span.start, type.span.end)
    );
    fields.push(field);
    parser.skipWhitespace();
  } while (parser.consumeTokenIf(TokenKind.Comma, TokenKind.Whitespace));
  parser.skipWhitespace();
  const closeBrace = parser.consumeToken(TokenKind.CloseBrace);
  parser.skipWhitespace();
  return new AST.TypeClassDeclaration(
    name,
    typeParameters,
    openBrace.span,
    fields,
    closeBrace.span,
    new Span(
      exportKeyword ? exportKeyword.span.start : start,
      closeBrace.span.end
    ),
    exportKeyword?.span
  );
}

function parseInstanceDeclaration(
  parser: Parser,
  start: SpanLocation,
  exportKeyword: Token | undefined
): AST.InstanceDeclaration {
  const name = consumeIdentifier(parser);
  parser.skipWhitespace();
  const typeParameters = parseTypeParametersOrHigherKindedType(parser);
  parser.skipWhitespace();
  const openBrace = parser.consumeToken(TokenKind.OpenBrace);
  parser.skipWhitespace();
  const [fields, closeBrace] = parseInstanceFields(
    parser,
    [TokenKind.Comma, TokenKind.Whitespace],
    TokenKind.CloseBrace
  );
  parser.skipWhitespace();
  return new AST.InstanceDeclaration(
    name,
    typeParameters,
    openBrace.span,
    fields,
    closeBrace.span,
    new Span(
      exportKeyword ? exportKeyword.span.start : start,
      closeBrace.span.end
    ),
    exportKeyword?.span
  );
}

function parseInstanceFields(
  parser: Parser,
  separators: readonly TokenKind[],
  terminator: TokenKind
): readonly [AST.InstanceField[], Token] {
  const fields: AST.InstanceField[] = [];
  do {
    parser.skipWhitespace();
    fields.push(parseInstanceField(parser));
    parser.skipWhitespace();
  } while (separators.some((kind) => parser.consumeTokenIf(kind)));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [fields, end];
}

function parseInstanceField(parser: Parser): AST.InstanceField {
  const identifer = consumeIdentifier(parser);
  parser.skipWhitespace();
  parser.consumeToken(TokenKind.Colon);
  parser.skipWhitespace();
  const expression = parseBinaryExpression(parser);

  return new AST.InstanceField(
    identifer,
    expression,
    new Span(identifer.span.start, expression.span.end)
  );
}

function parseImportDeclaration(
  parser: Parser,
  start: SpanLocation
): AST.ImportDeclaration {
  parser.skipWhitespace();
  const isNamespace = parser.consumeTokenIf(TokenKind.Asterisk);
  parser.skipWhitespace();

  if (isNamespace) {
    const name = consumeIdentifier(parser);
    parser.skipWhitespace();
    parser.consumeToken(TokenKind.FromKeyword);
    parser.skipWhitespace();
    const moduleName = parser.consumeTokenIf(TokenKind.StringLiteral);
    if (moduleName === undefined) {
      throw new Error(
        `Expected module name in import declaration at position ${parser.source.slice(
          parser.token().span.start.position
        )}`
      );
    }
    parser.skipWhitespace();
    parser.consumeTokenIf(TokenKind.Semicolon);
    parser.skipWhitespace();

    return new AST.ImportDeclaration(
      new AST.NamespaceImport(name, name.span),
      new AST.StringLiteral(moduleName.text, moduleName.span),
      new Span(start, moduleName.span.end)
    );
  } else {
    parser.consumeToken(TokenKind.OpenBrace);
    parser.skipWhitespace();
    const [fields] = parseNamedImports(
      parser,
      [TokenKind.Comma],
      TokenKind.CloseBrace
    );
    parser.skipWhitespace();

    parser.consumeToken(TokenKind.FromKeyword);
    parser.skipWhitespace();
    const moduleName = parser.consumeTokenIf(TokenKind.StringLiteral);
    if (moduleName === undefined) {
      throw new Error(
        `Expected module name in import declaration at position ${parser.source.slice(
          parser.token().span.start.position
        )}`
      );
    }
    parser.skipWhitespace();
    parser.consumeTokenIf(TokenKind.Semicolon);
    parser.skipWhitespace();

    return new AST.ImportDeclaration(
      new AST.NamedImports(
        fields,
        new Span(fields[0].span.start, fields[fields.length - 1].span.end)
      ),
      new AST.StringLiteral(moduleName.text, moduleName.span),
      new Span(start, moduleName.span.end)
    );
  }
}

function parseNamedImports(
  parser: Parser,
  separators: readonly TokenKind[],
  terminator: TokenKind
): readonly [AST.ImportSpecifier[], Token] {
  const fields: AST.ImportSpecifier[] = [];
  do {
    parser.skipWhitespace();
    fields.push(parseImportSpecifier(parser));
    parser.skipWhitespace();
  } while (separators.some((kind) => parser.consumeTokenIf(kind)));
  const end = parser.consumeToken(terminator);
  parser.skipWhitespace();
  return [fields, end];
}

function parseImportSpecifier(parser: Parser): AST.ImportSpecifier {
  const identifier = consumeIdentifier(parser);
  parser.skipWhitespace();
  if (parser.consumeTokenIf(TokenKind.AsKeyword)) {
    const alias = consumeIdentifier(parser);
    return new AST.ImportSpecifier(
      identifier,
      alias,
      new Span(identifier.span.start, alias.span.end)
    );
  }

  return new AST.ImportSpecifier(identifier, null, identifier.span);
}
