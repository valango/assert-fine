'use strict'
/* eslint-env jest */

const tests = require('./tests')

describe('back-end', () => {
  jest.resetModules()

  const target = require('..')

  it('should load', () => {
    expect(target.ok).toBe(target)
    expect(target.strict.strict).toBe(target.strict)
    expect(target.strict.fail).toBe(target.fail)
    expect(target.strict.hook).toBe(target.hook)
    expect(target.strict.ok).toBe(target.ok)
    expect(target.strict.use).toBe(target.use)
  })

  tests(target, '')
  tests(target.strict, 'strict ')
})
