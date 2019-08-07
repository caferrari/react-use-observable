import { DependencyList, useCallback, useRef } from 'react';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { useObservable } from './observable';

/**
 * Create a memoized callback that uses an observable and unsubscribe automatically if component unmount
 * @returns a memoized version of the callback that only changes if one of the inputs has changed
 */
export function useCallbackObservable<T extends (...args: any[]) => Observable<any>>(
  observableGenerator: T,
  deps: DependencyList
): () => void {
  const submitted$ = useRef(new Subject<any>()).current;

  useObservable(() => {
    return submitted$.pipe(switchMap(args => observableGenerator(...args)));
  }, deps);

  return useCallback((...args: any[]) => submitted$.next(args), [submitted$]);
}
