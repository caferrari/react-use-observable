import { DependencyList, useCallback } from 'react';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { observerFunction, useObservable } from './observable';

/**
 * Create a memoized observable with a map implemented and a distinctUntilChanged,
 * the observable will be unsubscribe automatically if component unmount
 * @returns [observableValue, error, isCompleted]
 */
export function useMappedObservable<T, W>(
  observableGenerator: observerFunction<T>,
  mapperFunction: (data: T) => W,
  deps: DependencyList
): [W | undefined, any, boolean, undefined] {
  const newGenerator = useCallback(() => {
    return observableGenerator().pipe(
      map(mapperFunction),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observableGenerator]);

  return useObservable(newGenerator, deps);
}
