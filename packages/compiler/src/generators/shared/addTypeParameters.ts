import { TypeParameter } from "@typed-lang/parser";
import { MappedDocumentGenerator } from "../../MappedDocumentGenerator.js";
import { forEachNodeSeparator } from "./utils.js";

export function addTypeParameters(
  gen: MappedDocumentGenerator,
  typeParameters: ReadonlyArray<TypeParameter>
) {
  if (typeParameters.length === 0) return;

  gen.addText(`<`);

  forEachNodeSeparator(gen, typeParameters, `, `, (typeParameter) => {
    gen.addText(
      typeParameter.name,
      {
        span: typeParameter.span,
        name: typeParameter.name,
        content: typeParameter.name,
      }
    );
  });

  gen.addText(`>`);
}