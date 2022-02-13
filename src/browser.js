//  src/browser.js
'use strict'

const common = require('./common')
const format = require('./format')

const AssertionError = window.AssertionError || require('./assertion_error')

module.exports = common({ AssertionError }, format)
