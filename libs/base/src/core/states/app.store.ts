import { Injectable } from '@angular/core';
import { createStore, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';
import { BaseStore } from './_base.store';

const APP_KEY = 'app';

interface AppStoreProps {
  rememberMe?: boolean;
  entezamatAutoAction?: string;
  clientId?: string;
}

export const appStore = createStore({ name: APP_KEY }, withProps<AppStoreProps>({}));
persistState(appStore, {
  key: APP_KEY,
  storage: localStorageStrategy,
});

@Injectable({
  providedIn: 'root',
})
export class AppStore extends BaseStore<AppStoreProps> {
  constructor() {
    super(appStore);
  }
  rememberMe() {
    return this.get().rememberMe ?? false;
  }

  clientId() {
    return this.get().clientId;
  }

  setRememberMe(value: boolean) {
    this.patch({
      rememberMe: value,
    });
  }
}
