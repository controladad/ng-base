import { deepMerge } from '../core';
import { DialogExtendedConfig } from '../shared';

export class CacBase {
  static config = {
    components: {
      dialog: {
        defaults: {
          panelClass: ['ui-dialog-default-panel'],
          autoFocus: true,
        } as DialogExtendedConfig<any>
      },
      icon: {
        strokeWidth: 1.9,
      }
    },
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
