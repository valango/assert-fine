'use strict'
/* eslint-env jest */

const tests = require('./tests')

describe('back-end', () => {
  beforeAll(() => jest.resetModules())

  tests()
})
