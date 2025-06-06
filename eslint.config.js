import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * @type import('eslint').Linter.Config[]
 */
const configs = [
  {
    ignores: ["**/dist/**", "**/node_modules/**"]
  },
  {
    files: ["packages/*/src/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]

export default configs
