import {
  DataConstructor,
  DataDeclaration,
  Field,
  NamedField,
  RecordConstructor,
  RecordType,
  SourceFile,
  Statement,
  TupleConstructor,
  Type,
  TypeAlias,
  TypeField,
  TypeParameter,
  TypeReference,
  VoidConstructor,
} from "./AST.js";
import { Span, Token, TokenKind } from "./Token.js";
import { tokenize } from "./Tokenizer.js";

class Parser {
  private pos = 0;

  constructor(
    readonly fileName: string,
    readonly source: string,
    readonly tokens: ReadonlyArray<Token>
  ) {}

  parse() {
    return new SourceFile(this.fileName, this.source, this.parseStatements());
  }

  private parseStatements(): ReadonlyArray<Statement> {
    const statements: Statement[] = [];

    while (!this.isEOF()) {
      statements.push(this.parseStatement());
    }

    return statements;
  }

  private isEOF() {
    return this.pos >= this.tokens.length;
  }

  private parseStatement(): Statement {
    const token = this.current();

    switch (token.kind) {
      case TokenKind.DataKeyword:
        return this.parseDataDeclaration();
      case TokenKind.TypeKeyword:
        return this.parseTypeAlias();
      case TokenKind.Whitespace:
        this.skipWhitespace();
        return this.parseStatement();
      default:
        throw new Error(`Unexpected token: ${token.kind} :: ${token.text}`);
    }
  }

  private parseDataDeclaration(): DataDeclaration {
    const start = this.consumeToken(TokenKind.DataKeyword).span.start;
    this.skipWhitespace();
    const name = this.consumeToken(TokenKind.Identifier);
    const typeParameters = this.parseTypeParameters();

    this.skipWhitespace();
    const equals = this.consumeToken(TokenKind.EqualSign);
    this.skipWhitespace();

    const constructors = this.parseDataConstructors();
    const end = constructors[constructors.length - 1].span.end;
    this.skipWhitespace();

    return new DataDeclaration(
      name.text,
      typeParameters,
      constructors,
      new Span(start, end),
      name.span,
      equals.span,
    );
  }

  private parseTypeAlias(): TypeAlias {
    const start = this.consumeToken(TokenKind.TypeKeyword).span.start;
    this.skipWhitespace();
    const name = this.consumeToken(TokenKind.Identifier).text;
    const typeParameters = this.parseTypeParameters();

    this.skipWhitespace();
    this.consumeToken(TokenKind.EqualSign);
    this.skipWhitespace();

    const type = this.parseType();
    const end =
      this.current()?.span.start ??
      this.tokens[this.tokens.length - 1].span.end;
    return new TypeAlias(name, typeParameters, type, new Span(start, end));
  }

  private parseTypeParameters(): TypeParameter[] {
    const typeParameters: TypeParameter[] = [];

    if (this.consumeTokenIfKind(TokenKind.LessThan)) {
      this.skipWhitespace();

      let current = this.current();

      while (current.kind !== TokenKind.GreaterThan) {
        this.skipWhitespace();

        const identifier = this.consumeToken(TokenKind.Identifier);

        typeParameters.push(
          new TypeParameter(identifier.text, identifier.span)
        );
        current = this.current();

        if (current.kind === TokenKind.Comma) {
          this.consumeToken();
          current = this.current();
        }
      }
    }

    this.consumeToken();

    return typeParameters;
  }

  private parseDataConstructors(): DataConstructor[] {
    const constructors: DataConstructor[] = [];

    do {
      constructors.push(this.parseDataConstructor());
    } while (this.consumeTokenIfKind(TokenKind.Pipe));

    return constructors;
  }

  private parseDataConstructor(): DataConstructor {
    this.skipWhitespace();

    const start = this.current().span.start;
    const identifier = this.consumeToken(TokenKind.Identifier);
    const name = identifier.text;

    this.skipWhitespace();

    if (this.consumeTokenIfKind(TokenKind.OpenBrace)) {
      this.skipWhitespace();
      const fields = this.parseNamedFields();
      this.skipWhitespace();
      const end = this.consumeToken(TokenKind.CloseBrace).span.end;

      const constructor = new RecordConstructor(
        name,
        fields,
        new Span(start, end)
      );

      this.skipWhitespace();

      return constructor;
    } else if (this.consumeTokenIfKind(TokenKind.OpenParen)) {
      this.skipWhitespace();
      const fields = this.parseTupleFields();
      const end = this.consumeToken(TokenKind.CloseParen).span.end;

      const constructor = new TupleConstructor(
        name,
        fields,
        new Span(start, end)
      );

      this.skipWhitespace();

      return constructor;
    }

    const constructor = new VoidConstructor(
      name,
      new Span(start, identifier.span.end)
    );

    this.skipWhitespace();

    return constructor;
  }

