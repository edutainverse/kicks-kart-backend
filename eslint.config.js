import js from '@eslint/js';

export default [
  // Global ignore patterns
  { ignores: ['node_modules/**', 'coverage/**', 'dist/**', 'src/scripts/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Node globals
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'error',
    },
  },
  // Jest/test override
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
