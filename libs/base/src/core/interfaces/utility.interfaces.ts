import type { Observable } from 'rxjs';

export interface ItemRecord<T, U = unknown> {
  label: string;
  value: T;
  // Alt is used as an alternative to value. eg: item is refereed to as an index and name.
  alt?: U;
  icon?: string;
  disabled?: boolean;
  permission?: string;
  category?: number | string;
  // is used for searching and filtering (in addition to label)
  additionalData?: string;
}

export type ItemRecords$<T, U = unknown> = Observable<ItemRecord<T, U>[] | undefined> | ItemRecord<T, U>[];

export type ItemToId<T> = (item: T) => string | number;

export type Class = { new (...args: any[]): any };

// Converts T[] type to T
export type Singleton<T> = T extends any[] ? T[number] : T;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type BlobNamed = Blob & { name?: string };
