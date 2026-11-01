import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

// Layer rules from docs/ARCHITECTURE.md. Never disable these to get past them.
const CORE = { regex: '(^|/)core(/|$)', message: 'components/ must not import from core/ (not even types).' };
const CORE_NON_HOOK = {
  regex: '(^|/)core/(?!(.*/)?use[A-Z][^/]*$)',
  message: 'App.tsx may only import hooks (core/**/use*.ts), never pure core functions.',
};
const COMPONENTS = { regex: '(^|/)components(/|$)', message: 'core/ must not import components.' };
const STYLES = { regex: '\\.s?css$', message: 'core/ must not import styles.' };
const REACT = { regex: '^react(-dom)?(/|$)', message: 'Only core/**/use*.ts may import React.' };

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-exports': [
        'error',
        { restrictDefaultExports: { direct: true, named: true, defaultFrom: true, namedFrom: true, namespaceFrom: true } },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [CORE] }] },
  },
  {
    files: ['src/App.tsx'],
    rules: { 'no-restricted-imports': ['error', { patterns: [CORE_NON_HOOK] }] },
  },
  {
    files: ['src/core/**/use*.ts'],
    rules: { 'no-restricted-imports': ['error', { patterns: [COMPONENTS, STYLES] }] },
  },
  {
    files: ['src/core/**/*.ts'],
    ignores: ['src/core/**/use*.ts'],
    languageOptions: { globals: {} },
    rules: {
      'no-restricted-imports': ['error', { patterns: [REACT, COMPONENTS, STYLES] }],
      'no-restricted-globals': ['error', 'window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'fetch'],
      'no-restricted-properties': [
        'error',
        { object: 'Date', property: 'now', message: 'Core functions must be pure.' },
        { object: 'Math', property: 'random', message: 'Core functions must be pure.' },
      ],
    },
  },
);
