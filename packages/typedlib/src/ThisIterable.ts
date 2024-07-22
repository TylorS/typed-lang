import type { Pipeable } from "./Pipeable.js"
import { Class } from "./Pipeable.js"

export interface ThisIterable<A> extends Pipeable {
  [Symbol.iterator](): Iterator<this, A>
}

class ThisIterableImpl<A> extends Class implements ThisIterable<A> {
  [Symbol.iterator](): Iterator<this, A> {
    return new OnceIterator(this)
  }
}

export const ThisIterable: new<A>() => ThisIterable<A> = ThisIterableImpl

export class OnceIterator<A, R = unknown> implements Iterator<A, R> {
  private done = false
  constructor(readonly value: A) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next(value: any) {
    if (this.done) {
      return { done: true, value }
    } else {
      this.done = true
      return { done: false, value: this.value }
    }
  }
}
