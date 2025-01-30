import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { BaseStore } from './_base.store';
import { CacBase } from '../../configs';

export interface AppBaseStoreProps {
  rememberMe?: boolean;
  lang?: string;
}

export class AppBaseStore<T extends AppBaseStoreProps> extends BaseStore<T> {
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
    return this.get().lang ?? CacBase.defaultLang;
  }

  setLang(value: string) {
    // @ts-ignore
    this.patch({
      lang: value,
    });
  }
}

// This dummy is used to make service out of the AppBaseStore
@Injectable({
  providedIn: 'root',
})
export class _DummyAppBaseStore extends AppBaseStore<AppBaseStoreProps> {
  constructor() {
    super();
  }
}
