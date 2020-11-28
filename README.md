# assert-fine
[![Build Status](https://travis-ci.org/valango/assert-fine.svg?branch=master)](https://travis-ci.org/valango/assert-fine)  [![Code coverage](https://codecov.io/gh/valango/assert-fine/branch/master/graph/badge.svg)](https://codecov.io/gh/valango/assert-fine)

A tiny utility for finding a cause of seemingly random failures in your code.

The lightweight **_assert-fine_** provides a substitute for Node.js
native [`assert` API](https://nodejs.org/api/assert.html) package's
_strict_ _`assert()`_ or _`ok()`_ , with added benefits:
   1. _**lazy formatting**_ - informative messages without execution speed penalty;
   1. optional _**callback**_ is executed _before_ the assertion will throw.
   1. _**front-end support**_ - yes.
   
For a _**front-end app**_, the [`assert`](https://github.com/browserify/commonjs-assert)
npm package or one provided by _module bundler_, is used when available;
otherwise, a simple fallback for just `assert.ok()` and `AssertionError` is loaded.
   
This package is _**super useful**, when assertions fail in seemingly random manner_ -
in this case the call stack from assertion error may not tell you, which combination of state
values actually led to the failure condition -
but having debugger stopped at the breakpoint (see above), certainly will.

Running a special code (a callback) was actually a proposed but rejected _Node.js
feature request [#5312](https://github.com/nodejs/node/issues/5312)_.

## Install
`  npm install -S assert-fine`<br />or<br />`  yarn add assert-fine`
  
## Usage
```javascript
const assert = require('assert-fine')
const getDetails = (...args) => ({ args, foo: 'bar' }) // Or whatever...
let expectedValue = 'good', value, currentOperation

assert.hook(() => {                         //  This call is optional.
  appendToLogs('good-bye, cruel world!')    //  The breakpoint place.
})

currentOpertion = 'expected'

assert(value === expected, "%s('%s'): %o", 
  currentOperation, expectedValue, getDetails, 7, 8)
//  --> "AssertionError: expected('good'): { args: [7, 8], foo: 'bar' }"

//  Some other place - type check has failed, so:
assert.fail(TypeError, 'expected candy, but got %o instead', typeof someVar)
```

## API
The package has named exports **_`AssertionError`_**, **_`ok`_**, **_`fail`_** and **_`hook`_**.

**`ok`**`( value, ...args ) : {*}`

Similar to Node.js native `assert.ok()`, except that:
   * if the _`value`_ is truey, it  returns the `value`;
   * if the _`value`_ is falsy, it:
      * calls _hook callback_;
      * composes diagnostic message;
      * throws an _`AssertionError`_ with composed message.

Composing the message:
   1. if one of the optional arguments is a function, it will be
    replaced with its returned value after applying the rest or arguments to it.
   1. resulting arguments are applied to Node.js _`format()`_ function.

This function is package's **_default export_** as well.
   
**`fail`**`( error, ...args )

Throws an error with message composed of _`args`_ in the same way the _`ok()`_ does,
but if _`error`_ argument:
   * is a constructor of _`Error`_ or any of its child classes, then
     constructs a new instance and throws it.
   * is an _`Error`_ instance, then copies its _`message`_ property
   to _`originalMessage`_, sets new _`message`_ and throws the instance.
   * is anything else, then throws an _`Error`_ instance with _`message`_
   and _`originalMessage`_ composed of  _`args`_.
   
The exceptions from here also invoke the _hook callback_, when set..

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
Assertion callback failed too!
  Error: Intentional
    at apply (/Users/me/dev/_components/assert-fine/test/main.spec.js:15:11)
    at ok (/Users/me/dev/_components/assert-fine/index.js:37:24)
    ...
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
  assertion:
```

In both cases the `.stack` will have the original assertion stack dump available after
the `'assertion:'` line.
