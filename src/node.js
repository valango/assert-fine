//  src/node.js
'use strict'

const common = require('./common')
const assert = require('assert')
const { format } = require('util')

module.exports = common(assert, format)
