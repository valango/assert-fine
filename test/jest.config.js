// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['*.js', '!.*'],
  coverageDirectory: 'reports',
  projects: [
    {
      rootDir: '.',
      testMatch: ['<rootDir>/test/back-*'],
      testEnvironment: 'node'
    },
    {
      rootDir: '.',
      testMatch: ['<rootDir>/test/front-*']
    }
  ],
  rootDir: '..',
  verbose: true
}