  private parseTupleFields(): Field[] {
    const fields: Field[] = [];

    // There are 2 types of fields, named and unnamed fields

    let current = this.current();

    while (current.kind !== TokenKind.CloseParen) {
      if (current.kind === TokenKind.Whitespace) {
        this.consumeToken();
        current = this.current();
        continue;
      }

      const start = current.span.start;
      if (current.kind === TokenKind.Identifier) {
        const next = this.peek();

        if (next?.kind === TokenKind.Colon) {
          const name = this.consumeToken();
          this.consumeToken(TokenKind.Colon);
          const type = this.parseType();

          fields.push(
            new NamedField(name.text, type, new Span(start, type.span.end), name.span)
          );

          current = this.current();
        } else {
          const type = this.parseType();
          this.skipWhitespace();
          fields.push(new TypeField(type, type.span));
          current = this.current();
        }

        continue;
      }

      throw new Error(`Unexpected token: ${current.kind} :: ${current.text}`);
    }

    return fields;
  }

  private parseNamedFields(): NamedField[] {
    const fields: NamedField[] = [];
    this.skipWhitespace();

    let current = this.current();

    while (current.kind !== TokenKind.CloseBrace) {
      if (current.kind === TokenKind.Whitespace) {
        this.consumeToken();
        current = this.current();
        continue;
      }

      const start = current.span.start;
      const name = this.consumeToken(TokenKind.Identifier);
      this.skipWhitespace();
      this.consumeToken(TokenKind.Colon);
      this.skipWhitespace();
      const type = this.parseType();
      this.skipWhitespace();

      fields.push(new NamedField(name.text, type, new Span(start, type.span.end), name.span));
      current = this.current();
    }

    this.skipWhitespace();

    return fields;
  }

  private parseType(): Type {
    this.skipWhitespace();
    const current = this.current();
    const start = current.span.start;

    if (this.consumeTokenIfKind(TokenKind.Identifier)) {
      this.skipWhitespace();
      const name = current.text;
      const typeArguments = this.parseTypeArguments();
      const end =
        typeArguments.length > 0
          ? typeArguments[typeArguments.length - 1].span.end
          : current.span.end;
      this.skipWhitespace();

      return new TypeReference(name, typeArguments, new Span(start, end));
    } else if (this.consumeTokenIfKind(TokenKind.OpenBrace)) {
      this.skipWhitespace();
      const fields = this.parseNamedFields();
      this.skipWhitespace();

      const end = this.consumeToken(TokenKind.CloseBrace).span.end;

      return new RecordType(fields, new Span(start, end));
    }

    throw new Error(`Unexpected token: ${current.kind} :: ${current.text}`);
  }

  private parseTypeArguments(): Type[] {
    const typeArguments: Type[] = [];

    if (this.consumeTokenIfKind(TokenKind.LessThan)) {
      do {
        typeArguments.push(this.parseType());
      } while (this.consumeTokenIfKind(TokenKind.Comma));
    }

    return typeArguments;
  }

  private current(): Token {
    return this.tokens[this.pos];
  }

  private peek(offset = 1): Token | null {
    return this.tokens[this.pos + offset] ?? null;
  }

  private consumeTokenIfKind(kind: TokenKind): Token | null {
    if (this.current()?.kind === kind) {
      return this.consumeToken();
    }

    return null;
  }

  private consumeToken(kind?: TokenKind): Token {
    if (kind && this.current?.().kind !== kind) {
      throw new Error(
        `Expected token of kind ${kind} but got ${this.current().kind}`
      );
    }

    return this.tokens[this.pos++];
  }

  private skipWhitespace() {
    while (this.current()?.kind === TokenKind.Whitespace) {
      this.pos++;
    }
  }
}

export function parse(
  fileName: string,
  source: string,
): SourceFile {
  const tokens = tokenize(source);
  return new Parser(fileName, source, tokens).parse();
}
