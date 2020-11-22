/* eslint-env jest */
'use strict'

const { renameSync } = require('fs')

const cwd = process.cwd()

//  Return error instance, if thrown.
const getThrown = fn => {
  try {
    fn()
  } catch (error) {
    return error
  }
  return undefined
}

//  Make installed 'debug' npm package temporarily unavailable.
const rename = (from, to) => {
  process.chdir('node_modules')
  renameSync(from, to)
  process.chdir(cwd)
}

class LabRat {
  constructor (ok, idea) {
    this.idea = idea
    this.ok = ok
  }

  compose (...args) {
    return ['Rat#' + this.idea + ':'].concat(args).join(' ')
  }

  poke (hard) {
    this.ok(!hard, 'poked', this.compose.bind(this), 1, 2)
    return true
  }
}

//  Actual tests.
const runTests = () => {
  let AssertionError, ok, providedArgs, restOfArgs

  const fail = () => {
    throw new Error('Intentional')
  }

  const funcArg = (...args) => ('F(' + (restOfArgs = args.slice()).join(',') + ')')

  const hook = args => {
    providedArgs = args.slice()
  }

  beforeEach(() => {
    if (!ok) AssertionError = (ok = require('..')).AssertionError
    providedArgs = restOfArgs = undefined
  })

  test('API', () => {
    expect(ok.ok).toBe(ok)
    expect(typeof AssertionError).toBe('function')
  })

  test('hook setting', () => {
    expect(ok.hook()).toBe(undefined)
    expect(ok.hook(hook)).toBe(undefined)
    expect(ok.hook()).toBe(hook)
  })

  test('successful assertion', () => {
    expect(ok('yes', 1, funcArg, 2)).toBe('yes')
    expect(providedArgs || restOfArgs).toBe(undefined)
  })

  test('failing assertion w/o args', () => {
    expect(() => ok(false)).toThrow('false == true')
    expect(() => ok('')).toThrow("'' == true")
  })

  test('failing assertion w message composition', () => {
    const e = getThrown(() => ok(undefined, 1, 2))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.stack).not.toMatch(/assertion:/)
    expect(e.message).toBe('1 2')
    expect(providedArgs).toEqual([1, 2])
  })

  test('failing assertion w callback argument', () => {
    const e = getThrown(() => ok(undefined, 1, funcArg, 2, 3))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.message).toBe('1 F(2,3)')
  })

  /* test('failing w class method argument', () => {
    const rat = new LabRat(ok, 42)
    const e = getThrown(() => rat.poke(true))
    expect(e.message).toBe('poked Rat#42: 1 2')
  }) */

  test('resetting hook', () => {
    providedArgs = restOfArgs = undefined
    expect(ok.hook(false)).toBe(hook)
    expect(ok.hook(false)).toBe(undefined)
    expect(() => ok(undefined, 1, funcArg, 2, funcArg, 3)).toThrow(AssertionError)
    expect(restOfArgs).toEqual([2, funcArg, 3])
  })

  test('failing funcArg', () => {
    const e = getThrown(() => ok('', 1, fail, 2))
    expect(e.message).toMatch(/assertion\sformatting/)
    expect(e.stack).toMatch(/assertion:/)
  })

  test('failing callback', () => {
    ok.hook(fail)
    const e = getThrown(() => ok(undefined, 1, fail, 2))
    expect(e.message).toMatch(/assertion\scallback/)
    expect(e.stack).toMatch(/assertion:/)
  }) /*  */
}

//  Test suites.

describe('front-end: assert npm package', () => {
  /* beforeAll(() => {
    process.browser = true
    jest.resetModules()
  }) */

  runTests(require('..'))
})

/* describe('front-end: assert local fallback', () => {
  beforeAll(() => {
    rename('assert', '__assert')
    process.browser = true
    jest.resetModules()
  })

  afterAll(() => rename('__assert', 'assert'))

  runTests()
})

describe('back-end: Node.js assert', () => {
  beforeAll(() => {
    delete process.browser
    jest.resetModules()
  })

  runTests(require('..'))
}) */
