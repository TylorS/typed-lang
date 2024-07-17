export class Token {
  constructor(
    public kind: TokenKind,
    public text: string,
    public span: Span,
  ) {}
}

export class Span { 
  constructor(
    public start: number,
    public end: number,
  ) {}
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

