import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.config} */
export default [
  // 無視するファイルやディレクトリを指定
  {
    ignores: ["**/*.d.ts", "dist/**/*"],
  },
  // srcディレクトリ内のJavaScriptおよびTypeScriptファイルに適用する設定
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  // JavaScriptの推奨設定を適用
  pluginJs.configs.recommended,
  // TypeScriptの推奨設定を適用
  ...tseslint.configs.recommended,
  // Prettierの設定を適用
  eslintConfigPrettier,
];
