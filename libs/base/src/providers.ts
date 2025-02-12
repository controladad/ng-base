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
  DatefnsJalaliDateAdapter, AppBaseStore
} from './core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CacGlobalConfig, API_BASEURL, registerIcons, ENVIRONMENT } from './configs';
import { setupGlobalServices, setupProdMode } from './globals';
import { DateFnsAdapter } from '@angular/material-date-fns-adapter';
import { loadTranslations } from '@angular/localize';
import { enUS } from 'date-fns/locale';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { getStore } from '@ngneat/elf';

// factory should return a string
export const provideApiBaseUrl = (urlFn: Function, deps?: any[]) =>
  ({
    provide: API_BASEURL,
    useFactory: urlFn,
    deps,
  }) as Provider;

export const provideEnvironment = (urlFn: Function, deps?: any[]) =>
  ({
    provide: ENVIRONMENT,
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

export interface CacBaseProviderConfig {
  initializeFn?: () => void;
  interceptorOnly?: boolean;
  providersOnly?: boolean;
  environment?: any;

  applicationName?: typeof CacGlobalConfig.applicationName;
  localization?: typeof CacGlobalConfig.localization;
  applyPrefixToStorageKeys?: typeof CacGlobalConfig.applyPrefixToStorageKeys;

  isProd?: boolean;
  apiBaseUrl?: string | { fn: Function; deps?: any[] };
}

export const provideCacBase = (configOrFn?: CacBaseProviderConfig | (() => CacBaseProviderConfig)) => {
  let providers: Provider[] = [];
  let interceptors: Provider[] = [];
  const additional: Provider[] = [];

  const config = typeof configOrFn === 'function' ? configOrFn() : configOrFn;
  const isProd = config?.isProd ?? false

  CacGlobalConfig.localization = config?.localization ?? CacGlobalConfig.localization;
  CacGlobalConfig.applicationName = config?.applicationName ?? CacGlobalConfig.applicationName;
  CacGlobalConfig.applyPrefixToStorageKeys = config?.applyPrefixToStorageKeys ?? CacGlobalConfig.applyPrefixToStorageKeys;
  CacGlobalConfig.defaultLang = CacGlobalConfig.localization.langs[0];

  const appStore = getStore<any>(CacGlobalConfig.generateStoreKey('app')) ?? new AppBaseStore().store;

  let currentLang = appStore?.getValue()?.lang as string | undefined;
  if (!currentLang || !CacGlobalConfig.localization.langs.includes(currentLang)) {
    currentLang = CacGlobalConfig.defaultLang;
  }

  const currentData = {
    dateLocale: enUS,
    // dateFormats: DateF,
    localeData: localeEn,
    ...CacGlobalConfig.localization.localesData?.[currentLang],
  };
  appStore?.update((v) => ({
    ...v,
    lang: currentLang
  }))

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
          document.documentElement.lang = currentLang;
          document.documentElement.dir = json.rtl ? 'rtl' : 'ltr';
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

  if (config?.environment) {
    additional.push(provideEnvironment(() => config.environment));
  }

  if (config?.apiBaseUrl && typeof config.apiBaseUrl === 'object') {
    additional.push(provideApiBaseUrl(config?.apiBaseUrl?.fn, config?.apiBaseUrl?.deps));
  } else {
    additional.push(provideApiBaseUrl(() => config?.apiBaseUrl));
  }

  return [...providers, ...interceptors, ...additional];
};
