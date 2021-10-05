//  /browser.js
'use strict'

console.log('LD: browser')

const common = require('./common')
const format = require('format')

const AssertionError = window.AssertionError || require('./assertion_error')

module.exports = common({ AssertionError }, format)