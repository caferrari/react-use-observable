import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { Observable } from 'rxjs';

export type observerFunction<T> = () => Observable<T>;

/**
 * Create a memoized observable and unsubscribe automatically if component unmount
 * @returns [observableValue, error, isCompleted]
 */
export function useObservable<T>(
  observableGenerator: observerFunction<T>,
  deps: DependencyList,
  defaultValue: T | null = null
): [T | null, any, boolean] {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState();
  const [complete, setComplete] = useState<boolean>(false);

  const cb = useCallback(observableGenerator, deps);

  useEffect(() => {
    setError(undefined);
    setComplete(false);

    const sub = cb().subscribe(
      (data: T) => {
        setValue(data);
        setError(undefined);
      },
      (err: any) => {
        setValue(null);
        setError(err);
      },
      () => setComplete(true)
    );
    return () => sub.unsubscribe();
  }, [cb]);

  return [value === null ? defaultValue : value, error, complete];
}
