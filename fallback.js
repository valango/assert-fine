//  fallback.js - a front-end fallback for assert.ok API.
'use strict'

const valueStr = v => v === '' ? "''" : v + ''

class AssertionError extends Error {
  constructor (value, message) {
    super(message || (valueStr(value) + ' == true'))

    this.actual = value
    this.code = 'ERR_ASSERTION'
    this.expected = true
    this.operator = '=='
    this.generatedMessage = !message
  }
}

const ok = (value, msg) => {
  if (!value) throw new AssertionError(value, msg)
}

ok.ok = ok
ok.AssertionError = AssertionError

module.exports = ok
