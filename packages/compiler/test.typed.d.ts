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
