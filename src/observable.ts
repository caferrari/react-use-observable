import { DependencyList, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export type observerFunction<T> = () => Observable<T>;

/**
 * Create a memoized observable and unsubscribe automatically if component unmount
 * @returns [observableValue, error, isCompleted]
 */
export function useObservable<T>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList
): [T | undefined, any, boolean, undefined] {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState();
  const [complete, setComplete] = useState<boolean>(false);

  const cb = useCallback(observableGenerator, deps);

  useEffect(() => {
    setValue(undefined);
    setError(undefined);
    setComplete(false);

    const sub = cb().subscribe(
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

  return [value, error, complete, undefined];
}
