/* eslint-env jest */
'use strict'

//  Return error instance, if thrown.
const getThrown = fn => {
  try {
    fn()
  } catch (error) {
    return error
  }
  return undefined
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

  test('failing assertion w simple message', () => {
    const e = getThrown(() => ok(0, 1, 2))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.stack).not.toMatch(/assertion:/)
    expect(e.message).toBe('1 2')
    expect(providedArgs).toEqual([1, 2])
  })

  test('failing assertion w composed message', () => {
    const e = getThrown(() => ok(0, '(%s,%s)', '%s', funcArg, 2, 3))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.message).toBe('(%s,F(2,3))')
  })

  test('throwing typed error', () => {
    let e = getThrown(() => ok.fail(TypeError, '%o', 'T'))
    expect(e).toBeInstanceOf(TypeError)
    expect(e.message).toBe("'T'")
    expect(getThrown(() => ok.fail(e, 'U'))).toBe(e)
    expect(e.message).toBe('U')
    expect(e.originalMessage).toBe("'T'")
    expect(e = getThrown(() => (ok.fail({}, 'W')))).toBeInstanceOf(Error)
    expect(e).not.toBeInstanceOf(AssertionError)
    expect(e.message).toBe('assert.fail: bad argument')
    expect(e.originalMessage).toBe('W')
  })

  test('resetting hook', () => {
    providedArgs = restOfArgs = undefined
    expect(ok.hook(false)).toBe(hook)
    expect(ok.hook(false)).toBe(undefined)
    expect(() => ok(undefined, 1, funcArg, 2, funcArg, 3)).toThrow(AssertionError)
    expect(restOfArgs).toEqual([2, funcArg, 3])
  })

  test('failing funcArg', () => {
    const e = getThrown(() => ok('', 1, fail, 2))
    expect(e.message).toMatch(/assertion\sformatting/i)
    expect(e.stack).toMatch(/assertion:/)
  })

  test('ok() failing callback', () => {
    ok.hook(fail)
    const e = getThrown(() => ok(undefined, 1, fail, 2))
    expect(e.message).toMatch(/assertion\scallback/i)
    expect(e.stack).toMatch(/assertion:/)
  })

  test('fail() failing callback', () => {
    ok.hook(fail)
    const e = getThrown(() => ok.fail(TypeError, 1, fail, 2))
    expect(e.message).toBe('Intentional at assert-fine.fail callback')
    expect(e).not.toBeInstanceOf(TypeError)
  })
}

module.exports = runTests
