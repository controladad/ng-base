import { localStorageStrategy, sessionStorageStrategy, StateStorage } from '@ngneat/elf-persist-state';
import { getStore } from '@ngneat/elf';

function storage() {
  // We are directly accessing the store to prevent circular dependencies
  const store = getStore<any>('app');
  const rememberMe = store?.getValue().rememberMe ?? false;
  if (rememberMe) {
    return localStorageStrategy;
  } else {
    return sessionStorageStrategy;
  }
}

export const StorageEngine: StateStorage = {
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
