import type { ItemToId } from '../interfaces';

export function clone<T>(o: T) {
  return structuredClone(o);
}

export const objectToId: ItemToId<any> = (t) => ('id' in t ? t.id : typeof t === 'object' ? Object.values(t).at(0) : t);

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  keys.forEach((key) => delete obj[key]);
  return obj;
}

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export function deepMerge(target: any, ...sources: any[]) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}
