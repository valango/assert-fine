# assert-fine
[![Build Status](https://travis-ci.org/valango/assert-fine.svg?branch=master)](https://travis-ci.org/valango/assert-fine)  [![Code coverage](https://codecov.io/gh/valango/assert-fine/branch/master/graph/badge.svg)](https://codecov.io/gh/valango/assert-fine)

A tiny utility making Node.js assert.ok() more useful and available in front-end code, too.

Probably the most popular part of Node.js native
[`assert` API](https://nodejs.org/api/assert.html)
is `assert.strict.ok()`, or just `assert()`.
The lightweight **_assert-fine_** package makes it even more useful:

   1. You can define a _callback function_ to be called every time before the assertion error throws.
   It may be an excellent place for a _**debugger breakpoint**_, and it also helps
   to _improve application diagnostics_ features.
   1. In some use cases, code needs to be executed before assertion failure - there
   have been Node.js _feature request [#5312](https://github.com/nodejs/node/issues/5312)_ for this.
   1. Basic assertion with features above will be available in _**front-end** code_, too.
   The npm [`assert`](https://github.com/browserify/commonjs-assert) package
   or one provided by _module bundler_ gets used when available;
   otherwise a fallback for just `assert.ok()` and `AssertionError` is loaded.
   
## Install
`  npm install -S assert-fine`<br />or<br />`  yarn add assert-fine`
  
## Usage
```javascript
const assert = require('assert-fine')
const getValue1 = () => { /* compute and return something like 'V1' */ }
const getValue2 = () => { /* compute and return something like 'V2' */ }
let allIsWell = false     //  Test value in our examples.

assert.hook(() => {
  //  A place for breakpoint.
  appendToLogs('good-bye, cruel world!')
})

//  --> 'Failed: V1 V2'
assert(allIsWell, 'Failed:', getValue1(), getValue2())

//  --> 'Failed: V1 V2'    ... but with lazy message composing.
assert(allIsWell, 'Failed:', () => (getValue1() + ' ' + getValue2()))

class TouchyOne {
  collectInfo(...args) {
    //  return string of detailed information
  }

  getTouched() {  
    //  Combine instance method with others stuff in lazy fashion.
    assert(allIsWell, 'Ouch!', this.collectInfo.bind(this), getValue1, getValue2)
  }
}
```

Using a function in argument list can be good for avoiding diagnostics
string computation, unless it will be actually used.

## API
The package has named exports as follows:
 
**`ok`**`( value, ...args ) : {*}`

Similar to Node.js native `assert.ok()`, except that:
   * returns the `value` on success;
   * on failure, calls hook callback before composing diagnostic message and throwing exception;
   * it composes diagnostic message by joining `args` together. If one of those is a function,
   it is called with the rest of the arguments and return value will be appended to earlier arguments.
   
This function is package's **_default export_** as well.
   
**`hook`**`( [ callback ] ) : {function() | undefined}`

Sets new callback function if provided and returns the previous one. Falsy argument results
callback set to `undefined`; otherwise the argument has to be a function or assertion will be thrown.
Calling with `undefined` value will not change the callback.

When called, the callback receives original `args` of _assertOk_ call as an array and
if it returns an array itself, this will replace the `args` array for message composition.

**`AssertionError`** class

For use with `instanceof` operator. It has the same properties as it's Node.js counterpart.

In front-end code, the message and stack values may be slightly different from what they
might be in case of Node.js assert.

When error occurs in hook callback, the `.message` and `.stack` property values
of `AssertionError` instance will indicate this. If this happens, the `.message` will be multi-line
string similar to:

```
Failure in callback
  Error: Intentional
    at apply (/Users/me/dev/_components/assert-fine/test/main.spec.js:15:11)
    at ok (/Users/me/dev/_components/assert-fine/index.js:37:24)
    ...
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
  assertion:
```

If a function in args list fails, then the first line will be like `'Failure in argument #0'`.

In both cases the `.stack` will have the original assertion stack dump available after
the `'assertion:'` line.
