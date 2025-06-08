import { describe, it, expect } from "vitest";
import { addDirectoryToProject, makeProject } from "../src/TypedLanguageService/TypedLanguageService";
import * as path from "node:path";

const FIXTURES_DIR = path.resolve(__dirname, "__fixtures__")

describe("Project", () => {
  it('compiles .typed files', () => { 
    const project = makeProject({
      directory: FIXTURES_DIR,
    })

    addDirectoryToProject(project, FIXTURES_DIR)

    expect(project.getFileNames().map(f => path.relative(FIXTURES_DIR, f))).toMatchInlineSnapshot(`
      [
        "Maybe.typed.ts",
      ]
    `)

    const outputFiles = project.emit().map(f => ({ ...f, name: path.relative(FIXTURES_DIR, f.name) }))

    expect(outputFiles.length).toBe(4)
    expect(outputFiles[0]).toMatchInlineSnapshot(`
      {
        "name": "dist/Maybe.typed.js.map",
        "text": "{"version":3,"file":"Maybe.typed.js","mappings":";;;;AAAA,IAAYA,KAAKA,CAA8B;AAA/C,WAAYA,KAAKA;IAAMC,aAAOA,sBAAA;IAAGC,UAAIA,IAACC,KAAQC,EAAA;oBAATF;QAACC,KAAKA;MAAI;IAAxB,eAAO,IAAX,OAAWF,2BAAA;IAAG,YAAI,IAAlB,OAA2B,wBAAC;IAAnC,aAAK,WAAE;;;;;;;;;KAA4B;IAA/C,SAAM,MAAa;;KAA4B;IAAzC,mBAAyC;CAAA,EAAnCD,KAAKA,qBAALA,KAAKA,QAA8B","names":["Maybe","Nothing","Just","value","A"],"ignoreList":[],"sources":["/Users/tylorsteinbergher/code/typed-lang/packages/compiler/test/__fixtures__/Maybe.typed"],"sourcesContent":["export data Maybe<A> = Nothing | Just(value: A)"]}",
        "writeByteOrderMark": false,
      }
    `)

    expect(outputFiles[1]).toMatchInlineSnapshot(`
      {
        "name": "dist/Maybe.typed.js",
        "text": ""use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Maybe = void 0;
      const typedlib_1 = require("@typed-lang/typedlib");
      var Maybe;
      (function (Maybe) {
          Maybe.Nothing = { _tag: "Nothing" };
          Maybe.Just = (value) => ({
              _tag: "Just",
              value
          });
          Maybe.isNothing = (maybe) => maybe._tag === "Nothing";
          Maybe.isJust = (maybe) => maybe._tag === "Just";
          Maybe.isMaybe = (value) => {
              if (!(0, typedlib_1.hasProperty)(value, "_tag"))
                  return false;
              switch (value._tag) {
                  case "Nothing":
                  case "Just":
                      return true;
                  default: return false;
              }
          };
          function match(maybe, matchers) {
              return matchers[maybe._tag](maybe);
          }
          Maybe.match = match;
      })(Maybe || (exports.Maybe = Maybe = {}));
      //# sourceMappingURL=Maybe.typed.ts.map
      //# sourceMappingURL=Maybe.typed.js.map",
        "writeByteOrderMark": false,
      }
    `)

    expect(outputFiles[2]).toMatchInlineSnapshot(`
      {
        "name": "dist/Maybe.typed.d.ts.map",
        "text": "{"version":3,"file":"Maybe.typed.d.ts","mappings":"AAAA,yBAAYA,KAAKA;IAAjB,KAAYA,KAAKA,CAACC,CAACA,IAAIC,OAAOA,GAAGC,IAAIA,CAAQF,CAACA,CAAC;IAAxB,UAAAC,OAAOA;gCAAAA;KAAA;IAAG,UAAAC,IAAIA,CAAQF,CAACA;6BAATE;wBAAQF,CAACA;KAAC;IAAzC,MAAiBC,OAAOA,EAAPA,OAAO;IAAxB,MAA2BC,IAAIA,GAAQ,MAAAF,CAACA,EAARG,OAAOH,CAACA,KAAbE,IAAIA,CAAQF,CAACA,CAAC;IAAzC,MAAiB,SAAO,GAAZ,MAAAA,CAACA,EAAA,OAAPD,KAAKA,CAACC,CAACA,CAAA,cAAIC,OAAO;IAAxB,MAA2B,MAAI,GAAnB,MAAAD,CAACA,EAAA,OAAPD,KAAKA,CAACC,CAACA,CAAA,cAAcE,IAAIA,CAAQF,CAACA,CAAC;IAAzC,MAAM,OAAK,+BAALD,KAAKA,CAACK,OAACA,CAA4B;IAA/C,SAAM,MAAYJ,CAACA,EAAA,qCAAPD,KAAKA,CAACC,CAACA,CAAA;QAAIC,OAAOA,YAAPA,OAAOA;QAAGC,IAAIA,SAAJA,IAAIA,CAAQF,CAACA,CAAA;0BAAC;CAAA","names":["Maybe","A","Nothing","Just","value","unknown"],"ignoreList":[],"sources":["/Users/tylorsteinbergher/code/typed-lang/packages/compiler/test/__fixtures__/Maybe.typed"],"sourcesContent":["export data Maybe<A> = Nothing | Just(value: A)"]}",
        "writeByteOrderMark": false,
      }
    `)

    expect(outputFiles[3]).toMatchInlineSnapshot(`
      {
        "name": "dist/Maybe.typed.d.ts",
        "text": "export declare namespace Maybe {
          type Maybe<A> = Nothing | Just<A>;
          interface Nothing {
              readonly _tag: "Nothing";
          }
          interface Just<A> {
              readonly _tag: "Just";
              readonly value: A;
          }
          const Nothing: Nothing;
          const Just: <const A>(value: A) => Just<A>;
          const isNothing: <const A>(maybe: Maybe<A>) => maybe is Nothing;
          const isJust: <const A>(maybe: Maybe<A>) => maybe is Just<A>;
          const isMaybe: (value: unknown) => value is Maybe<unknown>;
          function match<A, const Return1, const Return2>(maybe: Maybe<A>, matchers: {
              Nothing: (nothing: Nothing) => Return1;
              Just: (just: Just<A>) => Return2;
          }): Return1 | Return2;
      }
      //# sourceMappingURL=Maybe.typed.d.ts.map",
        "writeByteOrderMark": false,
      }
    `)

  })
})
