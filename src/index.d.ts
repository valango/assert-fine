//  src/index.d.ts

declare module "assert-fine" {
  /**
   * An alias of {@link ok}.
   * @param value The input that is checked for being truthy.
   * @param message may be an Error instance or format string for rest of the args.
   * @param args will be injected into error message according to format.
   * If eny of these is a function, it will be called with the rest of args and the
   * returned value will be inserted into error message.
   */
  function assertFine(value: unknown, message?: string | Error, ...args: any[]): asserts value

  namespace assertFine {
    /**
     * Indicates the failure of an assertion. All errors thrown by the `assert` module
     * will be instances of the `AssertionError` class.
     */
    class AssertionError extends Error {
      actual: unknown
      expected: unknown
      operator: string
      generatedMessage: boolean
      code: 'ERR_ASSERTION'

      constructor(options?: {
        /** If provided, the error message is set to this value. */
        message?: string | undefined
        /** The `actual` property on the error instance. */
        actual?: unknown | undefined
        /** The `expected` property on the error instance. */
        expected?: unknown | undefined
        /** The `operator` property on the error instance. */
        operator?: string | undefined
        /** If provided, the generated stack trace omits frames before this function. */
        // tslint:disable-next-line:ban-types
        stackStartFn?: Function | undefined
      })
    }

    /**
     * Sets, resets or just queries the global hook function.
     *
     * The callback will be called right before the assertion error is thrown.
     * It's main purpose is to provide debugger breakpoint.
     *
     * @throws {TypeError} on illegal `callback` argument type.
     */
    function beforeThrow(callback?: false | ((error?: Error, args?: any[]) => void)): undefined | (() => void)

    /**
     * A replacement for native fail() function.
     * @see {@link http://nodejs.org/api/assert.html#assert_assert_fail_message}
     */
    function fail(message?: string | Error, ...args: any[]): never

    /**
     * A replacement for native ifError() function.
     * @see {@link http://nodejs.org/api/assert.html#assert_assert_iferror_value}
     */
    function ifError(actual, ...args): void

    /**
     * A replacement for native ok() function.
     * @see {@link http://nodejs.org/api/assert.html#assert_assert_ok_message}
     *
     * If any of `args` is a function, it will be executed with the rest of `args` as arguments
     * and it's return value used according to the `format` string.
     */
    function ok(value: unknown, format?: string | Error, ...args: unknown[]): asserts value

    /**
     * You might need this in special cases only, like when using a
     * [custom assert engine](https://github.com/browserify/commonjs-assert).
     *
     * This being the case, make sure this function gets called before any other.
     */
    function use(engine: Object): void

    const strict: Omit<typeof assertFine, 'beforeThrow' | 'ifError' | 'ok' | 'use' | 'strict'> & {
      (value: unknown, message?: string | Error, ...args: unknown[]): asserts value
      // TS2775: Assertions require every name in the call target
      // to be declared with an explicit type annotation.
      ifError: typeof ifError
      ok: typeof ok
      strict: typeof strict
    }
  }

  export = assertFine
}
