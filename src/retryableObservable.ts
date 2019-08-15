import { DependencyList, useCallback, useRef, useState } from 'react';
import { BehaviorSubject, never } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { observerFunction, useObservable } from './observable';

/**
 * Create a memoized observable and unsubscribe automatically if component unmount and a
 * retry function
 * @returns [observableValue, error, isCompleted, retryFunction]
 */
export function useRetryableObservable<T>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList
): [T | undefined, any, boolean, () => void] {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const submitted$ = useRef(new BehaviorSubject<boolean>(true)).current;

  const [, , completed] = useObservable(() => {
    return submitted$.pipe(
      tap(() => setData(undefined)),
      tap(() => setError(undefined)),
      switchMap(() =>
        observableGenerator().pipe(
          tap(result => setData(result)),
          catchError(err => {
            setError(err);
            return never();
          })
        )
      )
    );
  }, deps);

  const retry = useCallback(() => submitted$.next(true), [submitted$]);

  return [data, error, completed, retry] as [T | undefined, any, boolean, typeof retry];
}
