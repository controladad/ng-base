import { ItemRecord } from '../interfaces';

export function getFromItemRecord<T, U>(items: ItemRecord<T, U>[], value: T | U | undefined | null) {
  return items.find((t) => t.value === value || (t.alt !== undefined && t.alt === value));
}

export function flatten<T>(array: T[][]): T[] {
  return ([] as T[]).concat(...array);
}

export function includes<T>(array: T[], terms: T | T[]) {
  if (!(terms instanceof Array)) return array.includes(terms);
  for (const term of terms) {
    if (array.includes(term)) return true;
  }
  return false;
}

export function arraySafeAt<T>(array: T[], index: number | undefined | null): T | null {
  if (index === null || index === undefined) return null;
  return array.at(index) ?? null;
}

export function dedupe<T>(array: T[]) {
  return [...new Set(array)];
}

export function dedupeObj<T extends object>(array: T[], key: keyof T) {
  return array.filter((value, index) => index === array.findIndex((t) => t[key] === value[key]));
}

export function subset<T>(array: T[], sub: T[]) {
  return sub.every((val) => array.includes(val));
}

export function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
