import { deepMerge, DeepPartial } from '../core';
import type {
  DialogExtendedConfig,
  TableOptions,
} from '../shared';

export class CacBase {
  // Do not change this variable manually, it's automatically updated via the provider.
  static defaultLang = 'en';

  static config = {
    applicationName: '',
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
    states: {
      // apply the name of application to storage keys
      applyPrefixToKeys: true,
      // Provide auth store service here
      auth: null as any,
      // Provide app store service here
      app: null as any,
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

  static updateConfig(obj: DeepPartial<typeof this.config>) {
    this.config = deepMerge(this.config, obj);
  }

  static generateStoreKey(key: string) {
    return `${this.config.states.applyPrefixToKeys && this.config.applicationName.length ? `${this.config.applicationName}_` : ''}${key}`;
  }
}
