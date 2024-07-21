import { Identifier, PropertyAccess } from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";

export function identiferOrPropertyAccess(
  ident: Identifier | PropertyAccess
): Interpolation {
  switch (ident._tag) {
    case "Identifier":
      return t.identifier(ident);
    case "PropertyAccess":
      return t`${ident.left.text + "."}${identiferOrPropertyAccess(
        ident.right
      )}`;
  }
}