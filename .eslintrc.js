module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'eslint-config-prettier', 'next'],
  plugins: ['@typescript-eslint', 'unused-imports', 'eslint-plugin-prettier'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'unused-imports/no-unused-imports': 'error',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': 'off', // we must disable this rule to activate the below @typescript rule
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: "Please import from 'lodash/module' directly to support tree-shaking.",
          },
        ],
      },
    ],
  },
}
