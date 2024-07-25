export class Span {
  readonly _tag = "Span";
  constructor(public start: SpanLocation, public end: SpanLocation) {}
}

export class SpanLocation {
  readonly _tag = "SpanLocation";

  constructor(
    public position: number,
    public line: number,
    public column: number
  ) {}

  clone() {
    return new SpanLocation(this.position, this.line, this.column);
  }

  offset(offset: number): SpanLocation {
    return new SpanLocation(
      this.position + offset,
      this.line,
      this.column + offset
    );
  }
}
