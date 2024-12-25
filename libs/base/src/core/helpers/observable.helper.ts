import { distinctUntilChanged, filter, map, MonoTypeOperatorFunction, Observable, of, pipe, tap } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ItemRecord, ItemRecords$ } from '../interfaces';
import { DestroyRef } from '@angular/core';

export function getItemRecordObservable<T, U>(items: ItemRecords$<T, U>): Observable<ItemRecord<T, U>[] | undefined> {
  return items instanceof Observable ? items : of(items);
}

export function startWithTap<T>(callback: () => void) {
  return (source: Observable<T>) =>
    of({}).pipe(
      tap(callback),
      switchMap(() => source),
    );
}

export function filterEmpty<T>(): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) =>
    source.pipe(
      filter((x) =>
        x instanceof Array
          ? x.filter((t) => t !== undefined && t !== null).length === x.length
          : x !== undefined && x !== null,
      ),
    );
}

export function distinctUntilChangedWithTimeout<T>(
  timeout: number,
  compare?: (pre: any, cur: any) => boolean,
): MonoTypeOperatorFunction<T> {
  return pipe(
    map((t) => ({ value: t, date: new Date() })),
    distinctUntilChanged(
      (pre, cur) =>
        (compare ? compare(pre?.value, cur?.value) : pre?.value === cur?.value) &&
        pre.date.getTime() > cur.date.getTime() - timeout,
    ),
    map((t) => t.value),
  );
}

export function destroyRefObservable(ref: DestroyRef) {
  return new Observable<void>((observer) => {
    ref!.onDestroy(observer.next.bind(observer));
  });
}
