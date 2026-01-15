import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      globals: globals.node,
      sourceType: "commonjs" 
    },
    plugins: { 
      js, 
      '@stylistic': stylistic 
    },
    extends: [js.configs.recommended],
    
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'windows'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }],

      'eqeqeq': ['error', 'always'],
      'no-console': 0, 
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }]
    }
  },
  {
    ignores: ["dist/**", "build/**", "node_modules/**", "eslint.config.mjs"]
  }
]);