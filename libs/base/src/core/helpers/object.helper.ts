import type { ItemToId } from '../interfaces';

export const ObjectHelper = {
  objectToId: ((t) => ('id' in t ? t.id : typeof t === 'object' ? Object.values(t).at(0) : t)) as ItemToId<any>,
  clone<T>(o: T) {
    return structuredClone(o);
  },
  omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
    keys.forEach((key) => delete obj[key]);
    return obj;
  },
  isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  },
  deepMerge(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  },
};
