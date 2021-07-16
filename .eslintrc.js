/** @type {import("eslint").Linter.Config } */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // TODO: These rules should be re-enabled and the resulting linting errors should be fixed.
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
  },
};
