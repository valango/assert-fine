'use strict'
/* eslint-env jest */

const tests = require('./tests')
// const browser = require('../browser')

describe('front-end: with assert npm package', () => {
  beforeAll(() => jest.resetModules())

  tests()
})

describe('front-end: without assert npm package', () => {
  beforeAll(() => {
    jest.resetModules()
    require('../browser').assert = undefined
  })

  tests()
})
