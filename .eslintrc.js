module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    node: true
  },
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // add your custom rules here
  rules: {
    'one-var': 0,
    'no-var': 2,
    'no-console': 1,
    'no-multi-spaces': 0,
    'no-proto': 1,
    'no-unused-vars': 1,
    'no-useless-catch': 1,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    'no-unreachable': 1,
    'no-useless-return': 1,
    'object-curly-spacing': 0,
    quotes: ['error', 'single', { avoidEscape: true }]
  }
}
