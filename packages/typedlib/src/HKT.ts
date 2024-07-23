/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Params {
  Z = "Z",
  Y = "Y",
  X = "X",
  W = "W",
  V = "V",
  U = "U",
  S = "S",
  R = "R",
  E = "E",
  A = "A",
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Variance {
  export type Covariant<A> = (_: never, __covariant: never) => A;
  export type Contravariant<A> = (_: A, __contravariant: never) => never;
  export type Invariant<A> = (_: A, __invariant: A) => A;
}

export type Variance<A> =
  | Variance.Covariant<A>
  | Variance.Contravariant<A>
  | Variance.Invariant<A>;

export interface HKT {
  readonly type: unknown;
  readonly [Params.A]: unknown;
  readonly defaults?: Partial<Readonly<Record<Params, Variance<any>>>>;
}

export interface HKT2 extends HKT {
  readonly [Params.E]: unknown;
}

export interface HKT3 extends HKT2 {
  readonly [Params.R]: unknown;
}

export interface HKT4 extends HKT3 {
  readonly [Params.S]: unknown;
}

export interface HKT5 extends HKT4 {
  readonly [Params.U]: unknown;
}

export interface HKT6 extends HKT5 {
  readonly [Params.V]: unknown;
}

export interface HKT7 extends HKT6 {
  readonly [Params.W]: unknown;
}

export interface HKT8 extends HKT7 {
  readonly [Params.X]: unknown;
}

export interface HKT9 extends HKT8 {
  readonly [Params.Y]: unknown;
}

export interface HKT10 extends HKT9 {
  readonly [Params.Z]: unknown;
}

export type LengthOf<T extends HKT> = T extends HKT10
  ? 10
  : T extends HKT9
  ? 9
  : T extends HKT8
  ? 8
  : T extends HKT7
  ? 7
  : T extends HKT6
  ? 6
  : T extends HKT5
  ? 5
  : T extends HKT4
  ? 4
  : T extends HKT3
  ? 3
  : T extends HKT2
  ? 2
  : 1;

export type Kind1<T extends HKT, A> = (T & {
  readonly [Params.A]: A;
})["type"];

export type Kind2<T extends HKT2, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
})["type"];

export type Kind3<T extends HKT3, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
})["type"];

export type Kind4<T extends HKT4, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
})["type"];

export type Kind5<T extends HKT5, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
})["type"];

export type Kind6<T extends HKT6, V, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
  readonly [Params.V]: V;
})["type"];

export type Kind7<T extends HKT7, W, V, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
  readonly [Params.V]: V;
  readonly [Params.W]: W;
})["type"];

export type Kind8<T extends HKT8, X, W, V, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
  readonly [Params.V]: V;
  readonly [Params.W]: W;
  readonly [Params.X]: X;
})["type"];

export type Kind9<T extends HKT9, Y, X, W, V, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
  readonly [Params.V]: V;
  readonly [Params.W]: W;
  readonly [Params.X]: X;
  readonly [Params.Y]: Y;
})["type"];

export type Kind10<T extends HKT10, Z, Y, X, W, V, U, S, R, E, A> = (T & {
  readonly [Params.A]: A;
  readonly [Params.E]: E;
  readonly [Params.R]: R;
  readonly [Params.S]: S;
  readonly [Params.U]: U;
  readonly [Params.V]: V;
  readonly [Params.W]: W;
  readonly [Params.X]: X;
  readonly [Params.Y]: Y;
  readonly [Params.Z]: Z;
})["type"];

export type Kind<T extends HKT, Params extends ReadonlyArray<any>> = {
  1: Kind1<T, Params[0]>;
  2: Kind2<Extract<T, HKT2>, Params[0], Params[1]>;
  3: Kind3<Extract<T, HKT3>, Params[0], Params[1], Params[2]>;
  4: Kind4<Extract<T, HKT4>, Params[0], Params[1], Params[2], Params[3]>;
  5: Kind5<
    Extract<T, HKT5>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4]
  >;
  6: Kind6<
    Extract<T, HKT6>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4],
    Params[5]
  >;
  7: Kind7<
    Extract<T, HKT7>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4],
    Params[5],
    Params[6]
  >;
  8: Kind8<
    Extract<T, HKT8>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4],
    Params[5],
    Params[6],
    Params[7]
  >;
  9: Kind9<
    Extract<T, HKT9>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4],
    Params[5],
    Params[6],
    Params[7],
    Params[8]
  >;
  10: Kind10<
    Extract<T, HKT10>,
    Params[0],
    Params[1],
    Params[2],
    Params[3],
    Params[4],
    Params[5],
    Params[6],
    Params[7],
    Params[8],
    Params[9]
  >;
}[LengthOf<T>];

