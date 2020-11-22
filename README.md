# assert-fine
[![Build Status](https://travis-ci.org/valango/assert-fine.svg?branch=master)](https://travis-ci.org/valango/assert-fine)  [![Code coverage](https://codecov.io/gh/valango/assert-fine/branch/master/graph/badge.svg)](https://codecov.io/gh/valango/assert-fine)

A tiny utility, that helps to find cause of seemingly random failures in your code.

Probably the most popular part of Node.js native
[`assert` API](https://nodejs.org/api/assert.html)
is `assert.strict.ok()`, or just `assert()`.
The lightweight **_assert-fine_** provides a substitute for Node.js
native [`assert` API](https://nodejs.org/api/assert.html) package's
_strict_ _`assert()`_ or _`ok()`_ , with added benefits:
   1. _**lazy formatting**_ - more informative messages without execution speed penalty;
   1. optional _**callback**_ is executed _before_ the assertion will throw.
   1. _**front-end support** - yes.
   
For a _**front-end app**_, the [`assert`](https://github.com/browserify/commonjs-assert)
npm package or one provided by _module bundler_, is used when available;
otherwise, a simple fallback for just `assert.ok()` and `AssertionError` is loaded.
   
This package is _**super useful**, when assertions fail in seemingly random manner_ -
in this case the call stack from assertion error may not tell us, which combination of state
values actually led to the failure -
but having debugger stopped at the breakpoint (see above), certainly will.

Running a special code (a callback) was actually a proposed but rejected Node.js
feature request [#5312](https://github.com/nodejs/node/issues/5312)_.

## Install
`  npm install -S assert-fine`<br />or<br />`  yarn add assert-fine`
  
## Usage
```javascript
const assert = require('assert-fine')
const getDetails = (...args) => ({ foo: 'bar' }) // Whatever we compute...
let expectedValue = 'good', value, currentOperation

assert.hook(() => {                       //  This call is optional.
  appendToLogs('good-bye, cruel world!')  //  The breakpoint place.
})

currentOpertion = 'expected'

assert(value === expected, "%s('%s'): %o", 
  currentOperation, expectedValue, getDetails
  //  If getDetails expects any aruments, put those after the function.
)

//  --> 'AssertionError: expected('good'): { foo: 'bar' }'
```

## API
The package has named exports as follows:
 
**`ok`**`( value, ...args ) : {*}`

Similar to Node.js native `assert.ok()`, except that:
   * if the _`value`_ is truey, it  returns the `value`;
   * if the _`value`_ is falsy, it:
      1. calls _hook callback_;
      1. composes diagnostic message;
      1. throws an _`AssertionError`_ with composed message.

Composing the message:
    1. if one of the optional arguments is a function, it will be
    replaced with its returned value after applying the rest or arguments to it.
    1. resulting arguments are applied to Node.js _`format()`_ function.

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

When error occurs in hook callback or during formatting, the `.message` and `.stack` property values
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

In both cases the `.stack` will have the original assertion stack dump available after
the `'assertion:'` line.
