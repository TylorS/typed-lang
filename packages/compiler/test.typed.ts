export type Maybe<A> =
  | Nothing
  | Just<A>

export interface Nothing {
  readonly _tag: "Nothing"
}

export interface Just<A> {
  readonly _tag: "Just"
  readonly value: A
}

export const Nothing: Nothing = { _tag: "Nothing" }

export const Just = <const A>(value: A): Just<A> => ({
  _tag: "Just",
  value
})
//# sourceMappingURL=test.typed.ts.map