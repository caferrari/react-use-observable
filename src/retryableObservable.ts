import { DependencyList, useCallback, useState } from 'react';

import { observerFunction, useObservable } from './observable';

/**
 * Create a memoized observable and unsubscribe automatically if component unmount and a
 * retry function
 * @returns [observableValue, error, isCompleted, retryFunction]
 */
export function useRetryableObservable<T, W>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList
): [W | undefined, any, boolean, () => void] {
  const [retryCounter, setRetryCounter] = useState(0);
  const retry = useCallback(() => setRetryCounter(retryCounter + 1), [retryCounter]);

  const result = useObservable(observableGenerator, [...deps, retryCounter]);

  return [...result, retry] as any;
}
