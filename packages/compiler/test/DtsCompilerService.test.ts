import { describe, expect, it } from "vitest";
import { DtsCompilerService } from "../src/DtsCompilerService";
import { writeFileSync } from "node:fs";
import {
  SourceMapInput,
} from "@jridgewell/trace-mapping";
import { fromMap, toEncodedMap } from "@jridgewell/gen-mapping";
import { join } from "node:path";

describe("DtsCompilerService", () => {
  it("does things", () => {
    const service = new DtsCompilerService();
    const fileName = "test.typed";
    const code = `data Maybe<A> = Nothing | Just { value: A }`;
    const snapshot = service.compile(fileName, code);

    expect(snapshot.fileName).toEqual(fileName);
    expect(snapshot.source).toEqual(code);
    console.log(snapshot.getText())
    expect(snapshot.getText()).toEqual(`export declare namespace Maybe {
  export type Maybe<A> = 
    | Nothing
    | Just<A>;
}`);
    
    const tsPath = join(`/Users/tylor/Desktop`, fileName + '.ts')
    const mapPath = tsPath + '.map'

    writeFileSync(tsPath, snapshot.getText());
    writeFileSync(
      mapPath,
      JSON.stringify(toEncodedMap(fromMap(snapshot.map as SourceMapInput)))
    );
    console.log(snapshot.map.mappings);
  });
});