type SplitParams<T extends HKT, Params extends ReadonlyArray<any>> = {
  1: { values: []; rest: Params };
  2: Params extends [infer A, ...infer Rest]
    ? { values: [A]; rest: Rest }
    : never;
  3: Params extends [infer A, infer B, ...infer Rest]
    ? { values: [A, B]; rest: Rest }
    : never;
  4: Params extends [infer A, infer B, infer C, ...infer Rest]
    ? { values: [A, B, C]; rest: Rest }
    : never;
  5: Params extends [infer A, infer B, infer C, infer D, ...infer Rest]
    ? { values: [A, B, C, D]; rest: Rest }
    : never;
  6: Params extends [infer A, infer B, infer C, infer D, infer E, ...infer Rest]
    ? { values: [A, B, C, D, E]; rest: Rest }
    : never;
  7: Params extends [
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    infer F,
    ...infer Rest
  ]
    ? { values: [A, B, C, D, E, F]; rest: Rest }
    : never;
  8: Params extends [
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    infer F,
    infer G,
    ...infer Rest
  ]
    ? { values: [A, B, C, D, E, F, G]; rest: Rest }
    : never;
  9: Params extends [
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    infer F,
    infer G,
    infer H,
    ...infer Rest
  ]
    ? { values: [A, B, C, D, E, F, G, H]; rest: Rest }
    : never;
  10: Params extends [
    infer A,
    infer B,
    infer C,
    infer D,
    infer E,
    infer F,
    infer G,
    infer H,
    infer I,
    ...infer Rest
  ]
    ? { values: [A, B, C, D, E, F, G, H, I]; rest: Rest }
    : never;
}[LengthOf<T>];

export type Kinds<
  HKTS extends ReadonlyArray<HKT>,
  Params extends ReadonlyArray<any>
> = HKTS extends readonly [infer Head extends HKT]
  ? Kind<Head, Params>
  : HKTS extends readonly [
      infer Head extends HKT,
      ...infer Tail extends ReadonlyArray<HKT>
    ]
  ? SplitParams<Head, Params> extends {
      values: infer V extends ReadonlyArray<any>;
      rest: infer R extends ReadonlyArray<any>;
    }
    ? Kind<Head, [...V, Kinds<Tail, R>]>
    : never
  : never;

export type ParamsOf<H extends HKT, T> = {
  1: T extends Kind1<H, infer A> ? [A] : never;
  2: T extends Kind2<Extract<H, HKT2>, infer E, infer A> ? [E, A] : never;
  3: T extends Kind3<Extract<H, HKT3>, infer R, infer E, infer A>
    ? [R, E, A]
    : never;
  4: T extends Kind4<Extract<H, HKT4>, infer S, infer R, infer E, infer A>
    ? [S, R, E, A]
    : never;
  5: T extends Kind5<
    Extract<H, HKT5>,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [U, S, R, E, A]
    : never;
  6: T extends Kind6<
    Extract<H, HKT6>,
    infer V,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [V, U, S, R, E, A]
    : never;
  7: T extends Kind7<
    Extract<H, HKT7>,
    infer W,
    infer V,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [W, V, U, S, R, E, A]
    : never;
  8: T extends Kind8<
    Extract<H, HKT8>,
    infer X,
    infer W,
    infer V,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [X, W, V, U, S, R, E, A]
    : never;
  9: T extends Kind9<
    Extract<H, HKT9>,
    infer Y,
    infer X,
    infer W,
    infer V,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [Y, X, W, V, U, S, R, E, A]
    : never;
  10: T extends Kind10<
    Extract<H, HKT10>,
    infer Z,
    infer Y,
    infer X,
    infer W,
    infer V,
    infer U,
    infer S,
    infer R,
    infer E,
    infer A
  >
    ? [Z, Y, X, W, V, U, S, R, E, A]
    : never;
}[LengthOf<H>];

