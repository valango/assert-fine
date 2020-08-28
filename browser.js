'use strict'
/* eslint no-empty: 0 */

let assertOk

try {
  assertOk = process.env.NODE_ENV === 'test'
    ? require('./node_modules/assert') /* istanbul ignore next */
    : require('assert')
} catch (error) {
}

module.exports = assertOk || require('./fallback')
