// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['*.js', '!*.config.js', '!.*'],
  coverageDirectory: 'reports',
  coveragePathIgnorePatterns: ['reports', 'test'],
  // displayName: 'client',
  // coverageProvider: 'babel',
  rootDir: '..',
  verbose: true
}
