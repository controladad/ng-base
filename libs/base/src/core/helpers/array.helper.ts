import { ItemRecord } from '../interfaces';

export const ArrayHelper = {
  includes<T>(array: T[], terms: T | T[]) {
    if (!(terms instanceof Array)) return array.includes(terms);
    for (const term of terms) {
      if (array.includes(term)) return true;
    }
    return false;
  },

  // index can be undefined; and it will return undefined if index is not available.
  safeAt<T>(array: T[], index: number | undefined | null): T | null {
    if (index === null || index === undefined) return null;
    return array.at(index) ?? null;
  },

  dedupe<T>(array: T[]) {
    return [...new Set(array)];
  },

  dedupeObj<T extends object>(array: T[], key: keyof T) {
    return array.filter((value, index) => index === array.findIndex((t) => t[key] === value[key]));
  },

  subset<T>(array: T[], sub: T[]) {
    return sub.every((val) => array.includes(val));
  },

  getFromItemRecord<T, U>(items: ItemRecord<T, U>[], value: T | U | undefined | null) {
    return items.find((t) => t.value === value || (t.alt !== undefined && t.alt === value));
  },

  flatten<T>(array: T[][]): T[] {
    return ([] as T[]).concat(...array);
  },

  areEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  },
};

export function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
