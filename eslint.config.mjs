import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
const securityPlugin = await import('eslint-plugin-security').then(
  (mod) => mod.default || mod,
);
const prettierConfig = await import('eslint-config-prettier').then(
  (mod) => mod.default || mod,
);

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      js,
      security: securityPlugin,
    },
    rules: {
      ...js.configs.recommended.rules, // brings in the recommended rules
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'double'],
      'security/detect-eval-with-expression': 'error',
    },
  },
  prettierConfig,
]);
