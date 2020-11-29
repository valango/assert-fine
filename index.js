'use strict'

let callback, loaded = {}

//  browserify and webpack define process.browser
//  electron defines process.type
//  {@link https://www.electronjs.org/docs/api/process}

if (typeof (window) === 'object' || process.type === 'renderer') {
  loaded = require('./browser.js')()
} else {
  //  Normal Node.js environment.
  loaded.assert = require('assert')
  loaded.format = require('util').format
}

let { assert, format } = loaded
const AssertionError = assert.AssertionError

if (assert.strict) assert = assert.strict

if (assert.ok) assert = assert.ok

/**
 * @private
 * @param {*[]} args
 * @returns {string}
 */
const compose = args => {
  let message, i = -1, parts = args

  if ((parts = args).length) {
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

/**
 * On failure condition calls callback first with `args` supplied, then composes
 * a diagnostic message from `args`. If one of args is a function, it will be called
 * with rest of args a it's parameters and it's return value appended to the message.
 * @param {*} value    - falsy value will cause assertion failure.
 * @param {...*} args  - parameters to be joined into a diagnostic message.
 * @returns {*}        - successfully asserted value
 * @throws {AssertionError}
 * @throws {Error}
 */
const ok = (value, ...args) => {
  if (value) return value

  let message = compose

  try {
    if (callback) callback(args)

    message = undefined
    message = compose(args)
  } catch (error) {
    assert(value, 'Assertion ' + (message === compose ? 'callback' : 'formatting') +
      ' failed too!\n' + error.stack + '\n  assertion:')
  }
  assert(value, message)
}

/**
 * Throws a specific error instance.
 *
 * @param {Error | ErrorConstructor} Err
 * @param {...*} args
 */
const fail = (Err, ...args) => {
  let message = compose, p

  try {
    if (callback) callback(args)

    message = undefined
    message = compose(args)
  } catch (error) {
    error.message += ' at assert-fine.fail ' + (message === compose ? 'callback' : 'formatting')
    throw error
  }
  if (Err instanceof Error) {
    Err.originalMessage = Err.message
    Err.message = message
    throw Err
  }
  if (typeof Err === 'function' && (p = Err.prototype) &&
    typeof p === 'object' && p instanceof Error) {
    throw new Err(message)
  }
  p = new Error('assert.fail: bad argument')
  p.originalMessage = message
  throw p
}

/**
 * Sets new callback function if provided and returns the previous one.
 *
 * @param cb  - undefined is ignored; other falsy value results callback set to undefined.
 * @returns {function(*)|undefined} previous callback.
 * @throws {AssertionError} when non-falsy non-function argument is provided.
 */
const hook = (cb) => {
  const old = callback

  if (cb !== undefined) {
    if (cb) {
      ok(typeof cb === 'function', 'assertHook illegal argument type ' + typeof cb + '\'')
      callback = cb
    } else {
      callback = undefined
    }
  }

  return old
}

module.exports = Object.assign(ok, { AssertionError, fail, hook, ok })
