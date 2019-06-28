import { DependencyList, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export type observerFunction<T> = () => Observable<T>

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