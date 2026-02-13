import {
  GetStepTools,
  InngestFunction,
  type GetEvents,
  type GetFunctionInput,
} from 'inngest';
import { inngest } from './client';

/**
 ** Helpers
 - The TS SDK exports some helper types to allow you to access the type of particular Inngest internals outside of an Inngest function.
 */

/**
 * GetEvents `v2.0.0+`
 - Get a record of all available events given an Inngest client.

 - It's recommended to use this instead of directly reusing your own event types, as Inngest will add extra properties and internal events such as `ts` and `inngest/function`.failed.
 */
export type Events = GetEvents<typeof inngest>;

/**
 * By default, the returned events do not include internal events prefixed with inngest/, such as inngest/function.finished.

 - To include these events in `v3.13.1+` , pass a second `true` generic:
 */
export type GenericEvents = GetEvents<typeof inngest, true>;

/**
 * GetFunctionInput `v3.3.0+`
 - Get the argument passed to Inngest functions given an Inngest client and, optionally, an event trigger.
 - Useful for building function factories or other such abstractions.
 */
export type InputArg = GetFunctionInput<typeof inngest>;
export type InputArgWithTrigger = GetFunctionInput<
  typeof inngest,
  'user/new.signup'
>;

/**
 * GetStepTools `v3.3.0+`
 - Get the `step` object passed to an Inngest function given an Inngest client and, optionally, an event trigger.
 - Is a small shim over the top of `GetFunctionInput<...>["step"]`.
 */
export type StepTools = GetStepTools<typeof inngest>;
export type StepToolsWithTrigger = GetStepTools<
  typeof inngest,
  'user/new.signup'
>;

/**
 * Inngest.Any / InngestFunction.Any `v3.10.0+`
 - Some exported classes have an `Any` type within their namespace that represents any instance of that class without inference or generics.
 - This is useful for typing variables that can hold any instance of that class, such as a list of functions or factories that create Inngest primitives.
 */
export const functionsToServe: InngestFunction.Any[] = [];
