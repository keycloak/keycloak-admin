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
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
  },
  overrides: [
    {
      files: ["src/stories/**", "*.test.*"],
      rules: {
        // For stories and tests it can make sense to pass empty functions as mocks.
        "@typescript-eslint/no-empty-function": "off",
      },
    },
  ],
};
