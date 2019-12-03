import { DependencyList, useCallback, useRef } from 'react';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { observerFunction, useObservable } from './observable';

/**
 * Create a memoized observable with a map implemented and a distinctUntilChanged,
 * the observable will be unsubscribe automatically if component unmount
 * @returns [observableValue, error, isCompleted]
 */
export function useMappedObservable<T, W>(
  observableGenerator: observerFunction<T>,
  mapperFunction: (data: T) => W,
  deps: DependencyList,
  defaultValue: W | null = null
): [W | null, any, boolean, undefined] {
  const mapper = useRef(mapperFunction);

  const newGenerator = useCallback(() => {
    return observableGenerator().pipe(
      filter(value => !!value),
      map(mapper.current),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }, [observableGenerator]);

  return useObservable(newGenerator, deps, defaultValue);
}
