import * as ts from "typescript";
import { CompilerService } from "./CompilerService.js";
import * as TS from "./generators/ts/index.js";

const TYPED_SUB_MODULE_REGEX = /\.typed\.(.+)\.ts$/

export class TsCompiler extends CompilerService {
  constructor(project?: ts.server.Project) {
    super(TS.tsSourceFileGenerator, ".ts", project);
  }

  isVirtualFile(fileName: string) { 
    return fileName.endsWith(".typed.ts") || TYPED_SUB_MODULE_REGEX.test(fileName);
  }

  isTypedTsFile(fileName: string) { 
    return fileName.endsWith(".typed.ts");
  }

  isTypedSubModule(fileName: string) { 
    return TYPED_SUB_MODULE_REGEX.test(fileName);
  }
}
