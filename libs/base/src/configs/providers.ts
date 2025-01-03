import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, importProvidersFrom, Provider } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ApiInterceptor,
  TokenInterceptor,
  ErrorInterceptor,
  DATEFNS_PERSIAN_DATE_FORMATS,
  DatefnsJalaliDateAdapter,
  RoleApiService,
} from '../core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { API_BASEURL, ENVIRONMENT } from './tokens';
import { firstValueFrom } from 'rxjs';
import { faIR } from 'date-fns-jalali/locale';

export const provideEnvironment = (env: any) => ({ provide: ENVIRONMENT, useValue: env }) as Provider;

// factory should return a string
export const provideApiBaseUrl = (urlFn: Function, deps?: any[]) =>
  ({
    provide: API_BASEURL,
    useFactory: urlFn,
    deps,
  }) as Provider;

export const provideApiInterceptor = () => ({
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true,
});

export const provideErrorInterceptor = () => ({
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
});

export const provideTokenInterceptor = () => ({
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
});

export function initializeApp(roleApi: RoleApiService) {
  return (): Promise<any> => firstValueFrom(roleApi.fetchPermissions());
}

export const importBaseProviders = () =>
  [
    importProvidersFrom(MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule),
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [RoleApiService],
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: faIR },
    { provide: MAT_DATE_FORMATS, useValue: DATEFNS_PERSIAN_DATE_FORMATS },
    { provide: DateAdapter, useClass: DatefnsJalaliDateAdapter, deps: [MAT_DATE_LOCALE] },
  ] as Provider[];

export const importBaseInterceptorProviders = () =>
  [provideApiInterceptor(), provideTokenInterceptor(), provideErrorInterceptor()] as Provider[];
