module.exports = {
  ignorePatterns: ['dist/**/*.js', 'bk/**/*.js', 'coverage/**/*.js', '**/.*.js'],
  extends: ['@munierujp/eslint-config-typescript', 'plugin:jest/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'sonarjs/no-duplicate-string': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
  },
}
