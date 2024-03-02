module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['@react-native', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'unused-imports'],
  rules: {
    'unused-imports/no-unused-imports': 'error',
  },
};
