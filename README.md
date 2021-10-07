# assert-fine
[![Build Status](https://travis-ci.org/valango/assert-fine.svg?branch=master)](https://travis-ci.org/valango/assert-fine)  [![Code coverage](https://codecov.io/gh/valango/assert-fine/branch/master/graph/badge.svg)](https://codecov.io/gh/valango/assert-fine)

A lightweight wrapper making assertion testing much easier.

## Why and How
1. After assertion failure, we'll have stack trace, showing the execution context.
But sometimes we need a _**detailed view of dynamic data**_, even
_**interactive debugging**_, _before_ _`AssertionError`_ is thrown.<br />
The [`beforeThrow()`](#function-beforethrowcallback) hook makes it easy.
1. Including dynamic data to assertion messages comes at cost of additional code and
performance penalty.<br />
The overridden [`ok()`](#function-ok-value-args-) and
[`fail()`](#function-fail-failure-args-) functions feature _**lazy formatting**_
in a backwards-compatible manner.
1. Front-end assertion is supported too, with minimalistic API of `(AssertionError, fail, ifError, ok)`
by default. So you can use _**same code**_ in both back- and front-end (via a bundler).
1. The [`use()`](#function-use-engine-) function lets you switch the _assertion engine_ programmatically, w/o re-loading
any modules.

When loaded, the `assert-fine` package object instance transparently wraps around
the environment-specific
_**assertion engine**_ like the [Node.js assert](http://nodejs.org/api/assert.html)

The #1 functionality was actually proposed, but rejected _Node.js
feature request [#5312](https://github.com/nodejs/node/issues/5312)_.

## Installation
`  npm install -S assert-fine`<br />or<br />`  yarn add assert-fine`

## Usage
```js
const assert = require('assert-fine')

assert.beforeThrow((error, args) => {   //  This call is optional.
  doSomething()                         //  The breakpoint place.
})

//  Somewhere in your code
assert(value === expected, 'assert(%o)', value, someFunction, ...argsForFunction)

assert.equal(value, expected)           //  Is not affected by `assert-fine`.
```
In the example above, the someFunction will be called, and the message is formatted only
when the assertion fails.

## Package exports (API)

### Default export
Default export equals the `ok()` function.

### function `beforeThrow([callback])`
If argument is supplied, sets or clears the global callback. Otherwise, just returns<br/>
**Returns** `any` the global callback previous value.<br/>
**Throws** `TypeError` if supplied argument is not function nor falsy.
`callback: any `- should be a falsy value or function, if supplied.

### function `fail( [failure], ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_fail_message),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`. Arguments:<br/>
`failure: Error | function `- if a function supplied, it is treated as Error constructor,
and error instance is created with `message` property composed of args;
if _`Error`_ instance is supplied, the string composed of args is appended to its `message`.<br/>
`...args: any ``- optional arguments. If the first one is a string, it will be supplied to `util.format`
or to its front-end substitute. If any of the arguments is a function, it will be called
with the rest opf arguments supplying its return value to `format()`.

### function `ifError( value, ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_iferror_value),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`. Arguments:<br/>
`value: any`<br/>
`...args: any `- optional arguments, working exactly as those of [`fail()`](#function-fail-failure-args-).

### function `ok( value, ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_ok_message),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`. Arguments:<br/>
`value: any`<br/>
`...args: any `- optional arguments, working exactly as those of [`fail()`](#function-fail-failure-args-).

### function `use( engine )`
Wraps the assertion engine, putting it into use

This function is called internally upon
loading the package, with Node.js built-in _`assert`_ package or with its own substitute,
when loaded via a bundler ([browserify](https://browserify.org/), [webpack](https://webpack.js.org/),
[rollup](https://rollupjs.org) or similar.)<br/>
You might need this function when using something like
[assert](https://github.com/browserify/commonjs-assert) package for front-end.

This function does not modify the supplied engine in any way, and<br/>
it does not alter the exported ( _`beforeThrow, fail, ok, use`_ ) values either.

All other properties of the engine argument will be assigned to the already exported API.

### property `strict?: function()`
Is present only if the assertion engine in use has such property
(see [Node.js docs](http://nodejs.org/api/assert.html)), it will be mirrored to the
package object instance. For subtle details, see the [source code](src/common.js).

### Other properties
Any properties of the assertion engine, not shadowed by the API described above,
will be directly assigned to package object instance.

## Acknowledgements
[assert](https://github.com/browserify/commonjs-assert) NPM package - I borrowed quite some
pieces of code from there - thanks a lot, folks!

[debug](https://github.com/visionmedia/debug) NPM package - inspecting its source code
helped me to fix the disastrous bug (issue #1) of this package - thanks again!
