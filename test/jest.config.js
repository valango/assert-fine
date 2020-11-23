// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['*.js', '!.*'],
  coverageDirectory: 'reports',
  rootDir: '..',
}
