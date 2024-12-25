import { Store } from '@ngneat/elf';
import { toSignal } from '@angular/core/rxjs-interop';

export class BaseStore<T extends object> {
  public state$;
  public signal;

  constructor(public store: Store<any, T>) {
    this.state$ = this.store.pipe();
    this.signal = toSignal(this.state$);
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
