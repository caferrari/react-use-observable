# react-use-observable

Use observables with react hooks in an very easy way.

## Requirements

* React >= 16.8
* RxJS >= 6

## Installation

```bash
yarn add react-use-observable
```

## Usage

```js
import React from 'react';
import { useObservable } from 'react-use-observable';
import * as rxjs from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface IProps {
  start: number;
}

export const Counter: React.FC<IProps> = ({ start }) => {
  const [ value ] = useObservable(() => {
    return rxjs.interval(1000).pipe(
      map(v => v + start),
      startWith(start)
    );
  }, [/* deps */])

  return (
    <p>Started with undefined, value: {value}</p>
  );
}
```

## API

|                     Hook                      |                Return                 |                                                                                               Description                                                                                                |
| --------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| useObservable(Func, DepsArray)                | Value, Error, Completed               | Run the observable function on every deps change, the first value will be undefined                                                                                                                      |
| useRetryableObservable(Func, DepsArray)       | Value, Error, Completed, RetryFunc    | Same useObservable, but the last value of return is a retry function to rerun the observable function, useful when an error happens or do a refresh                                                      |
| useMappedObservable(Func, MapFunc, DepsArray) | Value, Error, Completed               | Same useObservable, but with a internal map and a distinctUntilChanged, useful to do less renders                                                                                                        |
| useCallbackObservable(Func, DepsArray)        | CallbackFunc, Value, Error, Completed | Same useObservable, but the first result is the callbackFunction and run the observable function only when it is called, useful to use in a submit or button's click and keep the unsubscribe on unmount |

