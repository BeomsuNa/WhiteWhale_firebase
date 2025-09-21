module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/generated/**/*', // Ignore generated files.
  ],
  overrides: [
    {
      files: ['functions/**/*.ts', 'functions/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // 루트 기준 경로로 명시
        project: ['./functions/tsconfig.dev.json'],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    quotes: ['error', 'double'],
    'import/no-unresolved': 0,
    indent: ['error', 2],
  },
};
