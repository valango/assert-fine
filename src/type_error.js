//  src/type_error.js
'use strict'

module.exports = (message) => {
  const error = new TypeError(message)
  error.code = 'ERR_INVALID_ARG_TYPE'
  throw error
}
