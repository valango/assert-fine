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

  let i = -1, parts = args, message

  try {
    if (callback) callback(args)

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
  } catch (error) {
    assert(value, 'Failed assertion ' + (i < 0 ? 'callback' : 'formatting') +
      '\n  ' + error.stack + '\n  assertion:')
  }
  assert(value, message)
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

//  Provide named exports, too.
ok.ok = ok
ok.hook = hook
ok.AssertionError = AssertionError

module.exports = ok
