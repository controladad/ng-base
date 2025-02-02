import {
  AuthBaseStore,
  DATEFNS_PERSIAN_DATE_FORMATS,
  DIALOG_INVOKER_CONFIG,
  ICON_COMPONENT_CONFIG,
  provide, provideCacBase,
  TABLE_COMPONENT_CONFIG
} from '@controladad/ng-base';
import { AuthStore } from './states/auth.store';
import { faIR } from 'date-fns-jalali/locale';
import localeFa from '@angular/common/locales/fa';

export const provideCac = () => [
  provideCacBase({
    applicationName: 'lib_playground',
    localization: {
      langs: ['en', 'fa'],
      localesPath: '/locales/',
      localesData: {
        fa: {
          dateLocale: faIR,
          dateFormats: DATEFNS_PERSIAN_DATE_FORMATS,
          localeData: localeFa,
        },
      },
    },
  }),
  { provide: AuthBaseStore, useClass: AuthStore },
  provide(ICON_COMPONENT_CONFIG, {
    size: '2rem',
    strokeWidth: 1.5,
    wrapperClass: 'rounded-full',
  }),
  provide(DIALOG_INVOKER_CONFIG, {
    backdropBlur: 'xl',
    panelClass: ['rounded-full'],
  }),
  provide(TABLE_COMPONENT_CONFIG, {
    print: true,
  }),
];
