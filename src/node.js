//  /node.js
'use strict'

console.log('LD: node')

const common = require('./common')
const assert = require('assert')
const {format} = require('util')

module.exports = common(assert, format)
