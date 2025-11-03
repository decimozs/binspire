// packages/eslint/vite.ts
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export const config = defineConfig({
  ignores: ["dist"],
  files: ["**/*.{ts,tsx}"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
});
