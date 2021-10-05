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
const runTests = (target, pref) => {
  let thrown, providedArgs, restOfArgs
  const { AssertionError, fail, hook, ok, use } = target

  const checkFail = (e, message, type) => {
    expect(e).toBeInstanceOf(type || AssertionError)
    expect(e).toMatchObject({ message })
    if (!type) expect(e).toMatchObject({ operator: 'fail' })
  }

  const failFn = () => {
    throw new Error('Intentional')
  }

  const funcArg = (...args) => ('F(' + (restOfArgs = args.slice()).join(',') + ')')

  const hookFn = (exception, args) => {
    thrown = exception
    providedArgs = args.slice()
  }

  beforeEach(() => {
    providedArgs = restOfArgs = thrown = undefined
    hook(undefined)
  })

  it(pref + 'API', () => {
    expect(typeof target).toBe('function')
    expect(typeof ok).toBe('function')
    expect(typeof fail).toBe('function')
    expect(typeof hook).toBe('function')
    expect(typeof use).toBe('function')
    expect(typeof AssertionError).toBe('function')
  })

  it(pref + 'hook setting', () => {
    expect(hook()).toBe(undefined)
    expect(hook(hookFn)).toBe(undefined)
    expect(hook()).toBe(hookFn)
    expect(() => hook({})).toThrow(TypeError)
  })

  it(pref + 'failing assertion w/o args', () => {
    expect(() => target(false)).toThrow('false == true')
    expect(() => target('')).toThrow("'' == true")
    expect(() => target()).toThrowError('No value argument passed')
  })

  it(pref + 'failing assertion w simple message', () => {
    hook(hookFn)
    const e = getThrown(() => target(0, 1, 2))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.stack).not.toMatch(/assertion:/)
    expect(e.message).toBe('1 2')
    expect(providedArgs).toEqual([0, 1, 2])
  })

  it(pref + 'failing assertion w composed message', () => {
    const e = getThrown(() => target(0, '(%s,%s)', '%s', funcArg, 2, 3))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.message).toBe('(%s,F(2,3))')
  })

  it(pref + 'should fail()', () => {
    let e
    checkFail(e = getThrown(() => fail(TypeError, 'E %o', 'T')), "E 'T'", TypeError)
    expect(getThrown(() => fail(e, ' U'))).toBe(e)
    expect(e.message).toBe('E \'T\' U')
    checkFail(getThrown(() => (fail({}, 'W'))), '[object Object] W')
    checkFail(getThrown(() => (fail())), 'Failed')
  })

  it(pref + 'hook amending the message', () => {
    hook((e, args) => args.map(v => v > 0 ? -v : v))
    const e = getThrown(() => fail('F %o %o %o!', -2, '', 3))
    expect(e).toBeInstanceOf(AssertionError)
    expect(e.message).toBe('F -2 \'\' -3!')
    expect(e.originalMessage).toBe('F -2 \'\' 3!')
  })

  it(pref + 'resetting hook', () => {
    hook(hookFn)
    expect(hook(false)).toBe(hookFn)
    expect(hook(0)).toBe(false)
    expect(hook(false)).toBe(0)
    expect(() => target(undefined, 1, funcArg, 2, funcArg, 3)).toThrow(AssertionError)
    expect(restOfArgs).toEqual([2, funcArg, 3])
  })

  it(pref + 'failing funcArg', () => {
    const e = getThrown(() => target('', 1, failFn, 2))
    expect(e.message).toBe('Intentional')
    expect(e).toBeInstanceOf(Error)
  })

  it(pref + 'failing callback', () => {
    hook(failFn)
    const e = getThrown(() => target(undefined, 'E %d %d', 1, 2))
    expect(e.message).toBe('Unexpected error from callback')
    expect(e.originalMessage).toBe('E 1 2')
  })

  it(pref + 'failing re-formatting', () => {
    let was = false
    const fn = (...args) => {
      if (was) throw new Error('Failed')
      was = true
      return args.join('-')
    }
    hook((err, args) => args.slice(1))                //  eslint-disable-line
    const e = getThrown(() => target(0, fn, 1, 2))
    expect(e.message).toBe('Unexpected error from re-formatting')
    expect(e.originalMessage).toBe('1-2')
  })

  it(pref + 'use() should fail w bad API', () => {
    expect(() => use({ pref })).toThrow(TypeError)
  })
}

module.exports = runTests
