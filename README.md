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
    return rxjs.interval(1000)
      .pipe(
        map(v => v + start),
        startWith(start),
      );
  }, [start])

  return (
    <p>Started with {start}, value: {value}</p>
  );
}
```