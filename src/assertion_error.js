//  fallback.js - a front-end fallback for assert.ok API.
'use strict'

/**
 * @typedef {Object} ErrorOptionsT
 * @property {string} [message]
 * @property {*} [actual]
 * @property {*} [expected]
 * @property {string} [operator]
 * @property {function} [stackStartFn]
 */

const failWithType = require('./type_error')
const format = require('format')

const myCode = 'ERR_ASSERTION'

// https://nodejs.org/dist/latest-v14.x/docs/api/assert.html#assert_class_assert_assertionerror
class AssertionError extends Error {
  /** @param {ErrorOptionsT} options */
  constructor (options) {
    if (!(options && typeof options === 'object')) {
      failWithType('The "options" argument must be of type object. Received ' + options)
    }
    const { actual, expected, message, operator } = options

    super(message || format('%o %s %o', actual, operator, expected))

    this.actual = actual
    this.code = myCode
    this.expected = expected
    this.operator = operator
    this.generatedMessage = !message
    Object.defineProperty(this, 'name', {
      value: `AssertionError [${myCode}]`,
      enumerable: false,
      writable: true,
      configurable: true
    })
    // Create error message including the error code in the name.
    this.stack                      //  eslint-disable-line
    // Reset the name.
    this.name = 'AssertionError'
  }

  toString () {
    return `${this.name} [${this.code}]: ${this.message}`
  }
}

module.exports = AssertionError
