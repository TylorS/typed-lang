import * as ts from "typescript";
import { CompilerService } from "./CompilerService.js";
import { TypedSnapshot } from "./snapshots.js";
import remapping from "@ampproject/remapping";
import { Interpolation, t } from "./Template.js";
import { declarationTemplate } from "./templates/declarationTemplate.js";
import { SourceFile, Statement } from "@typed-lang/parser";
import { MappedDocumentGenerator } from "./MappedDocumentGenerator.js";
import { statementTemplate } from "./templates/expressionTemplate.js";

const TYPED_SUB_MODULE_REGEX = /\.typed\.(.+)\.ts$/;
const TYPED_EXTENSION = ".typed";
const TYPED_TS_EXTENSION = TYPED_EXTENSION + ".ts";

export interface TsCompilerOptions {
  // Determines if the output should be a single module or multiple modules
  readonly outputMode: "single" | "multiple";
  // Determines if the output should include declaration files
  readonly declaration: boolean;
}

const defaultOptions: TsCompilerOptions = {
  outputMode: "multiple",
  declaration: false,
};

export class TsCompiler extends CompilerService {
  constructor({
    outputMode = defaultOptions.outputMode,
    declaration = defaultOptions.declaration,
  }: Partial<TsCompilerOptions> = {}) {
    super(
      (m, f) => {
        if (outputMode === "single") {
          m.runInterpolation(singleModuleTemplate(f));
        } else {
          runMultipleModuleTemplates(m, f);
        }

        if (declaration) {
          // TODO: Generate DTS files
        }
      },
      ".ts",
      outputMode
    );
  }

  isVirtualFile(fileName: string) {
    return (
      fileName.endsWith(TYPED_TS_EXTENSION) ||
      TYPED_SUB_MODULE_REGEX.test(fileName)
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
    // TODO: We should be able to accept a LanguageService and emit this file with its DTS and maps
    const root = ts.transpileModule(
      content.replace(sourceMappingUrlRegex, ""),
      {
        fileName,
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
        },
      }
    );

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

function singleModuleTemplate(file: SourceFile): Interpolation {
  return t.span(file.span)(
    t.intercolate(t.newLine())(
      file.statements.map(singleModuleDeclarationTemplate)
    )
  );
}

function runMultipleModuleTemplates(
  gen: MappedDocumentGenerator,
  file: SourceFile
): void {
  gen.withSpan({ span: file.span }, (gen) => {
    for (let i = 0; i < file.statements.length; i++) {
      const decl = file.statements[i];
      if (decl._tag === "DataDeclaration") {
        gen.addModule(
          file.fileName + "." + decl.name.text + ".ts",
          decl.span,
          (gen) => {
            gen.runInterpolation(declarationTemplate(decl));
          }
        );
      } else {
        gen.runInterpolation(statementTemplate(decl));
      }

      if (i < file.statements.length - 1) {
        gen.addNewLine();
      }
    }
  });
}

function singleModuleDeclarationTemplate(decl: Statement): Interpolation {
  switch (decl._tag) {
    case "DataDeclaration":
      return t.span(decl.span)(
        decl.exported ? t`${t.span(decl.exported)(`export`)} ` : "",
        `namespace `,
        t.identifier(decl.name),
        ` {`,
        t.newLine(),
        t.indent(declarationTemplate(decl)),
        t.newLine(),
        `}`
      );
    default:
      return statementTemplate(decl);
  }
}
