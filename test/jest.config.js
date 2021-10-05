// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js', '!.*'],
  coverageDirectory: 'reports',
  projects: [
    {
      rootDir: '.',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/back-*', '<rootDir>/test/fo*']
    },
    {
      rootDir: '.',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/front-*']
    }
  ],
  rootDir: '..',
  verbose: true
}
