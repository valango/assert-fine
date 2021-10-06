//  /node.js
'use strict'

// process.stdout.write('LD: assert-fine/node\n')

const common = require('./common')
const assert = require('assert')
const { format } = require('util')

module.exports = common(assert, format)
