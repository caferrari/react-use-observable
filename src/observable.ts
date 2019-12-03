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
): [T | null, any, boolean, undefined] {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState();
  const [complete, setComplete] = useState<boolean>(false);

  const defaultValueRef = useRef(defaultValue);

  const cb = useCallback(observableGenerator, deps);

  useEffect(() => {
    setValue(defaultValueRef.current || null);
    setError(undefined);
    setComplete(false);

    defaultValueRef.current = null;

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
  }, [cb, defaultValue]);

  return [value, error, complete, undefined];
}
