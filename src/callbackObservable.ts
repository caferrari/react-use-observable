import { DependencyList, useCallback, useRef, useState } from 'react';
import { never, Observable, Subject } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { useObservable } from './observable';

/**
 * Create a memoized callback that uses an observable and unsubscribe automatically if component unmount
 * @returns a memoized version of the callback that only changes if one of the inputs has changed
 */
export function useCallbackObservable<T extends (...args: any[]) => Observable<any>>(
  observableGenerator: T,
  deps: DependencyList
): [() => void, T | undefined, any, boolean] {
  const [error, setError] = useState();
  const submitted$ = useRef(new Subject<any>()).current;

  const [data, , completed] = useObservable(() => {
    return submitted$.pipe(
      switchMap(args => observableGenerator(...args)),
      catchError(err => {
        setError(err);
        return never();
      })
    );
  }, deps);

  const callback = useCallback((...args: any[]) => submitted$.next(args), [submitted$]);

  return [callback, data, error, completed] as [typeof callback, T | undefined, any, boolean];
}
