import { inject, InjectionToken } from '@angular/core';

// multi is enabled by default
export function provide<T>(token: InjectionToken<T>, value: T | (() => T), multi = true) {
  if (typeof value === 'function') {
    return { provide: token, useFactory: value, multi };
  } else {
    return { provide: token, useValue: value, multi };
  }
}

export function componentWithDefaults<T>(component: any, token: InjectionToken<T>, defaultValues: Partial<T> = {}) {
  const values = inject(token) as T[];
  let defaults = {
    ...defaultValues
  };
  for(const val of values) {
    defaults = {
      ...defaults,
      ...val,
    }
  }

  for (const key in defaults) {
    // @ts-ignore
    component[key] = defaults[key];
  }
}
