import {
  AuthBaseStore,
  CacBaseProviderConfig,
  DATEFNS_PERSIAN_DATE_FORMATS, DIALOG_INVOKER_CONFIG,
  ICON_COMPONENT_CONFIG,
  provide, TABLE_COMPONENT_CONFIG
} from '@controladad/ng-base';
import { AuthStore } from './states/auth.store';
import { faIR } from 'date-fns-jalali/locale';
import localeFa from '@angular/common/locales/fa';

export const cacProviders = () => [
  provide(ICON_COMPONENT_CONFIG, {
      size: '2rem',
      strokeWidth: 1.5,
      wrapperClass: 'rounded-full'
    }),
  provide(DIALOG_INVOKER_CONFIG, {
    backdropBlur: 'xl',
    panelClass: ['rounded-full']
  }),
  provide(TABLE_COMPONENT_CONFIG, {
    print: true,
  }),
  { provide: AuthBaseStore, useClass: AuthStore }
]

export function cacConfig(): CacBaseProviderConfig {
  return {
      config: {
        applicationName: 'lib_playground',
        states: {
          // @ts-ignore
          auth: AuthStore,
        }
      },
      localization: {
        langs: ['en', 'fa'],
        localesPath: '/locales/',
        localesData: {
          'fa': {
            dateLocale: faIR,
            dateFormats: DATEFNS_PERSIAN_DATE_FORMATS,
            localeData: localeFa
          }
        }
      }
    }
}
