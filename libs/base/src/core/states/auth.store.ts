import { computed, inject, Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { persistState } from '@ngneat/elf-persist-state';
import { filter, interval, of, startWith, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { StorageEngine } from '../engines';
import { BaseStore } from './_base.store';
import { AuthEntity, UserEntity } from '../models';
import { AppStore } from './app.store';
import { AuthApiService } from '../services';
import { flatten } from '../helpers';

const AUTH_KEY = 'auth';

export interface AuthStoreProps {
  token?: string;
  user?: UserEntity;
}

export interface AuthStoreLoginModel {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export const authStore = createStore({ name: AUTH_KEY }, withProps<AuthStoreProps>({}));
persistState(authStore, {
  key: AUTH_KEY,
  storage: StorageEngine,
});

@Injectable({
  providedIn: 'root',
})
export class AuthStore<T extends AuthStoreProps = AuthStoreProps> extends BaseStore<T> {
  protected router = inject(Router);
  protected app = inject(AppStore);
  protected authApi = inject(AuthApiService);

  permissionKeysSignal = computed(() => this.permissionKeys(this.signal()));

  constructor() {
    super(authStore as never);
  }

  isAuthenticated$ = this.store.pipe(select(this.isAuthenticated));
  isLoggedIn$ = this.store.pipe(select(this.isLoggedIn));

  isAuthenticated(state?: AuthStoreProps) {
    const token = (state ?? this.state).token;
    return !!token;
  }

  isLoggedIn(state?: AuthStoreProps) {
    const values = state ?? this.store.getValue();
    return !!values.user?.id;
  }

  isSuper() {
    return !!this.state.user?.permissions?.find((t) => t === 'SuperAdmin');
  }

  permissionKeys(state?: AuthStoreProps) {
    const user = (state ?? this.state).user;
    return user?.roles?.length ? flatten(user?.roles.map((t) => t.permissions)) : user?.permissions;
  }

  login(model: AuthStoreLoginModel) {
    this.app.setRememberMe(model.rememberMe ?? false);
    return this.authApi
      .login({
        nationalCode: model.username,
        password: model.password,
      })
      .pipe(
        switchMap((result) => {
          return this.checkLoginValidity(result);
        }),
        tap((result) => {
          console.log('Logged in.');
          // @ts-ignore
          this.patch({
            token: result.jwt,
            user: result.user,
          });
        }),
      );
  }

  // optional navigate is used by interceptors to prevent force navigating to /login
  logout(optionalNavigate?: boolean) {
    const isLogged = this.isLoggedIn();
    this.store.reset();
    console.log('Logged out.');
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

        return this.authApi.me().pipe(
          tap((result) => {
            // @ts-ignore
            this.patch({
              user: result.user,
            });
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

  protected checkLoginValidity(result: AuthEntity) {
    if (this.isForbiddenToEnter(result)) {
      return throwError(() => 'Forbidden');
    }
    return of(result);
  }

  private isForbiddenToEnter(state: AuthStoreProps) {
    const perms = this.permissionKeys(state);
    if (perms?.length === 0) {
      snackbar$.error('شما دسترسی به پنل را ندارید.');
      return true;
    }
    return false;
  }
}
