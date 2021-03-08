import { DependencyList, useCallback, useRef, useState } from 'react';
import { never, Observable, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { useObservable } from './observable';

/**
 * Create a memoized callback that uses an observable and unsubscribe automatically if component unmount
 * @returns a memoized version of the callback that only changes if one of the inputs has changed
 */
export function useCallbackObservable<T>(
  observableGenerator: (...args: any[]) => Observable<T>,
  deps: DependencyList
): [(...args: any[]) => void, T | null, any, boolean, undefined] {
  const [error, setError] = useState();
  const submitted$ = useRef(new Subject<any>()).current;

  const [data, , completed] = useObservable(() => {
    return submitted$.pipe(
      tap(() => setError(undefined)),
      switchMap(args =>
        observableGenerator(...args).pipe(
          catchError(err => {
            setError(err);
            return never();
          })
        )
      )
    );
  }, deps);

  const callback = useCallback((...args: any[]) => submitted$.next(args), [submitted$]);

  return [callback, data, error, completed, undefined];
}
