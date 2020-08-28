'use strict'

let callback, assertOk

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true) {
  assertOk = require('./browser.js')
} else {
  assertOk = require('assert')
}

const AssertionError = assertOk.AssertionError

if (assertOk.strict) assertOk = assertOk.strict

if (assertOk.ok) assertOk = assertOk.ok

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
  if (!value) {
    let i = 0, parts = args, texts = []

    try {
      if (callback) {
        parts = callback(args)
        if (!Array.isArray(parts)) parts = args
      }

      while (i < parts.length) {
        const v = parts[i++]
        if (typeof v === 'function') {
          texts.push(v(...parts.slice(i)) + '')
          break
        } else {
          texts.push(v + '')
        }
      }
    } catch (error) {
      assertOk(value, 'Failure in ' + (i ? 'argument #' + (i - 1) : 'callback') +
        '\n  ' + error.stack + '\n  assertion:')
    }
    i ? assertOk(value, texts.join(' ')) : assertOk(value)
  }
  return value
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
