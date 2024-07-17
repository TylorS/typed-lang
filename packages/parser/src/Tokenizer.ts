import { Span, Token, TokenKind } from "./Token";

const WHITESPACE_REGEX = /\s/;
const ALPHA_REGEX = /[a-zA-Z]/;
const NUMERIC_REGEX = /[0-9]/;
const ALPHANUMERIC_REGEX = /[a-zA-Z0-9]/;

class Tokenizer {
  private _pos: number;
  private _tokens: Token[];

  constructor(readonly text: string) {
    this.text = text;
    this._pos = 0;
    this._tokens = [];
  }

  get pos(): number {
    return this._pos;
  }

  getChar(): string {
    return this.text[this._pos];
  }

  get isEOF(): boolean {
    return this._pos >= this.text.length;
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  nextChar(offset = 1): string {
    return this.text[this._pos + offset];
  }

  slice(length: number): string {
    return this.text.slice(this._pos, this._pos + length);
  }

  move(offset = 1): void {
    this._pos += offset;
  }

  addToken(token: Token): void {
    this._tokens.push(token);
    this._pos = token.span.end;
  }

  takeWhitespace() {
    const start = this._pos;
    let text = "";
    let char = this.getChar();

    while (!this.isEOF && WHITESPACE_REGEX.test(char)) {
      text += char;
      this.move();
      char = this.getChar();
    }

    if (text.length > 0) {
      this.addToken(
        new Token(TokenKind.Whitespace, text, new Span(start, this._pos))
      );
    }
  }
}

export function tokenize(text: string): Array<Token> {
  const tokenizer = new Tokenizer(text);

  tokenizer.takeWhitespace();

  while (!tokenizer.isEOF) {
    const char = tokenizer.getChar();

    switch (char) {
      case "{": {
        tokenizer.addToken(
          new Token(
            TokenKind.OpenBrace,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "}": {
        tokenizer.addToken(
          new Token(
            TokenKind.CloseBrace,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "[": {
        tokenizer.addToken(
          new Token(
            TokenKind.OpenBracket,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "]": {
        tokenizer.addToken(
          new Token(
            TokenKind.CloseBracket,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "(": {
        tokenizer.addToken(
          new Token(
            TokenKind.OpenParen,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case ")": {
        tokenizer.addToken(
          new Token(
            TokenKind.CloseParen,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case ",": {
        tokenizer.addToken(
          new Token(
            TokenKind.Comma,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "=": {
        tokenizer.addToken(
          new Token(
            TokenKind.EqualSign,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case ".": {
        tokenizer.addToken(
          new Token(
            TokenKind.Period,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case ">": {
        tokenizer.addToken(
          new Token(
            TokenKind.GreaterThan,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "<": {
        tokenizer.addToken(
          new Token(
            TokenKind.LessThan,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "|": {
        tokenizer.addToken(
          new Token(
            TokenKind.Pipe,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case ":": {
        tokenizer.addToken(
          new Token(
            TokenKind.Colon,
            char,
            new Span(tokenizer.pos, tokenizer.pos + 1)
          )
        );
        continue;
      }
      case "'":
      case '"':
        tokenizeStringLiteral(tokenizer);
        continue;
      default: {
        if (char === "/" && tokenizer.nextChar() === "/") {
          tokenizeComment(tokenizer)
          continue;
        }

        const nextFourChars = tokenizer.slice(4);

        if (nextFourChars === "type") {
          tokenizer.addToken(
            new Token(
              TokenKind.TypeKeyword,
              nextFourChars,
              new Span(tokenizer.pos, tokenizer.pos + 4)
            )
          );
          tokenizer.takeWhitespace();
          continue
        } else if (nextFourChars === "data") {
          tokenizer.addToken(
            new Token(
              TokenKind.DataKeyword,
              nextFourChars,
              new Span(tokenizer.pos, tokenizer.pos + 4)
            )
          );
          tokenizer.takeWhitespace();
          continue
        } else if (nextFourChars === "true") {
          tokenizer.addToken(
            new Token(
              TokenKind.BooleanLiteral,
              nextFourChars,
              new Span(tokenizer.pos, tokenizer.pos + 4)
            )
          );
          tokenizer.takeWhitespace();
          continue
        }

        const nextFiveChars = tokenizer.slice(5);

        if (nextFiveChars === "false") {
          tokenizer.addToken(
            new Token(
              TokenKind.BooleanLiteral,
              nextFiveChars,
              new Span(tokenizer.pos, tokenizer.pos + 5)
            )
          );
          tokenizer.takeWhitespace();
        } else if (ALPHA_REGEX.test(char)) {
          tokenizeIdentifier(tokenizer);
        } else if (NUMERIC_REGEX.test(char)) {
          tokenizeNumberLiteral(tokenizer);
        } else {
          tokenizer.takeWhitespace();
        }
      }
    }
  }

  return tokenizer.tokens;
}

function tokenizeStringLiteral(tokenizer: Tokenizer): void {
  const quote = tokenizer.getChar();
  let text = quote;
  const start = tokenizer.pos;

  tokenizer.move();

  while (!tokenizer.isEOF) {
    text += tokenizer.getChar();
    tokenizer.move();

    if (tokenizer.getChar() === quote) {
      text += tokenizer.getChar();
      tokenizer.move();
      break;
    }
  }

  tokenizer.addToken(
    new Token(TokenKind.StringLiteral, text, new Span(start, tokenizer.pos))
  );
  tokenizer.takeWhitespace();
}

function tokenizeIdentifier(tokenizer: Tokenizer): void {
  let text = "";
  const start = tokenizer.pos;

  while (!tokenizer.isEOF && ALPHANUMERIC_REGEX.test(tokenizer.getChar())) {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(TokenKind.Identifier, text, new Span(start, tokenizer.pos))
  );
  tokenizer.takeWhitespace();
}

function tokenizeNumberLiteral(tokenizer: Tokenizer): void {
  let text = "";
  const start = tokenizer.pos;

  while (!tokenizer.isEOF && NUMERIC_REGEX.test(tokenizer.getChar())) {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(TokenKind.NumberLiteral, text, new Span(start, tokenizer.pos))
  );
  tokenizer.takeWhitespace();
}

function tokenizeComment(tokenizer: Tokenizer): void {
  let text = "//";
  const start = tokenizer.pos;

  tokenizer.move(2);

  while (!tokenizer.isEOF && tokenizer.getChar() !== "\n") {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(TokenKind.Comment, text, new Span(start, tokenizer.pos))
  );
  tokenizer.takeWhitespace();
}