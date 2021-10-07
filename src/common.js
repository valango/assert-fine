//  src/common.js
'use strict'

const failWithType = require('./type_error')

const toSkip = 'beforeThrow fail ifError length name ok prototype strict'.split(' ')

module.exports = (native, format) => {
  let AssertionError, callback

  const compose = parts => {
    let message, i = -1

    if (parts.length) {
      i = 0
      while (i < parts.length) {
        let v = parts[i++]
        if (typeof v === 'function') {
          v = v(...parts.slice(i))
          parts = parts.slice(0, i - 1).concat(v)
          break
        }
      }
      if (parts[0] && /(?<!%)%[cdfijoOs]/.test(parts[0])) {
        message = format.apply(null, parts)
      } else {
        message = parts.join(' ')
      }
    }
    return message
  }

  const innerThrow = (exception, args) => {
    if (callback) {
      try {
        callback(exception, args)
      } catch (err) {
        exception.message += ' [EXTRA]: ' + err.message
        exception.extra = err
      }
    }
    throw exception
  }

  function fail (...args) {
    let exception, message

    if (args.length) {
      if (args[0] instanceof Error) {
        exception = args[0]
        exception.message += compose(args.slice(1)) || ''
      } else if (typeof args[0] === 'function') {
        exception = new args[0](compose(args.slice(1)) || 'Failed')
      } else {
        message = compose(args)
      }
    }
    if (!exception) {
      exception = new AssertionError(
        { message: message || 'Failed', operator: 'fail', stackStartFn: fail })
      exception.generatedMessage = !message
    }
    innerThrow(exception, args)
  }

  function ifError (actual, ...args) {
    if (!(actual === null || actual === undefined)) {
      let message = 'ifError got unwanted exception: ' +
        ((actual && typeof actual === 'object' && typeof actual.message === 'string')
          ? actual.message
          : format('%o', actual))

      if (args.length) message += compose(args)
      innerThrow(new AssertionError({
        actual, expected: null, operator: 'ifError', message, stackStartFn: ifError
      }), args)
    }
  }

  const innerOk = (stackStartFn, args) => {
    if (!args.length) {
      innerOk(stackStartFn, [undefined, 'No value argument passed to `assert.ok()`'])
    } else if (!args[0]) {
      innerThrow(new AssertionError({
        actual: args[0],
        expected: true,
        message: compose(args.slice(1)),
        operator: '==',
        stackStartFn
      }), args)
    }
  }

  function ok (...args) {
    innerOk(ok, args)
  }

  /**
   * Sets new callback function if provided and returns the previous one.
   *
   * @param cb  - undefined is ignored; other falsy value results callback set to undefined.
   * @returns {function(*)|undefined} previous callback.
   * @throws {AssertionError} when non-falsy non-function argument is provided.
   */
  function beforeThrow (cb) {
    const old = callback

    if (arguments.length) {
      if (cb && typeof cb !== 'function') {
        failWithType('beforeThrow callback must be of type function. Received ' + cb)
      }
      callback = cb
    }

    return old
  }

  const enhance = (dst, src) => {
    for (const key of Reflect.ownKeys(src)) {
      if (!(toSkip.includes(key))) {
        dst[key] = src[key]
      }
    }
    Object.assign(dst, { fail, ifError, ok })
  }

  /**
   * Uses the given native assertion package.
   * @param {Object} assert
   * @throws {TypeError} when package does not expose AssertionError.
   */
  function use (assert) {
    if (!assert || typeof assert.AssertionError !== 'function') {
      failWithType(
        'The "assert" argument must be of type object containing AssertionError. Received ' + assert)
    }

    for (const key of Reflect.ownKeys(ok)) {
      if (!(toSkip.includes(key))) {
        delete ok[key]
      }
    }
    AssertionError = assert.AssertionError
    enhance(ok, assert)

    if (assert.strict) {
      const strict = ok.strict = (...args) => innerOk(strict, args)

      enhance(strict.strict = strict, assert.strict)
    } else {
      delete ok.strict
    }
    ok.use = use
  }

  use(native)

  return Object.assign(ok, { beforeThrow, use })
}
