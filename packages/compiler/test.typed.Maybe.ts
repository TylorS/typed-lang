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

export const Just = <A>(value: A): Just<A> => ({
  _tag: "Just",
  value
})

export const isNothing = <A>(maybe: Maybe<A>): maybe is Nothing => maybe._tag === "Nothing"

export const isJust = <A>(maybe: Maybe<A>): maybe is Just<A> => maybe._tag === "Just"

export const isMaybe = (u: unknown): u is Maybe<unknown> =>
  typeof u === "object" &&
    u !== null &&
    "_tag" in u &&
    (u._tag === "Nothing" || u._tag === "Just")
