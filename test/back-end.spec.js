'use strict'
/* eslint-env jest */

const tests = require('./tests')

describe('back-end', () => {
  jest.resetModules()

  const target = require('..')

  // tests(target, '')
  tests(target, 'strict ')
})
