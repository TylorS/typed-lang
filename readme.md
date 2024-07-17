# Typed Language

Typed is a domain-specific language designed specifically for domain modeling and code generations. Typed compiles directly to TypeScript, and can be utilized directly from within your TypeScript projects with our TypeScript Plugin.

TypeScript today is already quite good at data modeling, but it is often very verbose to define even simple branded types, nevermind when utilizing higher-kinded types.

Typed is capable of describing your domain model succinctly, and doing the boring work
of boilerplate through code generation.

## Features

#### Refinements

##### Time Units

### Data Constructors

Every data constructor is compiled into a ES Module all of its own to allow for tree-shaking of unused functionality.

#### Tuple Syntax

```typed
// data.typed
export data Maybe<A> = Nothing | Just(A)
```

```ts
import { Maybe } from './data.typed'

const nothing: Maybe.Nothing = Maybe.Nothing
const just: Maybe.Just<number> = Maybe.Just(1)
...
```

#### Record Syntax

```typed
// data.typed
export data Maybe<A> = Nothing | Just { value: A  }
```

```ts
import { Maybe } from './data.typed'

const nothing: Maybe.Nothing = Maybe.Nothing
const just: Maybe.Just<number> = Maybe.Just({ value: 1 })
...
```

### Type Aliases

Every Type Alias is compiled into a ES Module all of its own to allow for tree-shaking of unused functionality.

#### Records

Records are key-value pairs where each key is associated with a type. They are defined using the `{ field: TYPE }` syntax. This is useful for representing objects with a fixed shape.

```typed
// Define a User record with id and name fields
export type User = { id: Int, name: String }
```

```ts
import { User } From './model.typed'

// Make a User, throws if not valid
const user = User.make({
  id: 42,
  name: "Typed"
})

// 
const json = User.toJson(user)

// Decode without throwing
const decodeResult = User.decode({
  id: 42,
  name: "Typed"
})

// Guards
assert.ok(User.is(user))
assert.ok(!User.is(null))
assert.ok(!User.is({}))

```

#### Arrays

Arrays represent a collection of elements of the same type. They are defined using the `Array<TYPE>` syntax. This is ideal for lists of items where each item shares the same type.

```typed
// Define an array of integers
export type IntArray = Array<Int>

// Define an array of User records
export type UserArray = Array<User>
```

#### Tuples

Tuples allow you to create a fixed-size array where each element can have a different type. They are defined using the `[TYPE1, TYPE2]` syntax. Tuples are perfect for pairing related values together.

```typed
// Define a tuple with an integer and a string
type IntStringTuple = [Int, String]

// Define a tuple representing a key-value pair
type KeyValuePair = [String, Any]
```

#### Variadic Tuples

Variadic tuples extend the concept of tuples by allowing you to specify a variable number of types. They are defined using the `[...TYPES1, TYPE2, ...TYPES3]` syntax. This is useful for function arguments, array manipulation, and more.

```typed
// Define a variadic tuple with any number of integers followed by a string
type IntsThenString = [...Array<Int>, String]

// Define a variadic tuple representing a mixed list with a string, any number of integers, and a boolean at the end
type MixedList = [String, ...Array<Int>, Boolean]
```

Type Aliases in Typed offer a flexible way to define complex data structures, enhancing the readability and maintainability of your domain models.


### Branded Types

```typed
// Id.typed
export brand Id = string
```

```ts
import { Id } from './Id.typed'

const id: Id.Type = Id.make("typed")
```