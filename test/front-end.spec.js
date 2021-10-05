'use strict'
/* eslint-env jest */


const tests = require('./tests')

describe('front-end', () => {
  const saved = process.browser

  afterAll(() => (process.browser = saved))

  process.browser = true
  jest.resetModules()

  const target = require('..')

  it('should load', () => {
    expect(target.ok).toBe(target)
    expect(target.strict).toBe(undefined)
  })

  tests(target, '')
})
