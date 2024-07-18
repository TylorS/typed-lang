export class Token {
  constructor(
    public kind: TokenKind,
    public text: string,
    public span: Span,
  ) {}
}

export class Span { 
  constructor(
    public start: SpanLocation,
    public end: SpanLocation,
  ) {}
}

export class SpanLocation { 
  constructor(
    public position: number,
    public line: number,
    public column: number,
  ) { }

  clone() {
    return new SpanLocation(this.position, this.line, this.column);
  }
  
  offset(offset: number): SpanLocation {
    return new SpanLocation(
      this.position + offset,
      this.line,
      this.column + offset,
    );
  }
}

export enum TokenKind {
  CloseBrace = 'CloseBrace',
  CloseBracket = 'CloseBracket',
  CloseParen = 'CloseParen',
  Comma = 'Comma',
  EqualSign = 'EqualSign',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  OpenBrace = 'OpenBrace',
  OpenBracket = 'OpenBracket',
  OpenParen = 'OpenParen',
  Period = 'Period',
  Pipe = 'Pipe',
  Colon = 'Colon',

  Whitespace = 'Whitespace',
  Comment = 'Comment',

  DataKeyword = 'DataKeyword',
  TypeKeyword = 'TypeKeyword',

  Identifier = 'Identifier',

  StringLiteral = 'StringLiteral',
  NumberLiteral = 'NumberLiteral',
  BooleanLiteral = 'BooleanLiteral',
}

