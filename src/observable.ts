import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { Observable, Subscription } from 'rxjs';

export type observerFunction<T> = () => Observable<T>;

/**
 * Create a memoized observable and unsubscribe automatically if component unmount
 * @returns [observableValue, error, isCompleted]
 */
export function useObservable<T>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList
): [T | undefined, any, boolean, undefined] {
  let initialValue: T,
    initialError: any,
    initialCompleted = false;

  const cb = useCallback(observableGenerator, deps);
  const state = useRef({ firstRender: true, initialized: false, subscription: null as Subscription }).current;

  if (state.firstRender) {
    state.subscription = cb().subscribe(
      data => {
        initialValue = data;
        if (!state.initialized) return;
        setValue(data);
        setError(undefined);
      },
      err => {
        initialError = err;
        if (!state.initialized) return;

        setValue(undefined);
        setError(err);
      },
      () => {
        initialCompleted = true;
        if (!state.initialized) return;

        setComplete(true);
      }
    );
  }

  useEffect(() => {
    if (!state.firstRender) {
      setValue(undefined);
      setError(undefined);
      setComplete(false);

      state.subscription && state.subscription.unsubscribe();
      state.subscription = cb().subscribe(
        (data: T) => {
          setValue(data);
          setError(undefined);
        },
        (err: any) => {
          setValue(undefined);
          setError(err);
        },
        () => setComplete(true)
      );
    }

    state.firstRender = false;
    return () => state.subscription && state.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cb]);

  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState(initialError);
  const [complete, setComplete] = useState<boolean>(initialCompleted);

  state.initialized = true;

  return [value, error, complete, undefined];
}
