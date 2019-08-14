import { DependencyList, useCallback, useRef, useState } from 'react';
import { never, Observable } from 'rxjs';

import { useObservable } from './observable';

/**
 * Create a memoized callback that uses an observable and unsubscribe automatically if component unmount
 * @returns a memoized version of the callback that only changes if one of the inputs has changed
 */
export function useCallbackObservable<T extends (...args: any[]) => Observable<any>>(
  observableGenerator: T,
  deps: DependencyList
): [() => void, T | undefined, any, boolean] {
  const [submitArgs, setSubmitArgs] = useState<any[]>();

  const result = useObservable(() => {
    if (submitArgs === undefined) return never();
    return observableGenerator(submitArgs);
  }, [...deps, submitArgs]);

  const callback = useCallback((...args: any[]) => setSubmitArgs([...args]), []);

  return [callback, ...result] as [typeof callback, T | undefined, any, boolean];
}
