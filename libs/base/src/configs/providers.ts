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
import { registerIcons } from './icons';
import { CacBase } from './base-config';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { loadTranslations } from '@angular/localize';
import { enUS } from 'date-fns/locale';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';

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

interface CacBaseProviderConfigLocalization {
  // array of supported languages, the first index will be selected as default.
  //
  // Default Value: ['en']
  langs?: string[];
  localesPath?: string;
  localesData?: { [p: string]: { dateLocale?: any; dateFormats?: any; localeData?: any } };
}

export interface CacBaseProviderConfig {
  config?: Partial<typeof CacBase.config>;

  initializeFn?: () => void;
  interceptorOnly?: boolean;
  providersOnly?: boolean;
  environment?: any;

  localization?: CacBaseProviderConfigLocalization;

  // if a string is provided, it will obtain by key from environment.
  //
  // Default Value: "prod" || "production"
  isProd?: string | boolean;

  // if a string is provided, it will obtain by key from environment.
  //
  // Default Value: "apiBaseUrl"
  apiBaseUrl?: string | { fn: Function; deps?: any[] };
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
      : (env['prod'] ?? env['production'])) ?? false;

  const langs = config?.localization?.langs ?? ['en'];
  const currentLang = localStorage.getItem('lang') ?? langs[0];
  const currentData = {
    dateLocale: enUS,
    // dateFormats: DateF,
    localeData: localeEn,
    ...config?.localization?.localesData?.[currentLang],
  };
  localStorage.setItem('lang', currentLang);

  CacBase.updateConfig(config?.config ?? {});

  if (currentData.dateLocale) {
    providers.push({ provide: MAT_DATE_LOCALE, useValue: currentData.dateLocale });
  }
  if (currentData.dateFormats) {
    providers.push({ provide: MAT_DATE_FORMATS, useValue: currentData.dateFormats });
  }
  if (currentData.localeData) {
    registerLocaleData(currentData.localeData);
  }

  if (!config?.interceptorOnly) {
    providers = [
      provideAnimations(),
      provideAppInitializer(async () => {
        config?.initializeFn?.();
        setupGlobalServices();
        setupProdMode(isProd);
        registerIcons();

        if (config?.localization?.localesPath && currentLang !== 'en') {
          const path = `${!config.localization?.localesPath.startsWith('/') ? '/' : ''}${config.localization?.localesPath}${!config.localization?.localesPath.endsWith('/') ? '/' : ''}`;
          const json = await fetch(`${path}${currentLang}.json`)
            .then((r) => r.json())
            .catch((e) => console.error(`Failed to load translations`, e));
          loadTranslations(json.translations);
          $localize.locale = currentLang;
        }

        // const roleApi = inject(RoleApiService)
        // firstValueFrom(roleApi.fetchPermissions())
      }),
      importProvidersFrom(HttpClientModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule),

      {
        provide: DateAdapter,
        useClass: currentLang === 'fa' ? DatefnsJalaliDateAdapter : DateFnsAdapter,
        deps: [MAT_DATE_LOCALE],
      },
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
