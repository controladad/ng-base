import { DestroyRef, Signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export function effectDep<T>(dep: Signal<T>, fn: (state: T) => void, destroyRef?: DestroyRef) {
  return toObservable(dep).pipe(takeUntilDestroyed(destroyRef)).subscribe(fn);
}
