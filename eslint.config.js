import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { createRequire } from "node:module";
import tseslint from "typescript-eslint";

const require = createRequire(import.meta.url);
const eslintConfigPrettier = require("eslint-config-prettier/flat");

export default defineConfig([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      curly: "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "id-length": [
        "warn",
        {
          min: 2,
          max: 64,
          properties: "never",
          exceptions: [
            "_",
            "x",
            "y",
            "z",
            "i",
            "j",
            "k",
            "t",
            "n",
            "id",
            "to",
            "T",
            "K",
            "V",
            "U",
            "E",
            "P",
            "R",
            "S",
          ],
        },
      ],
      "@typescript-eslint/member-ordering": [
        "warn",
        {
          default: {
            optionalityOrder: "required-first",
            memberTypes: [
              "signature",
              "call-signature",
              "field",
              "get",
              "set",
              "method",
              "constructor",
            ],
          },
          interfaces: { optionalityOrder: "required-first" },
          typeLiterals: { optionalityOrder: "required-first" },
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "typeParameter", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
        { selector: "variable", modifiers: ["destructured"], format: null },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "forbid",
          trailingUnderscore: "forbid",
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        { selector: "objectLiteralProperty", format: null },
        {
          selector: "typeProperty",
          format: ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
          leadingUnderscore: "forbid",
        },
        {
          selector: "objectLiteralMethod",
          format: ["camelCase", "PascalCase"],
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
