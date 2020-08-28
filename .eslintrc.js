module.exports =  {
  root: true,
  env: {
    'node': true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2015,
    // parser: 'babel-eslint'
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-multiple-empty-lines': 'warn',
    'no-trailing-spaces': 'warn',
    'no-unused-vars': 'warn'
  }
}
