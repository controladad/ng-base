import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { importProvidersFrom, provideAppInitializer, Provider } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApiInterceptor,
  TokenInterceptor,
  ErrorInterceptor,
  DATEFNS_PERSIAN_DATE_FORMATS,
  DatefnsJalaliDateAdapter,
} from '../core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { API_BASEURL, ENVIRONMENT } from './tokens';
import { faIR } from 'date-fns-jalali/locale';
import { setupGlobalServices, setupProdMode } from './globals';

export const provideEnvironment = (env: any) => ({ provide: ENVIRONMENT, useValue: env } as Provider);

// factory should return a string
export const provideApiBaseUrl = (urlFn: Function, deps?: any[]) =>
  ({
    provide: API_BASEURL,
    useFactory: urlFn,
    deps,
  } as Provider);

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

export interface CacBaseProviderConfig {
  initializeFn?: () => void;
  interceptorOnly?: boolean;
  providersOnly?: boolean;
  environment?: any;

  // if a string is provided, it will obtain by key from environment
  //
  // Default Value: "prod" || "production"
  isProd?: string | boolean;

  // if a string is provided, it will obtain by key from environment
  //
  // Default Value: "apiBaseUrl"
  apiBaseUrl?: string | { fn: Function; deps?: any[] };

  date?: {
    locale?: any;
    formats?: any;
    adapter?: any;
  };
}

export const provideCacBase = (configOrFn?: CacBaseProviderConfig | (() => CacBaseProviderConfig)) => {
  let providers: Provider[] = [];
  let interceptors: Provider[] = [];
  const additional: Provider[] = [];

  const config = typeof configOrFn === 'function' ? configOrFn() : configOrFn;
  const env = config?.environment ?? {};
  const isProd: boolean =
    (config?.isProd !== undefined
      ? typeof config.isProd === 'boolean'
        ? config.isProd
        : env[config.isProd]
      : env['prod'] ?? env['production']) ?? false;

  if (!config?.interceptorOnly) {
    providers = [
      provideAnimations(),
      provideAppInitializer(() => {
        config?.initializeFn?.();
        setupGlobalServices();
        setupProdMode(isProd);
        // const roleApi = inject(RoleApiService)
        // firstValueFrom(roleApi.fetchPermissions())
      }),
      importProvidersFrom(HttpClientModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule),

      { provide: MAT_DATE_LOCALE, useValue: config?.date?.locale || faIR },
      { provide: MAT_DATE_FORMATS, useValue: config?.date?.formats || DATEFNS_PERSIAN_DATE_FORMATS },
      { provide: DateAdapter, useClass: config?.date?.adapter || DatefnsJalaliDateAdapter, deps: [MAT_DATE_LOCALE] },
    ] as Provider[];
  }

  if (!config?.providersOnly) {
    interceptors = [provideApiInterceptor(), provideTokenInterceptor(), provideErrorInterceptor()];
  }

  additional.push(provideEnvironment(env));

  if (config?.apiBaseUrl && typeof config.apiBaseUrl === 'object') {
    additional.push(provideApiBaseUrl(config?.apiBaseUrl?.fn, config?.apiBaseUrl?.deps));
  } else {
    const key = (config?.apiBaseUrl as string) ?? 'apiBaseUrl';
    const value = env[key] ?? '';
    additional.push(provideApiBaseUrl(() => value));
  }

  return [...providers, ...interceptors, ...additional];
};
