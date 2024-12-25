import { signal } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { DataGetRequest, DataSortDirection } from '../../core';

export class SortModel {
  private _key = signal<string | undefined>(undefined);
  private _direction = signal<DataSortDirection>('desc');
  private _changes$ = new Subject<[string | undefined, DataSortDirection]>();

  key = this._key.asReadonly();
  direction = this._direction.asReadonly();
  changes$ = this._changes$.pipe(debounceTime(50));

  constructor(key?: string, direction?: DataSortDirection) {
    this._key.set(key);
    this._direction.set(direction ?? 'desc');
  }

  setKey(sort: string | undefined) {
    this._key.set(sort);
    this.emit();
  }
  setDirection(direction: DataSortDirection) {
    this._direction.set(direction);
    this.emit();
  }

  create(): DataGetRequest['sort'] | undefined {
    const key = this.key();
    return key
      ? {
          key: key,
          direction: this.direction(),
        }
      : undefined;
  }

  private emit() {
    this._changes$.next([this._key(), this._direction()]);
  }
}
