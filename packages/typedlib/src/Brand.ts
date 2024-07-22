declare const TYPED_BRAND: unique symbol;

export type Brand<A> = { readonly [TYPED_BRAND]: A };

export type Branded<T, A> = T & Brand<A>;
