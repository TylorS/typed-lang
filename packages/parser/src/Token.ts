import { Span } from "./Span.js";

export class Token {
  constructor(public kind: TokenKind, public text: string, public span: Span) {}
}

export enum TokenKind {
  Ampersand = "Ampersand", // &
  Asterisk = "Asterisk", // *
  AtSign = "AtSign", // @
  BackSlash = "BackSlash", // \
  Backtick = "Backtick", // `
  Caret = "Caret", // ^
  CloseBrace = "CloseBrace", // }
  CloseBracket = "CloseBracket", // ]
  CloseParen = "CloseParen", // )
  Colon = "Colon", // :
  Comma = "Comma", // ,
  DollarSign = "DollarSign", // $
  EqualSign = "EqualSign", // =
  Exclamation = "Exclamation", // !
  ForwardSlash = "ForwardSlash", // /
  GreaterThan = "GreaterThan", // >
  Hash = "Hash", // #
  Hyphen = "Hyphen", // -
  LessThan = "LessThan", // <
  Minus = "Minus", // -
  OpenBrace = "OpenBrace", // {
  OpenBracket = "OpenBracket", // [
  OpenParen = "OpenParen", // (
  Percent = "Percent", // %
  Period = "Period", // .
  Pipe = "Pipe", // |
  Plus = "Plus", // +
  QuestionMark = "QuestionMark", // ?
  Semicolon = "Semicolon", // ;
  Tilde = "Tilde", // ~
  Underscore = "Underscore", // _

  Comment = "Comment",
  Whitespace = "Whitespace", 

  BrandKeyword = "BrandKeyword",
  BreakKeyword = "BreakKeyword",
  ConstKeyword = "ConstKeyword",
  ContinueKeyword = "ContinueKeyword",
  DataKeyword = "DataKeyword",
  ExportKeyword = "ExportKeyword",
  FunctionKeyword = "FunctionKeyword",
  InstanceKeyword = "InstanceKeyword",
  TypeClassKeyword = "TypeClassKeyword",
  TypeKeyword = "TypeKeyword",
  MatchKeyword = "MatchKeyword",
  IfKeyword = "IfKeyword",
  ElseKeyword = "ElseKeyword",
  ReturnKeyword = "ReturnKeyword",
  ImportKeyword = "ImportKeyword",
  FromKeyword = "FromKeyword",
  AsKeyword = "AsKeyword",

  Identifier = "Identifier",
  StringLiteral = "StringLiteral",
  NumberLiteral = "NumberLiteral",
  BooleanLiteral = "BooleanLiteral",
}
