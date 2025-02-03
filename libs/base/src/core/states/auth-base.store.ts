import { computed, inject, Injectable } from '@angular/core';
import { getStore, select } from '@ngneat/elf';
import { filter, interval, Observable, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BaseStore } from './_base.store';
import { flatten } from '../helpers';
import { localStorageStrategy, sessionStorageStrategy, StateStorage } from '@ngneat/elf-persist-state';
import { CacGlobalConfig } from '../../configs';
import { AppBaseStore } from './app-base.store';

export interface AuthBaseStoreProps<USER> {
  token?: string;
  user?: USER;
}

export interface AuthBaseStoreLoginModel {
  rememberMe?: boolean;
}

function storage() {
  // We are directly accessing the store to prevent circular dependencies
  const store = getStore<any>(CacGlobalConfig.generateStoreKey('app'));
  const rememberMe = store?.getValue().rememberMe ?? false;
  if (rememberMe) {
    return localStorageStrategy;
  } else {
    return sessionStorageStrategy;
  }
}

export const AuthStorageEngine: StateStorage = {
  getItem: (key) => {
    return storage().getItem(key);
  },
  setItem: (key, value) => {
    return storage().setItem(key, value);
  },
  removeItem: (key) => {
    return storage().removeItem(key);
  },
};

// This should be extended for customization
export class _AuthBaseStore<T extends AuthBaseStoreProps<any>, L extends AuthBaseStoreLoginModel> extends BaseStore<T> {
  protected router = inject(Router);
  protected app = inject(AppBaseStore);

  constructor(
    public opts: {
      loginApi: (model: L) => Observable<T>;

      // Specific api which returns user info based on the current token
      meApi: () => Observable<T['user']>;
    } = {
      loginApi: () => throwError(() => new Error('Please implement login api in the AuthStore')),
      meApi: () => of(undefined),
    },
  ) {
    super({
      key: 'auth',
      storageStrategy: AuthStorageEngine,
    });
  }

  isAuthenticatedSignal = computed(() => this.isAuthenticated(this.signal()));
  isLoggedInSignal = computed(() => this.isLoggedIn(this.signal()));
  permissionKeysSignal = computed(() => this.permissionKeys(this.signal()));

  isAuthenticated$ = this.store.pipe(select(this.isAuthenticated));
  isLoggedIn$ = this.store.pipe(select(this.isLoggedIn));
  permissionKeys$ = this.store.pipe(select(this.permissionKeys));

  isAuthenticated(state?: T) {
    const token = (state ?? this.state).token;
    return !!token;
  }

  isLoggedIn(state?: T) {
    const values = state ?? this.store.getValue();
    return !!values.user?.id;
  }

  isSuper() {
    return !!this.state.user?.permissions?.find((t: any) => t === 'SuperAdmin');
  }

  permissionKeys(state?: T): string[] {
    const user = (state ?? this.state).user;
    return user?.roles?.length ? flatten(user?.roles.map((t: any) => t.permissions)) : user?.permissions;
  }

  login(model: L) {
    this.app.setRememberMe(model.rememberMe ?? false);
    return this.opts.loginApi(model).pipe(
      switchMap((result) => {
        return this.checkLoginValidity(result);
      }),
      tap((result) => {
        this.patch(result);
      }),
    );
  }

  // optional navigate is used by interceptors to prevent force navigating to /login
  logout(optionalNavigate?: boolean) {
    const isLogged = this.isLoggedIn();
    this.store.reset();
    return !isLogged && optionalNavigate ? new Promise<boolean>(() => true) : this.router.navigate(['/login']);
  }

  /**
   *
   * @param intervalPeriod ms - if provided, it will call the refresh within that interval repeatedly
   */
  refresh(intervalPeriod?: number) {
    return (
      intervalPeriod
        ? interval(intervalPeriod).pipe(
            startWith(0),
            filter((counter) => (counter >= 1 ? document.visibilityState === 'visible' : true)),
          )
        : of(0)
    ).pipe(
      switchMap(() => {
        if (!this.state.token) return of(true);

        const userId = this.state.user?.id;
        if (!userId) {
          this.logout();
          return of(true);
        }

        return this.opts.meApi().pipe(
          tap((result) => {
            if (result) {
              // @ts-ignore
              this.patch({
                user: result,
              });
            }
          }),
          switchMap(() => {
            const state = this.state;
            if (this.isForbiddenToEnter(state)) {
              this.logout();
              return throwError(() => 'Forbidden');
            }
            return of(true);
          }),
        );
      }),
    );
  }

  // uses isForbiddenToEnter under the hood
  protected checkLoginValidity(result: T) {
    if (this.isForbiddenToEnter(result)) {
      return throwError(() => 'Forbidden');
    }
    return of(result);
  }

  protected isForbiddenToEnter(state: T) {
    const perms = this.permissionKeys(state);
    if (perms?.length === 0) {
      snackbar$.error($localize`:@@base.errors.auth.yourAccessDenied:Your Access Denied.`);
      return true;
    }
    return false;
  }
}

// This is dummy, used to make service out of the `_AuthBaseStore`, for extension, `_AuthBaseStore` should be used
@Injectable({
  providedIn: 'root',
})
export class AuthBaseStore extends _AuthBaseStore<AuthBaseStoreProps<any>, AuthBaseStoreLoginModel> {
  constructor() {
    super();
  }
}
