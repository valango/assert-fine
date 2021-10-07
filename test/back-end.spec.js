'use strict'
/* eslint-env jest */

/**
 * @jest-environment node
 */

const tests = require('./tests')

describe('back-end', () => {
  jest.resetModules()

  const target = require('..')

  // tests(target, '')
  tests(target, 'strict ')
})
