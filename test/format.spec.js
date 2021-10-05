//  test/format.spec.js
'use strict'
/* eslint-env jest */

const target = require('../src/format')
const { format } = require('util')

const data = [
  [[], 0],
  [[''], 0],
  [[1], 0],
  [[1, 2], 0],
  [['a', 2], 0],
  [['%o %s %o--%i %i', false, '==', 'a', 3.8], 0],
  [['%%A%jB', { a: { b: [3] } }], 0],
  [['A%oB', { a: { b: [3] } }], 'A{a:{b:[3]}}B'], // "A{ a: { b: [ 3, [length]: 1 ] } }B"
  [['%o %i %i', 's'], 0],
  [['%y', { a: 1 }], '%y {a:1}'], // "%y { a: 1 }"
  [[], 0]
]

for (const entry of data) {
  if (!entry[1]) entry[1] = format(...entry[0])
}

// console.log(data)

it('should format', () => {
  for (const [args, result] of data) {
    expect(target(...args)).toBe(result)
  }
})
