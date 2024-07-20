import { Either, Maybe } from "./data.typed";

console.log(Maybe.Nothing);
console.log(Maybe.Just(1));

console.log(Either.Left("uh-oh"));
console.log(Either.Right(1));