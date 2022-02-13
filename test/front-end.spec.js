'use strict'
/* eslint-env jest */

const tests = require('./tests')
const saved = process.browser

describe('front-end default', () => {
  process.browser = true
  jest.resetModules()

  tests(require('..'), '')
})

describe('front-end w assert', () => {
  afterAll(() => (process.browser = saved))

  process.browser = true
  jest.resetModules()
  tests(require('..'), '', require('assert'))
  jest.resetModules()
  tests(require('..'), 'strict ', require('assert'))
})
