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
const runTests = (target, prefix, assert = undefined) => {
  const doStrict = prefix.indexOf('strict') >= 0, intentional = new Error('Int')
  let providedArgs, restOfArgs, expectedObject

  if (assert) {
    target.use(assert)
  }

  const { beforeThrow, strict, use } = target
  const { AssertionError, fail, ifError, ok } = doStrict ? target.strict : target

  const checkFail = (e, message, type) => {
    expect(e).toBeInstanceOf(type || AssertionError)
    expect(e.message).toBe(message)
    if (!type) expect(e).toMatchObject(expectedObject)
  }

  const failFn = () => {
    throw intentional
  }

  const funcArg = (...args) => ('F(' + (restOfArgs = args.slice()).join(',') + ')')

  const hookFn = (exception, args) => {
    providedArgs = args.slice()
  }

  beforeEach(() => {
    expectedObject = { operator: 'fail' }
    providedArgs = restOfArgs = undefined
    beforeThrow(undefined)
  })

  it(prefix + 'API', () => {
    expect(typeof target).toBe('function')
    expect(typeof fail).toBe('function')
    expect(typeof beforeThrow).toBe('function')
    expect(typeof use).toBe('function')
    expect(typeof AssertionError).toBe('function')
    if (doStrict) {
      expect(fail).toBe(target.fail)
      expect(ifError).toBe(target.ifError)
      expect(ok).toBe(target.ok)
      expect(typeof strict).toBe('function')
      expect(strict).not.toBe(ok)
    } else {
      if (process.browser && !assert) expect(target).not.toHaveProperty('strict')
      expect(target).toBe(ok)
    }
  })

  it(prefix + 'beforeThrow setting', () => {
    expect(beforeThrow()).toBe(undefined)
    expect(beforeThrow(hookFn)).toBe(undefined)
    expect(beforeThrow()).toBe(hookFn)
    expect(() => beforeThrow({})).toThrow(TypeError)
  })

  it(prefix + 'failing assertion w/o args', () => {
    expect(() => ok(false)).toThrow('false == true')
    expect(() => ok('')).toThrow("'' == true")
    strict && expect(() => strict(false)).toThrow('false == true')
    strict && expect(() => strict('')).toThrow("'' == true")
    expect(() => ok()).toThrowError('No value argument passed')
  })

  it(prefix + 'failing assertion w simple message', () => {
    beforeThrow(hookFn)
    const e = getThrown(() => ok(0, 1, 2))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.stack).not.toMatch(/assertion:/)
    expect(e.message).toBe('1 2')
    expect(providedArgs).toEqual([0, 1, 2])
  })

  it(prefix + 'failing assertion w composed message', () => {
    const e = getThrown(() => ok(0, '(%s,%s)', '%s', funcArg, 2, 3))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.message).toBe('(%s,F(2,3))')
  })

  it(prefix + 'should fail()', () => {
    let e
    checkFail(e = getThrown(() => fail(TypeError, 'E %o', 'T')), "E 'T'", TypeError)
    expect(getThrown(() => fail(e, ' U'))).toBe(e)
    expect(e.message).toBe('E \'T\' U')
    expectedObject = { code: 'ERR_ASSERTION', operator: 'fail' }
    checkFail(getThrown(() => (fail({}, 'W'))), '[object Object] W')
    checkFail(getThrown(() => (fail())), 'Failed')
  })

  it(prefix + 'ifError()', () => {
    expect(ifError()).toBe(undefined)
    expect(ifError(null)).toBe(undefined)
    expect(ifError(undefined)).toBe(undefined)
    expectedObject = { actual: '', code: 'ERR_ASSERTION', expected: null, operator: 'ifError' }
    checkFail(getThrown(() => (ifError(''))), "ifError got unwanted exception: ''")
    checkFail(getThrown(() => (ifError('', '%o', ''))), "ifError got unwanted exception: ''''")
    const e = expectedObject.actual = new Error('x')
    checkFail(getThrown(() => (ifError(e, '+'))), 'ifError got unwanted exception: x+')
  })

  it(prefix + 'resetting beforeThrow', () => {
    beforeThrow(hookFn)
    expect(beforeThrow(false)).toBe(hookFn)
    expect(beforeThrow(0)).toBe(false)
    expect(beforeThrow(false)).toBe(0)
    expect(() => ok(undefined, 1, funcArg, 2, funcArg, 3)).toThrow(AssertionError)
    expect(restOfArgs).toEqual([2, funcArg, 3])
  })

  it(prefix + 'failing funcArg', () => {
    const e = getThrown(() => ok('', 1, failFn, 2))
    expect(e.message).toBe('Int')
    expect(e).toBeInstanceOf(Error)
    expect(e).not.toBeInstanceOf(AssertionError)
  })

  it(prefix + 'failing callback', () => {
    beforeThrow(failFn)
    const e = getThrown(() => ok(undefined, 'E %d %d', 1, 2))
    expectedObject = {
      actual: '',
      code: 'ERR_ASSERTION',
      expected: null,
      extra: intentional,
      operator: 'ifError'
    }
    expect(e.message).toBe('E 1 2 [EXTRA]: Int')
  })

  it(prefix + 'use() should fail w bad API', () => {
    expect(() => use({ prefix })).toThrow(TypeError)
  })

  if (assert && target.equal && target.strict) {
    it(prefix + 'use() should clear the previous API', () => {
      use({ AssertionError })
      expect(target).not.toHaveProperty('equal')
      expect(target).not.toHaveProperty('strict')
    })
  }
}

module.exports = runTests
