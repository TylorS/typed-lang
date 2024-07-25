import { Token, TokenKind } from "./Token.js";
import { Span, SpanLocation } from "./Span.js";

const WHITESPACE_REGEX = /\s/;
const ALPHA_REGEX = /[a-zA-Z]/;
const NUMERIC_REGEX = /[0-9]/;
const ALPHANUMERIC_REGEX = /[a-zA-Z0-9]/;
const NEWLINE_REGEX = /\n/;

class Tokenizer {
  private _location: SpanLocation;

  private _tokens: Token[];

  constructor(readonly text: string) {
    this.text = text;
    this._location = new SpanLocation(0, 1, 0);
    this._tokens = [];
  }

  get location(): SpanLocation {
    return this._location.clone();
  }

  getChar(): string {
    return this.text[this._location.position];
  }

  get isEOF(): boolean {
    return this._location.position >= this.text.length;
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  nextChar(offset = 1): string {
    return this.text[this._location.position + offset];
  }

  slice(length: number): string {
    return this.text.slice(
      this._location.position,
      this._location.position + length
    );
  }

  move(offset = 1): void {
    this._location.position += offset;
    this._location.column += offset;
  }

  addToken(token: Token): void {
    this._tokens.push(token);
    this._location = token.span.end.clone();
  }

  takeWhitespace() {
    const start = this._location.clone();
    let text = "";
    let char = this.getChar();

    while (!this.isEOF && WHITESPACE_REGEX.test(char)) {
      text += char;
      if (NEWLINE_REGEX.test(char)) {
        this._location.position += 1;
        this._location.line += 1;
        this._location.column = 0;
      } else {
        this.move();
      }

      char = this.getChar();
    }

    if (text.length > 0) {
      this.addToken(
        new Token(TokenKind.Whitespace, text, new Span(start, this.location))
      );
      return true;
    }
    return false;
  }
}

export function tokenize(text: string): Array<Token> {
  const tokenizer = new Tokenizer(text);

  tokenizer.takeWhitespace();

  while (!tokenizer.isEOF) {
    const char = tokenizer.getChar();
    const loc = tokenizer.location;

    switch (char) {
      case "{": {
        tokenizer.addToken(
          new Token(TokenKind.OpenBrace, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "}": {
        tokenizer.addToken(
          new Token(TokenKind.CloseBrace, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "[": {
        tokenizer.addToken(
          new Token(TokenKind.OpenBracket, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "]": {
        tokenizer.addToken(
          new Token(TokenKind.CloseBracket, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "(": {
        tokenizer.addToken(
          new Token(TokenKind.OpenParen, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ")": {
        tokenizer.addToken(
          new Token(TokenKind.CloseParen, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ",": {
        tokenizer.addToken(
          new Token(TokenKind.Comma, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "=": {
        tokenizer.addToken(
          new Token(TokenKind.EqualSign, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ".": {
        tokenizer.addToken(
          new Token(TokenKind.Period, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ">": {
        tokenizer.addToken(
          new Token(TokenKind.GreaterThan, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "<": {
        tokenizer.addToken(
          new Token(TokenKind.LessThan, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "|": {
        tokenizer.addToken(
          new Token(TokenKind.Pipe, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ":": {
        tokenizer.addToken(
          new Token(TokenKind.Colon, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case ";": {
        tokenizer.addToken(
          new Token(TokenKind.Semicolon, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "_": {
        tokenizer.addToken(
          new Token(TokenKind.Underscore, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "-": {
        tokenizer.addToken(
          new Token(TokenKind.Hyphen, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "+": {
        tokenizer.addToken(
          new Token(TokenKind.Plus, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "*": {
        tokenizer.addToken(
          new Token(TokenKind.Asterisk, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "/": {
        if (tokenizer.nextChar() === "/") {
          tokenizeComment(tokenizer);
        } else {
          tokenizer.addToken(
            new Token(
              TokenKind.ForwardSlash,
              char,
              new Span(loc, loc.offset(1))
            )
          );
        }
        continue;
      }
      case "%": {
        tokenizer.addToken(
          new Token(TokenKind.Percent, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "!": {
        tokenizer.addToken(
          new Token(TokenKind.Exclamation, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "?": {
        tokenizer.addToken(
          new Token(TokenKind.QuestionMark, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }

      case "&": {
        tokenizer.addToken(
          new Token(TokenKind.Ampersand, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "@": {
        tokenizer.addToken(
          new Token(TokenKind.AtSign, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "$": {
        tokenizer.addToken(
          new Token(TokenKind.DollarSign, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "#": {
        tokenizer.addToken(
          new Token(TokenKind.Hash, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "^": {
        tokenizer.addToken(
          new Token(TokenKind.Caret, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "~": {
        tokenizer.addToken(
          new Token(TokenKind.Tilde, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "`": {
        tokenizer.addToken(
          new Token(TokenKind.Backtick, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "\\": {
        tokenizer.addToken(
          new Token(TokenKind.BackSlash, char, new Span(loc, loc.offset(1)))
        );
        continue;
      }
      case "'":
      case '"':
        tokenizeStringLiteral(tokenizer);
        continue;
      default: {
        if (char === "i" && ["if ", "if("].includes(tokenizer.slice(3))) {
          tokenizer.addToken(
            new Token(TokenKind.IfKeyword, "if", new Span(loc, loc.offset(2)))
          );
          tokenizer.takeWhitespace();
          continue;
        }

        const nextEightChars = tokenizer.slice(8);

        if (nextEightChars === "function") {
          tokenizer.addToken(
            new Token(
              TokenKind.FunctionKeyword,
              nextEightChars,
              new Span(loc, loc.offset(8))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextEightChars === "instance") {
          tokenizer.addToken(
            new Token(
              TokenKind.InstanceKeyword,
              nextEightChars,
              new Span(loc, loc.offset(8))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        }

        const nextNineChars = tokenizer.slice(9);

        if (nextNineChars === "typeclass") {
          tokenizer.addToken(
            new Token(
              TokenKind.TypeClassKeyword,
              nextNineChars,
              new Span(loc, loc.offset(9))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        }

        const nextFourChars = tokenizer.slice(4);

        if (nextFourChars === "type") {
          tokenizer.addToken(
            new Token(
              TokenKind.TypeKeyword,
              nextFourChars,
              new Span(loc, loc.offset(4))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextFourChars === "data") {
          tokenizer.addToken(
            new Token(
              TokenKind.DataKeyword,
              nextFourChars,
              new Span(loc, loc.offset(4))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextFourChars === "true") {
          tokenizer.addToken(
            new Token(
              TokenKind.BooleanLiteral,
              nextFourChars,
              new Span(loc, loc.offset(4))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        }

        const nextFiveChars = tokenizer.slice(5);

        if (nextFiveChars === "false") {
          tokenizer.addToken(
            new Token(
              TokenKind.BooleanLiteral,
              nextFiveChars,
              new Span(loc, loc.offset(5))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextFiveChars === "brand") {
          tokenizer.addToken(
            new Token(
              TokenKind.BrandKeyword,
              nextFiveChars,
              new Span(loc, loc.offset(5))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextFiveChars === "match") {
          tokenizer.addToken(
            new Token(
              TokenKind.MatchKeyword,
              nextFiveChars,
              new Span(loc, loc.offset(5))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextFiveChars === "const") {
          tokenizer.addToken(
            new Token(
              TokenKind.ConstKeyword,
              nextFiveChars,
              new Span(loc, loc.offset(6))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        }

        const nextSixChars = tokenizer.slice(6);

        if (nextSixChars === "export") {
          tokenizer.addToken(
            new Token(
              TokenKind.ExportKeyword,
              nextSixChars,
              new Span(loc, loc.offset(6))
            )
          );
          tokenizer.takeWhitespace();
          continue;
        } else if (nextSixChars === "return") {
          tokenizer.addToken(
            new Token(
              TokenKind.ReturnKeyword,
              nextSixChars,
              new Span(loc, loc.offset(6))
            )
          );
          tokenizer.takeWhitespace();
        }

        if (ALPHA_REGEX.test(char)) {
          tokenizeIdentifier(tokenizer);
        } else if (NUMERIC_REGEX.test(char)) {
          tokenizeNumberLiteral(tokenizer);
        } else {
          if (!tokenizer.takeWhitespace()) {
            throw new Error(
              `Unexpected character: ${char} at ${loc.line}:${loc.column}`
            );
          }
        }
      }
    }
  }

  return tokenizer.tokens;
}

function tokenizeStringLiteral(tokenizer: Tokenizer): void {
  const quote = tokenizer.getChar();
  let text = quote;
  const start = tokenizer.location;

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
    new Token(
      TokenKind.StringLiteral,
      text,
      new Span(start, tokenizer.location)
    )
  );
  tokenizer.takeWhitespace();
}

function tokenizeIdentifier(tokenizer: Tokenizer): void {
  let text = "";
  const start = tokenizer.location;

  while (!tokenizer.isEOF && ALPHANUMERIC_REGEX.test(tokenizer.getChar())) {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(TokenKind.Identifier, text, new Span(start, tokenizer.location))
  );
  tokenizer.takeWhitespace();
}

function tokenizeNumberLiteral(tokenizer: Tokenizer): void {
  let text = "";
  const start = tokenizer.location;

  while (!tokenizer.isEOF && NUMERIC_REGEX.test(tokenizer.getChar())) {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(
      TokenKind.NumberLiteral,
      text,
      new Span(start, tokenizer.location)
    )
  );
  tokenizer.takeWhitespace();
}

function tokenizeComment(tokenizer: Tokenizer): void {
  let text = "//";
  const start = tokenizer.location;

  tokenizer.move(2);

  while (!tokenizer.isEOF && tokenizer.getChar() !== "\n") {
    text += tokenizer.getChar();
    tokenizer.move();
  }

  tokenizer.addToken(
    new Token(TokenKind.Comment, text, new Span(start, tokenizer.location))
  );
  tokenizer.takeWhitespace();
}
