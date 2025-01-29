import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { DATEFNS_PERSIAN_DATE_FORMATS, provideCacBase } from '@controladad/ng-base';
import { faIR } from 'date-fns-jalali/locale';
import localeFa from '@angular/common/locales/fa';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideCacBase({
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
    }),
  ],
};
