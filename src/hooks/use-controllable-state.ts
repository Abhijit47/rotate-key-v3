// import * as React from "react";

// import { useState } from "react";

// // type ChangeHandler$1<T> = (state: T) => void;
// // type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;
// // interface UseControllableStateParams$1<T> {
// //   prop?: T | undefined;
// //   defaultProp: T;
// //   onChange?: ChangeHandler$1<T>;
// //   caller?: string;
// // }
// // declare function useControllableState<T>({
// //   prop,
// //   defaultProp,
// //   onChange,
// //   caller,
// // }: UseControllableStateParams$1<T>): [T, SetStateFn<T>];

// type ChangeHandler<T> = (state: T) => void;

// type ChangeHandler$1<T> = (state: T) => void;
// type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;
// interface UseControllableStateParams$1<T> {
//   prop?: T | undefined;
//   defaultProp: T;
//   onChange?: ChangeHandler$1<T>;
//   caller?: string;
// }
// export function useControllableState<T>({
//   prop,
//   defaultProp,
//   onChange,
//   caller,
// }: UseControllableStateParams$1<T>): [T, SetStateFn<T>] {
//   const [state, setState] = useState<T>(prop || defaultProp);

//   return [state, setState];
// }

import * as React from "react";

// Type Definitions from Signature
type ChangeHandler$1<T> = (state: T) => void;
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

interface UseControllableStateParams$1<T> {
  prop?: T | undefined;
  defaultProp: T;
  onChange?: ChangeHandler$1<T>;
  caller?: string;
}

type ChangeHandler<T> = (state: T) => void;

interface UseControllableStateParams<T> {
  prop: T | undefined;
  defaultProp: T;
  onChange: ChangeHandler<T> | undefined;
  caller: string;
}

interface AnyAction {
  type: string;
}

// 1. useControllableState Implementation
function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
  caller,
}: UseControllableStateParams$1<T>): [T, SetStateFn<T>] {
  const isControlled = prop !== undefined;
  const [uncontrolledState, setUncontrolledState] =
    React.useState<T>(defaultProp);

  const value = isControlled ? prop : uncontrolledState;

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (nextState: React.SetStateAction<T>) => {
      const setter = nextState as (prevState: T) => T;
      const nextValue =
        typeof nextState === "function" ? setter(value) : nextState;

      if (nextValue !== value) {
        if (!isControlled) {
          setUncontrolledState(nextValue);
        }
        if (onChangeRef.current) {
          onChangeRef.current(nextValue);
        }
      }
    },
    [isControlled, value],
  );

  return [value, setValue];
}

// 2. useControllableStateReducer Implementation
function useControllableStateReducer<T, S extends {}, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialState: S,
): [S & { state: T }, React.Dispatch<A>];

function useControllableStateReducer<T, S extends {}, I, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialArg: I,
  init: (i: I & { state: T }) => S,
): [S & { state: T }, React.Dispatch<A>];

function useControllableStateReducer<T, S extends {}, I, A extends AnyAction>(
  reducer: (prevState: S & { state: T }, action: A) => S & { state: T },
  userArgs: UseControllableStateParams<T>,
  initialArg: any,
  init?: (i: any) => S,
): [S & { state: T }, React.Dispatch<A>] {
  const { prop, defaultProp, onChange } = userArgs;
  const isControlled = prop !== undefined;

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Calculate the ultimate initial core state slice
  const getInitialCoreState = (): S => {
    if (init) {
      return init({ ...initialArg, state: isControlled ? prop : defaultProp });
    }
    return initialArg;
  };

  const [uncontrolledState, dispatch] = React.useReducer(
    (prevState: S & { state: T }, action: A) => {
      const nextState = reducer(prevState, action);

      if (prevState.state !== nextState.state && onChangeRef.current) {
        onChangeRef.current(nextState.state);
      }

      return nextState;
    },
    null,
    () => {
      const coreState = getInitialCoreState();
      return {
        ...coreState,
        state: isControlled ? prop : defaultProp,
      };
    },
  );

  // Sync state if component becomes controlled or prop changes values externally
  const currentState = isControlled
    ? { ...uncontrolledState, state: prop }
    : uncontrolledState;

  return [currentState, dispatch];
}

export { useControllableState, useControllableStateReducer };
