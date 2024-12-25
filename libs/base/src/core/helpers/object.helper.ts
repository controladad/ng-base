export function clone<T>(o: T) {
  return structuredClone(o);
}

export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  keys.forEach((key) => delete obj[key]);
  return obj;
}
