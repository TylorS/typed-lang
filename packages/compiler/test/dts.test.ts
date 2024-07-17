import { parse, tokenize } from '@typed/parser'
import { describe, expect, it } from 'vitest'
import { compileDts } from '../src/compile-dts'

describe('DTS', () => {
  it("compiles data declarations with record constructors", () => { 
    const output = compileDtsFromString(`data Maybe<A> = Nothing | Just{value: A}`)

    expect(output).toEqual(`export declare namespace Maybe {
  export type Maybe<A> =  
    | Nothing
    | Just<A>

  export interface Nothing {
    readonly _tag: 'Nothing'
  }
  
  export interface Just<A> {
    readonly _tag: 'Just'
    readonly value: A
  }
  
  export declare const Nothing: Nothing
  export declare const Just: <A>(params: { readonly value: A }) => Just<A>
}`)
  })

  it("compiles data declarations with tuple constructors", () => { 
    const output = compileDtsFromString(`data Maybe<A> = Nothing | Just(value: A)`)

    expect(output).toEqual(`export declare namespace Maybe {
  export type Maybe<A> =  
    | Nothing
    | Just<A>

  export interface Nothing {
    readonly _tag: 'Nothing'
  }
  
  export interface Just<A> {
    readonly _tag: 'Just'
    readonly value: A
  }
  
  export declare const Nothing: Nothing
  export declare const Just: <A>(value: A) => Just<A>
}`)
  })
})

function compileDtsFromString(code: string) {
  return compileDts(parse(tokenize(code)))
}