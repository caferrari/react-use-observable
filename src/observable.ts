import { DependencyList, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

type observerFunction<T> = () => Observable<T>
type equal = (a: any, b: any) => boolean;

let isEqual: equal = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

import('lodash.isequal')
  .then(module => module.default)
  .catch(() => import ('lodash').then(module => module.isEqual))
  .catch(() => isEqual)
  .then(fnt => isEqual = fnt)

export function useObservable<T>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList
): [T | undefined, any, boolean] {

  const [value, setValue] = useState<T>();
  const [error, setError] = useState();
  const [complete, setComplete] = useState<boolean>(false);

  const cb = useCallback(observableGenerator, deps)

  useEffect(() => {
    const sub = cb()
      .pipe(
        distinctUntilChanged((a, b) => isEqual(a, b))
      )
      .subscribe(
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
    return () => sub.unsubscribe();
  }, [cb]);

  return [value, error, complete];
}