import { Either, Maybe } from "./data.typed";

console.log(Maybe.Nothing);
console.log(Maybe.Just(1));

Maybe.isNothing(Maybe.Nothing); // true
Maybe.isNothing(Maybe.Just(1)); // false

Maybe.isJust(Maybe.Nothing); // false
Maybe.isJust(Maybe.Just(1)); // true

Maybe.isMaybe(Maybe.Nothing); // true
Maybe.isMaybe(1); // false

Maybe.match(Maybe.Just(1), {
  Nothing: () => `Nothing` as const,
  Just: ({ value }) => `Just(${value})`,
});


Either.Left(1);
Either.Right(1);

Either.isLeft(Either.Left(1)); // true
Either.isLeft(Either.Right(1)); // false

Either.isRight(Either.Left(1)); // false
Either.isRight(Either.Right(1)); // true

const either = Either.Right(1) as Either.Either<string, number>;
Either.match(either, {
  Left: ({ value }) => `Left(${value})`,
  Right: ({ value }) => `Right(${value})`,
});