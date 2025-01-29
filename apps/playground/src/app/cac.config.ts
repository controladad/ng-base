import { CacBaseProviderConfig, DATEFNS_PERSIAN_DATE_FORMATS } from '@controladad/ng-base';
import { AuthStore } from './states/auth.store';
import { faIR } from 'date-fns-jalali/locale';
import localeFa from '@angular/common/locales/fa';

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
