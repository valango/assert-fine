//  src/browser.d.ts
declare module 'assert-fine' {
  /** An alias of `assert.ok()`. */
  function assert (value: any, ...args: any): void;

  namespace assert {
    class AssertionError extends Error {
      actual: any;
      expected: any;
      operator: string;
      originalMessage: string;
      generatedMessage: boolean;
      code: 'ERR_ASSERTION';

      constructor (options?: {
        /** If provided, the error message is set to this value. */
        message?: string;
        /** The `actual` property on the error instance. */
        actual?: any;
        /** The `expected` property on the error instance. */
        expected?: any;
        /** The `operator` property on the error instance. */
        operator?: string;
        /** If provided, the generated stack trace omits frames before this function. */
        // tslint:disable-next-line:ban-types
        stackStartFn?: Function;
      });
    }

    interface AssertionCore {
      AssertionError: AssertionError;
    }

    interface HookFn {
      (err?: Error, ...args: any): any;
    }

    function fail (...args: any): never;

    function hook (callback?: HookFn): HookFn;

    function ok (value: any, ...args: any): void;

    function use (api: AssertionCore): typeof assert;

    const strict: typeof assert;
  }

  export = assert;
}
