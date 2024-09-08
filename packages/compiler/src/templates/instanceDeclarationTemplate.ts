import { InstanceDeclaration } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { expressionTemplate } from "./expressionTemplate.js";
import { typeParametersTemplate } from "./typeParametersTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";

// TODO: We need much better support for HKTs
export function instanceDeclarationTemplate(
  decl: InstanceDeclaration
): Interpolation {
  const exportName = decl.name.text.toLowerCase();

  return t.many(
    t`export const `,
    exportName,
    `: `,
    t.identifier(decl.name),
    typeParametersTemplate(decl.typeParameters.flatMap(unwrapHkt), {
      parameterVariance: false,
      functionDefaultValue: false,
      constants: false,
    }),
    t` = {`,
    t.newLine(),
    t.indent(
      t.intercolate(t`,${t.newLine()}`)(
        decl.fields.map((f) =>
          t.many(t.identifier(f.name), t`: `, expressionTemplate(f.expression))
        )
      )
    ),
    t.newLine(),
    t`}`
  );
}
