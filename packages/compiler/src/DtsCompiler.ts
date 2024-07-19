import * as ts from "typescript";
import { CompilerService } from "./CompilerService.js";
import * as DTS from "./generators/dts/index.js";

export class DtsCompiler extends CompilerService {
  constructor(project?: ts.server.Project) {
    super(DTS.dtsSourceFileGenerator, ".d.ts", project);
  }

  isVirtualFile(fileName: string) { 
    return fileName.endsWith(".typed.d.ts");
  }
}
