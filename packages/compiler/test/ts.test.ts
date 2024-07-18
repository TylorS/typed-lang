import { parse } from '@typed-lang/parser'
import { describe, expect, it } from 'vitest'
import { compileTs } from '../src/compile-ts.js'

describe('TS', () => {
  it("compiles data declarations with record constructors", () => { 
    const output = compileTsFromString(`data Maybe<A> = Nothing | Just{value: A}`)

    expect(output.root.fileName).toEqual(testFileName("test.typed"))
    expect(output.root.getFullText()).toEqual(`export * as Maybe from "./test.typed.Maybe.js"`)

    expect(output.modules.length).toEqual(1)

    const maybe = output.modules[0]

    expect(maybe.fileName).toEqual(testFileName("test.typed.Maybe.ts"))

    expect(maybe.getFullText()).toEqual(`export type Maybe<A> =  
  | Nothing
  | Just<A>
export interface Nothing {
  readonly _tag: 'Nothing'
}

export interface Just<A> {
  readonly _tag: 'Just'
  readonly value: A
}

export const Nothing: Nothing = { _tag: "Nothing" }
export const Just = <A>(params: { readonly value: A }): Just<A> => ({
  _tag: "Just",
  ...params,
})`)
  })

  it("compiles data declarations with tuple constructors", () => {
    const output = compileTsFromString(`data Maybe<A> = Nothing | Just(value: A)`)

    expect(output.root.fileName).toEqual(testFileName("test.typed"))
    expect(output.root.getFullText()).toEqual(`export * as Maybe from "./test.typed.Maybe.js"`)

    expect(output.modules.length).toEqual(1)

    const maybe = output.modules[0]

    expect(maybe.fileName).toEqual(testFileName("test.typed.Maybe.ts"))

    expect(maybe.getFullText()).toEqual(`export type Maybe<A> =  
  | Nothing
  | Just<A>
export interface Nothing {
  readonly _tag: 'Nothing'
}

export interface Just<A> {
  readonly _tag: 'Just'
  readonly value: A
}

export const Nothing: Nothing = { _tag: "Nothing" }
export const Just = <A>(value: A): Just<A> => ({
  _tag: "Just",
  value
})`)
  })
})

function testFileName(name: string) { 
  return new URL(name, import.meta.url).pathname
}

function compileTsFromString(code: string) {
  return compileTs(parse(testFileName("test.typed"), code))
}