import { deepMerge } from '../core';
import type {
  DialogExtendedConfig,
  TableOptions,
} from '../shared';

export class CacBase {
  static config = {
    components: {
      dialog: {
        defaults: {
          panelClass: ['ui-dialog-default-panel'],
          autoFocus: false,
        } as DialogExtendedConfig<any>,
      },
      icon: {
        strokeWidth: 1.9,
      },
      table: {
        pagination: {
          size: 10,
        },
        view: {
          title: '',
          itemName: 'آیتم',
          actionsText: 'عمليات',
        },
      } as TableOptions<any>,
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
