import * as ts from "typescript";
import { CompilerService } from "./CompilerService.js";
import * as TS from "./generators/ts/index.js";
import { TypedSnapshot } from "./snapshots.js";
import remapping from "@ampproject/remapping";

const TYPED_SUB_MODULE_REGEX = /\.typed\.(.+)\.ts$/;
const TYPED_EXTENSION = ".typed";
const TYPED_TS_EXTENSION = TYPED_EXTENSION + ".ts";

export class TsCompiler extends CompilerService {
  constructor(project?: ts.server.Project) {
    super(TS.tsSourceFileGenerator, ".ts", project);
  }

  isVirtualFile(fileName: string) {
    return (
      fileName.endsWith(TYPED_TS_EXTENSION) || TYPED_SUB_MODULE_REGEX.test(fileName)
    );
  }

  isTypedTsFile(fileName: string) {
    return fileName.endsWith(TYPED_TS_EXTENSION);
  }

  isTypedSubModule(fileName: string) {
    return TYPED_SUB_MODULE_REGEX.test(fileName);
  }

  transpile(snapshot: TypedSnapshot, fileName: string) {
    const content = snapshot.getText();
    const root = ts.transpileModule(content.replace(sourceMappingUrlRegex, ''), {
      fileName,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        sourceMap: true,
      },
    });
  
    const oldMap = snapshot.map;
    const newMap = JSON.parse(root.sourceMapText!);
    newMap.sourcesContent = [content];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remapped = (remapping as any)([newMap, oldMap], () => null);
  
    return {
      code: root.outputText,
      map: JSON.stringify(remapped),
    };
  }
}

const sourceMappingUrlRegex = /\/\/# sourceMappingURL=(.*)/;