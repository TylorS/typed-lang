import { Span, Token, TokenKind } from '@typed/parser/Token';
import { tokenize } from '@typed/parser/Tokenizer';
import { describe, expect, it } from 'vitest';

describe('Tokenizer', () => {
  it('tokenizes data types', () => {
    const tokens = tokenize(`data Maybe<A> = Nothing | Just(A) | Some { value: A }`);

    expect(tokens).toEqual([
      new Token(TokenKind.DataKeyword, 'data', new Span(0, 4)),
      new Token(TokenKind.Whitespace, ' ', new Span(4, 5)),
      new Token(TokenKind.Identifier, 'Maybe', new Span(5, 10)),
      new Token(TokenKind.LessThan, '<', new Span(10, 11)),
      new Token(TokenKind.Identifier, 'A', new Span(11, 12)),
      new Token(TokenKind.GreaterThan, '>', new Span(12, 13)),
      new Token(TokenKind.Whitespace, ' ', new Span(13, 14)),
      new Token(TokenKind.EqualSign, '=', new Span(14, 15)),
      new Token(TokenKind.Whitespace, ' ', new Span(15, 16)),
      new Token(TokenKind.Identifier, 'Nothing', new Span(16, 23)),
      new Token(TokenKind.Whitespace, ' ', new Span(23, 24)),
      new Token(TokenKind.Pipe, '|', new Span(24, 25)),
      new Token(TokenKind.Whitespace, ' ', new Span(25, 26)),
      new Token(TokenKind.Identifier, 'Just', new Span(26, 30)),
      new Token(TokenKind.OpenParen, '(', new Span(30, 31)),
      new Token(TokenKind.Identifier, 'A', new Span(31, 32)),
      new Token(TokenKind.CloseParen, ')', new Span(32, 33)),
      new Token(TokenKind.Whitespace, ' ', new Span(33, 34)),
      new Token(TokenKind.Pipe, '|', new Span(34, 35)),
      new Token(TokenKind.Whitespace, ' ', new Span(35, 36)),
      new Token(TokenKind.Identifier, 'Some', new Span(36, 40)),
      new Token(TokenKind.Whitespace, ' ', new Span(40, 41)),
      new Token(TokenKind.OpenBrace, '{', new Span(41, 42)),
      new Token(TokenKind.Whitespace, ' ', new Span(42, 43)),
      new Token(TokenKind.Identifier, 'value', new Span(43, 48)),
      new Token(TokenKind.Colon, ':', new Span(48, 49)),
      new Token(TokenKind.Whitespace, ' ', new Span(49, 50)),
      new Token(TokenKind.Identifier, 'A', new Span(50, 51)),
      new Token(TokenKind.Whitespace, ' ', new Span(51, 52)),
      new Token(TokenKind.CloseBrace, '}', new Span(52, 53)),
    ])
  });

  it('tokenizes type aliases for records', () => { 
    const tokens = tokenize(`type Todo = {
  id: number
  text: string
  completed: boolean
}`);
    
    expect(tokens).toEqual([
      new Token(TokenKind.TypeKeyword, 'type', new Span(0, 4)),
      new Token(TokenKind.Whitespace, ' ', new Span(4, 5)),
      new Token(TokenKind.Identifier, 'Todo', new Span(5, 9)),
      new Token(TokenKind.Whitespace, ' ', new Span(9, 10)),
      new Token(TokenKind.EqualSign, '=', new Span(10, 11)),
      new Token(TokenKind.Whitespace, ' ', new Span(11, 12)),
      new Token(TokenKind.OpenBrace, '{', new Span(12, 13)),
      new Token(TokenKind.Whitespace, '\n  ', new Span(13, 16)),
      new Token(TokenKind.Identifier, 'id', new Span(16, 18)),
      new Token(TokenKind.Colon, ':', new Span(18, 19)),
      new Token(TokenKind.Whitespace, ' ', new Span(19, 20)),
      new Token(TokenKind.Identifier, 'number', new Span(20, 26)),
      new Token(TokenKind.Whitespace, '\n  ', new Span(26, 29)),
      new Token(TokenKind.Identifier, 'text', new Span(29, 33)),
      new Token(TokenKind.Colon, ':', new Span(33, 34)),
      new Token(TokenKind.Whitespace, ' ', new Span(34, 35)),
      new Token(TokenKind.Identifier, 'string', new Span(35, 41)),
      new Token(TokenKind.Whitespace, '\n  ', new Span(41, 44)),
      new Token(TokenKind.Identifier, 'completed', new Span(44, 53)),
      new Token(TokenKind.Colon, ':', new Span(53, 54)),
      new Token(TokenKind.Whitespace, ' ', new Span(54, 55)),
      new Token(TokenKind.Identifier, 'boolean', new Span(55, 62)),
      new Token(TokenKind.Whitespace, '\n', new Span(62, 63)),
      new Token(TokenKind.CloseBrace, '}', new Span(63, 64))
    ])
  });

  it('tokenizes comments', () => { 
    const tokens = tokenize(`// This is a comment`);

    expect(tokens).toEqual([
      new Token(TokenKind.Comment, '// This is a comment', new Span(0, 20))
    ])
  })

  it('tokenizes string literals', () => {
    const tokens = tokenize(`"Hello, World!"`);

    expect(tokens).toEqual([
      new Token(TokenKind.StringLiteral, '"Hello, World!"', new Span(0, 15))
    ])
  })

  it('tokenizes number literals', () => {
    const tokens = tokenize(`123`);

    expect(tokens).toEqual([
      new Token(TokenKind.NumberLiteral, '123', new Span(0, 3))
    ])
  })

  it('tokenizes boolean literals', () => {
    expect(tokenize(`true`)).toEqual([
      new Token(TokenKind.BooleanLiteral, 'true', new Span(0, 4))
    ])

    expect(tokenize(`false`)).toEqual([
      new Token(TokenKind.BooleanLiteral, 'false', new Span(0, 5))
    ])
  })

  it('tokenizes identifiers', () => {
    const tokens = tokenize(`foo bar baz`);

    expect(tokens).toEqual([
      new Token(TokenKind.Identifier, 'foo', new Span(0, 3)),
      new Token(TokenKind.Whitespace, ' ', new Span(3, 4)),
      new Token(TokenKind.Identifier, 'bar', new Span(4, 7)),
      new Token(TokenKind.Whitespace, ' ', new Span(7, 8)),
      new Token(TokenKind.Identifier, 'baz', new Span(8, 11))
    ])
  })

  it('tokenizes punctuation', () => {
    const tokens = tokenize(`{ } [ ] ( ) , : | .`);

    expect(tokens).toEqual([
      new Token(TokenKind.OpenBrace, '{', new Span(0, 1)),
      new Token(TokenKind.Whitespace, ' ', new Span(1, 2)),
      new Token(TokenKind.CloseBrace, '}', new Span(2, 3)),
      new Token(TokenKind.Whitespace, ' ', new Span(3, 4)),
      new Token(TokenKind.OpenBracket, '[', new Span(4, 5)),
      new Token(TokenKind.Whitespace, ' ', new Span(5, 6)),
      new Token(TokenKind.CloseBracket, ']', new Span(6, 7)),
      new Token(TokenKind.Whitespace, ' ', new Span(7, 8)),
      new Token(TokenKind.OpenParen, '(', new Span(8, 9)),
      new Token(TokenKind.Whitespace, ' ', new Span(9, 10)),
      new Token(TokenKind.CloseParen, ')', new Span(10, 11)),
      new Token(TokenKind.Whitespace, ' ', new Span(11, 12)),
      new Token(TokenKind.Comma, ',', new Span(12, 13)),
      new Token(TokenKind.Whitespace, ' ', new Span(13, 14)),
      new Token(TokenKind.Colon, ':', new Span(14, 15)),
      new Token(TokenKind.Whitespace, ' ', new Span(15, 16)),
      new Token(TokenKind.Pipe, '|', new Span(16, 17)),
      new Token(TokenKind.Whitespace, ' ', new Span(17, 18)),
      new Token(TokenKind.Period, '.', new Span(18, 19))
    ])
  })

  it('tokenizes whitespace', () => {
    const tokens = tokenize(` \n  `);

    expect(tokens).toEqual([
      new Token(TokenKind.Whitespace, ` \n  `, new Span(0, 4))
    ])
  })
});