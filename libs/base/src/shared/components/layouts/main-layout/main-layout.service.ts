import { computed, Injectable, signal } from '@angular/core';
import { debounceTime, fromEvent, MonoTypeOperatorFunction, pipe, Subject, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteHelperService, startWithTap } from '../../../../core';
import { ResolveStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainLayoutService {
  // Loading indicator for the layout.
  private _loading = signal(false);
  // We set this to failed if the loader failed somehow. this will show the user the ability to retry
  private _failed = signal(false);
  // Loading indicator for the layout which doesn't disrupt the user.
  private _softLoading = signal(false);

  loading = this._loading.asReadonly();
  failed = this._failed.asReadonly();
  softLoading = this._softLoading.asReadonly();

  windowResized$ = new Subject();
  cancelLoader$ = new Subject();

  topbarItems = computed(() => {
    const childrenItems = this.routeHelper.routeChildrenItems();
    return childrenItems.filter((t) => !!t.label || !!t.icon);
  });

  constructor(
    private router: Router,
    private routeHelper: RouteHelperService,
  ) {
    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(), debounceTime(20))
      .subscribe(() => {
        this.windowResized$.next(null);
      });

    this.router.events.pipe(takeUntilDestroyed()).subscribe((e) => {
      if (e instanceof ResolveStart) {
        this.setFailed(false);
        this.setLoading(false);
        this.cancelLoader$.next(null);
      }
    });
  }

  setLoading(state: boolean) {
    this._loading.set(state);
  }

  setFailed(state: boolean) {
    this._failed.set(state);
  }

  setSoftLoading(state: boolean) {
    this._softLoading.set(state);
  }

  loaderPipe = <T>(): MonoTypeOperatorFunction<T> =>
    pipe(
      takeUntil(this.cancelLoader$),
      startWithTap(() => {
        this.setFailed(false);
        this.setLoading(true);
      }),
      tap({
        next: () => {
          this.setLoading(false);
        },
        error: () => {
          this.setFailed(true);
        },
      }),
    );

  softLoaderPipe = <T>(): MonoTypeOperatorFunction<T> =>
    pipe(
      takeUntil(this.cancelLoader$),
      startWithTap(() => {
        this.setSoftLoading(true);
      }),
      tap({
        next: () => {
          this.setSoftLoading(false);
        },
        error: () => {
          this.setSoftLoading(false);
          // ... ?
        },
      }),
    );
}
