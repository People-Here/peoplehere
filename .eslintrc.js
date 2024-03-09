module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier',
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'no-console': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['warn', {before: false, after: true}],
    '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
  },
};
