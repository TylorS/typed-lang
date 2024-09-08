/* eslint-disable @typescript-eslint/no-explicit-any */

declare const TYPED_BRAND: unique symbol;

export type Brand<A> = { readonly [TYPED_BRAND]: A };

export type Branded<T, A> = T & Brand<A>;

export type BrandOf<T> = T extends Branded<any, infer A> ? A : never;

export type BrandedValue<T> = T extends Branded<infer Value, BrandOf<T>>
  ? Value
  : never;

export const Branded =
  <T extends Branded<any, any>>() =>
  <const Value extends BrandedValue<T>>(value: Value): Branded<Value, T> =>
    value as Branded<Value, T>;
