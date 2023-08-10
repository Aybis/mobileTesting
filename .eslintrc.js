module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '@react-native',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  overrides: [],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __src,
    sourceType: 'module',
  },
  rules: {},
};
