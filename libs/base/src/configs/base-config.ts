import type { AppBaseStore, AuthBaseStore, DeepPartial } from '../core';

// TODO: Assigning to states causes typescript error..?

export class CacGlobalConfig {
  // Do not change this variable manually, it's automatically updated via the provider.
  static defaultLang = 'en';

  static config = {
    applicationName: '',
    localization: {
      forceDateFns: undefined as 'jalali' | 'georgian' | undefined,
    },
    states: {
      // apply the name of application to storage keys
      applyPrefixToKeys: true,
      // Provide auth store service here
      auth: null as unknown as typeof AuthBaseStore,
      // Provide app store service here
      app: null as unknown as typeof AppBaseStore,
    },
  };

  static updateConfig(obj: DeepPartial<typeof this.config>) {
    this.config = deepMerge(this.config, obj);
  }

  static generateStoreKey(key: string) {
    return `${this.config.states.applyPrefixToKeys && this.config.applicationName.length ? `${this.config.applicationName}_` : ''}${key}`;
  }
}

function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge(target: any, ...sources: any[]) {
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
