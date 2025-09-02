import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next", "next/typescript"),
  { 
    rules: { 
      "react/no-unescaped-entities": "warn",
      "react-hooks/rules-of-hooks": "warn",
      // "@next/next/no-html-link": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    } 
  },
];

export default eslintConfig;
