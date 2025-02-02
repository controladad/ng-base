import { inject, InjectionToken } from '@angular/core';

export function provide<T>(token: InjectionToken<T>, value: T | (() => T), multi = false) {
  if (typeof value === 'function') {
    return { provide: token, useFactory: value, multi };
  } else {
    return { provide: token, useValue: value, multi };
  }
}

export function componentWithDefaultConfig<T>(component: any, token: InjectionToken<T>, defaultValues: Partial<T> = {}) {
  const valuesInjected = inject(token) as T[] | T;
  const values = valuesInjected instanceof Array ? valuesInjected : [valuesInjected];

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
