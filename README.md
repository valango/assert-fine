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
The overridden [`ok()`](#function-ok-value-args-), [`fail()`](#function-fail-failure-args-)
and [`ifError()`](#function-iferror-value-args-) functions feature _**lazy formatting**_
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

assert.beforeThrow(() => {  //  This call is optional.
  return false              //  The breakpoint place.
})

//  Somewhere in your code
assert(value === expected, 'assert(%o)', value, someFunction, ...argsForFunction)

assert.equal(value, expected, 'Bang!')  //  Not affected by `assert-fine`.
```
In the example above, the someFunction will be called, and the message is formatted only
when the assertion fails.

## Package exports (API)

### Default export
Default export equals the `ok()` function.

### function `beforeThrow([callback: function|false])`
Sets, resets or just queries the global callback function.

The callback will be called right before the assertion error is thrown.
It's main purpose is to provide debugger breakpoint.
**Returns** `function | undefined` the global callback value so far.<br/>
**Throws** `TypeError` if supplied argument is not function nor falsy.

### function `fail( [failure], ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_fail_message),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`.

Arguments:<br/>
`failure: Error | function `- if a function supplied, it is treated as Error constructor,
and error instance is created with `message` property composed of args;
if _`Error`_ instance is supplied, the string composed of args is appended to its `message`.<br/>
`args: any` - optional arguments. If the first one is a string, it will be supplied to `util.format`
or to its front-end substitute. If any of the _`args`_ is a function, it will be called
with the rest opf arguments supplying its return value to `format()`.

### function `ifError( value, ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_iferror_value),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`. Arguments:<br/>
`value: any`<br/>
`args: any `- optional arguments, working exactly as those of [`fail()`](#function-fail-failure-args-).

### function `ok( value, ...args )`
Replaces its [Node.js counterpart](http://nodejs.org/api/assert.html#assert_assert_ok_message),
featuring the lazy formatting and invoking the callback set via `beforeThrow()`. Arguments:<br/>
`value: any`<br/>
`args: any`- optional arguments, working exactly as those of [`fail()`](#function-fail-failure-args-).

### function `use( engine )`
Wraps the _assertion engine_, putting it into use.
This function is called internally upon
loading the package, with Node.js built-in _`assert`_ package or with its own substitute,
when loaded via a bundler ([browserify](https://browserify.org/), [webpack](https://webpack.js.org/),
[rollup](https://rollupjs.org) or similar.)<br/>
You might need this function when using something like
[assert](https://github.com/browserify/commonjs-assert) package for front-end.

This function _**does not** modify_ the supplied _`engine`_ instance in any way, and<br/>
it does not alter the exported ( _`beforeThrow, fail, ifError, ok, use`_ ) values either.

All other properties of the engine argument will be assigned to the already exported API.

### property `strict?: function()`
Is present only if the assertion engine in use has such property
(see [Node.js docs](http://nodejs.org/api/assert.html)), it will be mirrored to the
package object instance. For subtle details, see the [source code](src/common.js).

### Other properties
Any properties of the assertion engine, not shadowed by the API described above,
will be directly assigned to package object instance.

## Advanced topics
### Changing package settings
Calls to _`beforeThrow()`_ or _`use()`_ anywhere in your code affect the state `assert-fine` instance
kept in [_`require.cache`_](http://nodejs.org/api/modules.html#modules_require_cache) or alike.
It is preferable to make these calls from the application boot module, before executing
any other code.

### Switching the assertion engine
If you need something special in place of the default engine, do something like this:
```js
import engine from 'assert'         //  A npm package for front-end applications.
import assert from 'assert-fine'

assert.use(engine)  //  Should be executed _before_ any possible assertion call.
```
Technically, it is possible to switch engines at any moment.

### The global callback function
This function, if set  via [`beforeThrow()`](#function-beforethrowcallback), should be kept
as simple as possible. It's typical use is just to provide a code line for debugger breakpoint.

If the callback itself throws an error, it will be stored in assertion instance's _`extra`_
property and its _`message`_ will be appended to the assertion message using '[EXTRA]:' prefix.

The callback receives two arguments:<br/>
`error: Error` - the instance that will be thrown;<br/>
`args: any[]` - the _`args`_ from the call of `fail()`, `ifError()` or `ok()`.

## Acknowledgements
[assert](https://github.com/browserify/commonjs-assert) npm package - I borrowed quite some
pieces of code from there - thanks a lot, folks!

[debug](https://github.com/visionmedia/debug) npm package - inspecting its source code
helped me to fix the disastrous bug (issue #1) of this package - thanks again!
