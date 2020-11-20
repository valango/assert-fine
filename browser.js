//  Load an 'assert' module or a local fallback when in browser environment.
'use strict'
/* eslint no-empty: 0 */
/* eslint no-console: 0 */

const test = process.env.NODE_ENV === 'test'
let assert, format

try {
  assert = test
    ? require('./node_modules/assert') /* istanbul ignore next */
    : require('assert')
} catch (error) {}

try {
  format = test ? require('util').format : require('format')
} catch (error) {}

/* istanbul ignore next */
format = format || ((...args) => console.assert(...args) && undefined)

if (test) {
  exports = module.exports = () => {
    const assert = exports.assert || require('./fallback')
    return { assert, format }
  }

  exports.assert = assert
} else /* istanbul ignore next */ {
  if (assert === undefined) assert = require('./fallback')

  module.exports = () => ({ assert, format })
}
