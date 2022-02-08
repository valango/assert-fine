//  src/browser.js
'use strict'

// process.stdout.write('LD: assert-fine/browser\n')

const common = require('./common')
const format = require('./format')

const AssertionError = window.AssertionError || require('./assertion_error')

module.exports = common({ AssertionError }, format)
