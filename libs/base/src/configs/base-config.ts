import { deepMerge } from '../core';

export class CacBase {
  static config = {
    validators: {
      phone: {
        min: 11,
        max: 11,
      },
      nationalCode: {
        min: 10,
        max: 10,
      },
      password: {
        min: 8,
      },
    },
  };

  static updateConfig(obj: Partial<typeof this.config>) {
    this.config = deepMerge(this.config, obj);
  }
}
