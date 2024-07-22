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

export const Nothing = { _tag: "Nothing" }

export const Just = <A>(value: A) => ({
  _tag: "Just",
  value
})
//# sourceMappingURL=test.typed.ts.map