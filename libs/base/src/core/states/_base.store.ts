import { createStore, Store, withProps } from '@ngneat/elf';
import { toSignal } from '@angular/core/rxjs-interop';
import { localStorageStrategy, persistState, StateStorage } from '@ngneat/elf-persist-state';
import { CacGlobalConfig } from '../../configs';
import { Signal } from '@angular/core';

export class BaseStore<T extends object> {
  public state$;
  public signal!: Signal<T | undefined>;
  public store: Store<any, T>;

  constructor(public storeOpts: {
    key: string;
    // ignore mutations in key such as applying application as prefix (mutations can be controlled from Global Config)
    exactKey?: boolean;
    default?: T;
    // defaults to localStorage
    storageStrategy?: StateStorage;
  }) {
    const key = storeOpts.exactKey ? storeOpts.key : CacGlobalConfig.generateStoreKey(storeOpts.key);
    const store = createStore({ name: key }, withProps<T>(storeOpts.default ?? {} as never));
    persistState(store, {
      key: key,
      storage: storeOpts.storageStrategy ?? localStorageStrategy,
    });

    this.store = store;
    this.state$ = this.store.pipe();

    try {
      this.signal = toSignal(this.state$);
    } catch { /* empty */ }
  }

  get state() {
    return this.get();
  }

  get() {
    return this.store.getValue();
  }

  patch(value: Partial<T>) {
    return this.store.update((s) => ({
      ...s,
      ...value,
    }));
  }
}
