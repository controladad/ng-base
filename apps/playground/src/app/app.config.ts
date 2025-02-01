import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { IconComponentInjection, provide, provideCacBase } from '@controladad/ng-base';
import { cacConfig } from './cac.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideCacBase(cacConfig),

    provide(IconComponentInjection, {
      size: '2rem',
      strokeWidth: 1.5,
      wrapperClass: 'rounded-full'
    })
  ],
};
