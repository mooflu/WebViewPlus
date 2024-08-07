import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "eslint.config.mjs",
        "**/build/*",
        "**/config/*",
        "**/node_modules/*",
        "**/scripts/*",
        "**/publicPathSetup.ts",
        "**/*test.js",
        "**/*test.ts",
        "**/*test.tsx",
    ],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/warnings",
    "airbnb",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        "jsx-a11y": fixupPluginRules(jsxA11Y),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "18.0",
        },

        "import/internal-regex": "^src/",
    },

    rules: {
        "arrow-body-style": 0,

        "arrow-parens": ["warn", "as-needed", {
            requireForBlockBody: true,
        }],

        "class-methods-use-this": 0,
        "function-call-argument-newline": ["warn", "consistent"],
        "function-paren-newline": ["warn", "consistent"],
        indent: ["warn", 4],

        "lines-between-class-members": ["warn", "always", {
            exceptAfterSingleLine: true,
        }],

        "max-classes-per-file": 0,

        "max-len": ["warn", 120, {
            ignoreComments: true,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
            ignorePattern: "^import .+ from '",
        }],

        "operator-linebreak": 0,
        "no-continue": 0,
        "no-empty-function": 0,
        "no-mixed-operators": 0,

        "no-param-reassign": ["error", {
            props: false,
        }],

        "no-plusplus": ["warn", {
            allowForLoopAfterthoughts: true,
        }],

        "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
        "no-shadow": 0,
        "no-undef": 0,
        "no-unused-vars": 0,
        "no-use-before-define": 0,
        "no-useless-constructor": 0,
        "no-restricted-exports": 0,

        "object-curly-newline": ["warn", {
            consistent: true,
        }],

        "prefer-destructuring": 0,

        "import/extensions": ["error", "never", {
            ico: "always",
            scss: "always",
            png: "always",
            jpg: "always",
            svg: "always",
        }],

        "import/no-import-module-exports": 0,
        "import/no-unresolved": 0,
        "import/prefer-default-export": 0,

        "import/order": ["error", {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],

            pathGroups: [{
                pattern: "react|react*",
                group: "external",
                position: "before",
            }, {
                pattern: "zustand?*",
                group: "external",
                position: "after",
            }, {
                pattern: "@mui/**",
                group: "external",
                position: "after",
            }, {
                pattern: "@react*/**",
                group: "external",
                position: "after",
            }, {
                pattern: "three-stdlib/**",
                group: "external",
                position: "after",
            }, {
                pattern: "@*/**",
                group: "internal",
                position: "after",
            }],

            pathGroupsExcludedImportTypes: ["builtin", "object"],
            "newlines-between": "always",
        }],

        "@typescript-eslint/ban-ts-comment": 0,
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "@typescript-eslint/no-explicit-any": 0,

        "@typescript-eslint/no-unused-vars": ["warn", {
            vars: "all",
            args: "none",
        }],

        "@typescript-eslint/no-useless-constructor": ["error"],
        "@typescript-eslint/triple-slash-reference": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "react/destructuring-assignment": 0,
        "react/function-component-definition": 0,

        "react/jsx-filename-extension": ["error", {
            extensions: [".jsx", ".tsx"],
        }],

        "react/jsx-indent": ["warn", 4],
        "react/jsx-indent-props": ["warn", 4],
        "react/jsx-no-useless-fragment": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/jsx-props-no-spreading": 0,
        "react/no-danger": 0,

        "react/no-unstable-nested-components": ["error", {
            allowAsProps: true,
        }],

        "react/prop-types": 0,
        "react/require-default-props": 0,

        "react/sort-comp": ["warn", {
            order: ["instance-variables", "lifecycle", "everything-else", "rendering"],

            groups: {
                lifecycle: [
                    "defaultProps",
                    "constructor",
                    "getDerivedStateFromProps",
                    "componentWillMount",
                    "componentDidMount",
                    "componentWillReceiveProps",
                    "shouldComponentUpdate",
                    "componentWillUpdate",
                    "getSnapshotBeforeUpdate",
                    "componentDidUpdate",
                    "componentDidCatch",
                    "componentWillUnmount",
                ],

                rendering: ["/^render.+$/", "render"],
            },
        }],

        "react/static-property-placement": 0,
        "react-hooks/exhaustive-deps": 0,
        "jsx-a11y/media-has-caption": 0,
    },
}];