// https://jestjs.io/docs/en/configuration
module.exports = {
  bail: 1,
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js', '!.*'],
  coverageDirectory: '../reports',
  projects:[
    {
      rootDir: '.',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/test/(ba|fo)*.spec.js']
    },
    {
      rootDir: '.',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/test/f*.spec.js']
    }
  ]
}
