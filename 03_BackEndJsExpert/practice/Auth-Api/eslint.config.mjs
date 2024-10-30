import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  {
    // Disable ESLint for .test.js files
    files: ["**/*.test.js"],
    rules: {
      // Disable all rules for .test.js files
      "no-unused-expressions": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      // Add any other rules you want to disable
    },
  },
];