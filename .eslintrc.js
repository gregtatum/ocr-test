module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['./'],
      },
    },
  },
  plugins: ['import', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',

    // Typescript
    '@typescript-eslint/no-inferrable-types': 'off',
    // Inferring trivial types is fine.
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // This can be helpful.
    '@typescript-eslint/no-explicit-any': 'off',
    // There are lots of legitimate uses of require.
    '@typescript-eslint/no-var-requires': 'off',
    // I don't care about the Function type restriction.
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: { Function: false },
      },
    ],
    // Providing empty functions is useful for noops.
    '@typescript-eslint/no-empty-function': 'off',

    // Only use the TypeScript variant.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Plugin rules:
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/export': 'error',
    'import/no-default-export': 'error',

    'react/no-access-state-in-setstate': 'error',
    'react/no-danger': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-will-update-set-state': 'error',
    'react/no-redundant-should-component-update': 'error',
    'react/no-typos': 'error',
    // `no-unused-prop-types` is buggy when we use destructuring parameters in
    // functions as it misunderstands them as functional components.
    // See https://github.com/yannickcr/eslint-plugin-react/issues/1561
    // 'react/no-unused-prop-types': 'error',
    'react/no-unused-state': 'error',
    'react/jsx-no-bind': 'error',

    // overriding recommended rules
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-console': ['error', { allow: ['log', 'warn', 'error'] }],

    // possible errors
    'array-callback-return': 'error',
    'consistent-return': 'error',
    'default-case': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'for-direction': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-label': 'error',
    'no-implied-eval': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-useless-call': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-concat': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-const': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
  },
  ignorePatterns: ['bin', 'build', 'dist', 'node_modules'],
};
