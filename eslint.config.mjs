// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
// eslint-config-next 16 ships flat configs; wrapping them in FlatCompat crashes ESLint.
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: [".next/**", "out/**", "build/**", "storybook-static/**", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTs,
  ...storybook.configs["flat/recommended"]
];

export default eslintConfig;