export type ParamOf<H extends HKT, T, P extends Params> = {
  1: {
    [Params.A]: ParamsOf<H, T>[0];
    [Params.E]: never;
    [Params.R]: never;
    [Params.S]: never;
    [Params.U]: never;
    [Params.V]: never;
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  2: {
    [Params.A]: ParamsOf<H, T>[1];
    [Params.E]: ParamsOf<H, T>[0];
    [Params.R]: never;
    [Params.S]: never;
    [Params.U]: never;
    [Params.V]: never;
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  3: {
    [Params.A]: ParamsOf<H, T>[2];
    [Params.E]: ParamsOf<H, T>[1];
    [Params.R]: ParamsOf<H, T>[0];
    [Params.S]: never;
    [Params.U]: never;
    [Params.V]: never;
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  4: {
    [Params.A]: ParamsOf<H, T>[3];
    [Params.E]: ParamsOf<H, T>[2];
    [Params.R]: ParamsOf<H, T>[1];
    [Params.S]: ParamsOf<H, T>[0];
    [Params.U]: never;
    [Params.V]: never;
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  5: {
    [Params.A]: ParamsOf<H, T>[4];
    [Params.E]: ParamsOf<H, T>[3];
    [Params.R]: ParamsOf<H, T>[2];
    [Params.S]: ParamsOf<H, T>[1];
    [Params.U]: ParamsOf<H, T>[0];
    [Params.V]: never;
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  6: {
    [Params.A]: ParamsOf<H, T>[5];
    [Params.E]: ParamsOf<H, T>[4];
    [Params.R]: ParamsOf<H, T>[3];
    [Params.S]: ParamsOf<H, T>[2];
    [Params.U]: ParamsOf<H, T>[1];
    [Params.V]: ParamsOf<H, T>[0];
    [Params.W]: never;
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  7: {
    [Params.A]: ParamsOf<H, T>[6];
    [Params.E]: ParamsOf<H, T>[5];
    [Params.R]: ParamsOf<H, T>[4];
    [Params.S]: ParamsOf<H, T>[3];
    [Params.U]: ParamsOf<H, T>[2];
    [Params.V]: ParamsOf<H, T>[1];
    [Params.W]: ParamsOf<H, T>[0];
    [Params.X]: never;
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  8: {
    [Params.A]: ParamsOf<H, T>[7];
    [Params.E]: ParamsOf<H, T>[6];
    [Params.R]: ParamsOf<H, T>[5];
    [Params.S]: ParamsOf<H, T>[4];
    [Params.U]: ParamsOf<H, T>[3];
    [Params.V]: ParamsOf<H, T>[2];
    [Params.W]: ParamsOf<H, T>[1];
    [Params.X]: ParamsOf<H, T>[0];
    [Params.Y]: never;
    [Params.Z]: never;
  }[P];
  9: {
    [Params.A]: ParamsOf<H, T>[8];
    [Params.E]: ParamsOf<H, T>[7];
    [Params.R]: ParamsOf<H, T>[6];
    [Params.S]: ParamsOf<H, T>[5];
    [Params.U]: ParamsOf<H, T>[4];
    [Params.V]: ParamsOf<H, T>[3];
    [Params.W]: ParamsOf<H, T>[2];
    [Params.X]: ParamsOf<H, T>[1];
    [Params.Y]: ParamsOf<H, T>[0];
    [Params.Z]: never;
  }[P];
  10: {
    [Params.A]: ParamsOf<H, T>[9];
    [Params.E]: ParamsOf<H, T>[8];
    [Params.R]: ParamsOf<H, T>[7];
    [Params.S]: ParamsOf<H, T>[6];
    [Params.U]: ParamsOf<H, T>[5];
    [Params.V]: ParamsOf<H, T>[4];
    [Params.W]: ParamsOf<H, T>[3];
    [Params.X]: ParamsOf<H, T>[2];
    [Params.Y]: ParamsOf<H, T>[1];
    [Params.Z]: ParamsOf<H, T>[0];
  }[P];
}[LengthOf<H>];

export type DefaultOf<
  H extends HKT,
  P extends Params
> = P extends keyof H["defaults"]
  ? DefaultForVariance<NonNullable<H["defaults"]>[P]>
  : unknown;

export type DefaultForVariance<V> = [V] extends [Variance.Invariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? any
    : R
  : [V] extends [Variance.Contravariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? unknown
    : R
  : [V] extends [Variance.Covariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? any
    : R
  : any;

export type InitialOf<
  H extends HKT,
  P extends Params
> = P extends keyof H["defaults"]
  ? InitialForVariance<NonNullable<H["defaults"]>[P]>
  : unknown;

export type InitialForVariance<V> = [V] extends [Variance.Invariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? any
    : R
  : [V] extends [Variance.Contravariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? unknown
    : R
  : [V] extends [Variance.Covariant<infer R>]
  ? Equals<R, unknown> extends 1
    ? never
    : R
  : any;

export type Constrain<
  H extends HKT,
  P extends PossibleParamsOf<H>,
  X extends Variance<any>
> = H & {
  readonly defaults: { readonly [_ in P]: X };
};

export type PossibleParamsOf<T extends HKT> = {
  1: Params.A;
  2: Params.E | Params.A;
  3: Params.R | Params.E | Params.A;
  4: Params.S | Params.R | Params.E | Params.A;
  5: Params.U | Params.S | Params.R | Params.E | Params.A;
  6: Params.V | Params.U | Params.S | Params.R | Params.E | Params.A;
  7: Params.W | Params.V | Params.U | Params.S | Params.R | Params.E | Params.A;
  8:
    | Params.X
    | Params.W
    | Params.V
    | Params.U
    | Params.S
    | Params.R
    | Params.E
    | Params.A;
  9:
    | Params.Y
    | Params.X
    | Params.W
    | Params.V
    | Params.U
    | Params.S
    | Params.R
    | Params.E
    | Params.A;
  10:
    | Params.Z
    | Params.Y
    | Params.X
    | Params.W
    | Params.V
    | Params.U
    | Params.S
    | Params.R
    | Params.E
    | Params.A;
}[LengthOf<T>];

type Equals<A, B> = (<T>() => T extends A ? 1 : 0) extends <T>() => T extends B
  ? 1
  : 0
  ? 1
  : 0;
