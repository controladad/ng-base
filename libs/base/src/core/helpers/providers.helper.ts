import { inject, InjectionToken } from '@angular/core';

function isClass(obj: any) {
  const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
  if (obj.prototype === undefined) {
    return isCtorClass;
  }
  const isPrototypeCtorClass =
    obj.prototype.constructor &&
    obj.prototype.constructor.toString &&
    obj.prototype.constructor.toString().substring(0, 5) === 'class';
  return isCtorClass || isPrototypeCtorClass;
}

export function provide<T>(token: InjectionToken<T>, value: T | (() => T), multi = false) {
  // @ts-ignore
  if (typeof value === 'function') {
    return { provide: token, useFactory: value, multi };
  } else if (isClass(value)) {
    return { provide: token, useClass: value, multi };
  } else {
    return { provide: token, useValue: value, multi };
  }
}

export function componentWithDefaultConfig<T>(
  component: any,
  token: InjectionToken<T>,
  defaultValues: Partial<T> = {},
) {
  let valuesInjected: T[] | T;
  try {
    valuesInjected = inject(token);
  } catch {
    return;
  }

  const values = valuesInjected instanceof Array ? valuesInjected : [valuesInjected];

  let defaults = {
    ...defaultValues,
  };
  for (const val of values) {
    defaults = {
      ...defaults,
      ...val,
    };
  }

  for (const key in defaults) {
    // @ts-ignore
    component[key] = defaults[key];
  }
}
