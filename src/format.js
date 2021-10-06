//  src/format.js  -- a simple substitute for Node.js util.format().
//  Unfortunately, the https://github.com/samsonjs/format does not comply.
'use strict'

const d = (v) => (typeof v === 'number' ? v + '' : 'NaN')
const i = (v) => (parseInt(v, 10) + '')
const j = (v) => JSON.stringify(v)
//  Todo: bring %o closer to Node.js format behavior.
const o = (v) => typeof v === 'string'
  ? `'${v}'`
  : (typeof v === 'object' ? j(v).split('"').join('') : (v + ''))
const s = (v) => (v + '')

const transforms = { d, i, j, o, s }

module.exports = (...args) => {
  let i = 0, last = 0, output = [], r

  if (args.length) {
    if (typeof args[0] === 'string') {
      const fmt = args[i++], rx = /%([dijos%])/g

      while (i < args.length && (r = rx.exec(fmt))) {
        if (last < r.index) {
          output.push(fmt.slice(last, r.index))
        }
        last = rx.lastIndex

        output.push(r[1] === '%' ? '%' : transforms[r[1]](args[i++]))
      }
      if (last < fmt.length) {
        output.push(fmt.slice(last))
      }
    }

    if (output.length) output = [output.join('')]

    while (i < args.length) {
      output.push(typeof args[i] === 'object' ? o(args[i]) : s(args[i]))
      i += 1
    }
  }
  return output.join(' ')
}
