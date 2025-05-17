const globals = require("globals");
const eslintJs = require("@eslint/js");
const eslintPluginAstro = require("eslint-plugin-astro");
const tseslint = require("typescript-eslint");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  // 1. Global ignores
  {
    ignores: [".astro/**", "dist/**", "node_modules/**", "eslint.config.cjs"],
  },

  // 2. Global language options and recommended base rules
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  eslintJs.configs.recommended,

  // 3. TypeScript configurations
  // Apply recommended TypeScript rules globally for .ts files
  // tseslint.config will spread its configurations into this array
  ...tseslint.config({
    files: ["**/*.ts", "**/*.tsx"], // Ensure this applies only to TS/TSX
    extends: [
      ...tseslint.configs.recommended,
      // ...tseslint.configs.recommendedTypeChecked, // Optional: for type-aware linting
    ],
    // languageOptions: { // Optional: for type-aware linting
    //   parserOptions: {
    //     project: true,
    //     tsconfigRootDir: __dirname,
    //   },
    // },
  }),

  // 4. Astro configurations
  // Spread the recommended flat configs from eslint-plugin-astro
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  // Explicitly define parser and other settings for .astro files
  // This ensures it overrides any broader parser settings for these files.
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: eslintPluginAstro.parser, // Use the parser from eslint-plugin-astro
      parserOptions: {
        parser: tseslint.parser, // Specify TS parser for <script> tags within Astro
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      // Astro-specific rule overrides can go here
      // e.g., 'astro/no-set-html-directive': 'error',
      "no-console": "error", // Explicitly enable for Astro files
    },
  },

  // 5. Prettier (must be last to override other formatting rules)
  eslintConfigPrettier,
];
