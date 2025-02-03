import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { BaseStore } from './_base.store';
import { CacGlobalConfig } from '../../configs';

export interface AppBaseStoreProps {
  rememberMe?: boolean;
  lang?: string;
}

export class _AppBaseStore<T extends AppBaseStoreProps> extends BaseStore<T> {
  constructor() {
    super({
      key: 'app',
    });
  }

  rememberMe$ = this.store.pipe(select(this.rememberMe));
  lang$ = this.store.pipe(select(this.lang));

  rememberMe() {
    return this.get().rememberMe ?? false;
  }

  setRememberMe(value: boolean) {
    // @ts-ignore
    this.patch({
      rememberMe: value,
    });
  }

  lang() {
    return this.get().lang ?? CacGlobalConfig.defaultLang;
  }

  setLang(value: string) {
    // @ts-ignore
    this.patch({
      lang: value,
    });
  }
}

// This is dummy, used to make service out of the `_AppBaseStore`, for extension, `_AppBaseStore` should be used
@Injectable({
  providedIn: 'root',
})
export class AppBaseStore extends _AppBaseStore<AppBaseStoreProps> {
  constructor() {
    super();
  }
}
