import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideCacBase } from '@controladad/ng-base';
import { cacConfig, cacProviders } from './cac.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideCacBase(cacConfig),
    cacProviders()
  ],
};
