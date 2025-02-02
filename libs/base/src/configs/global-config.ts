export interface CacBaseLocalizationConfig {
  // array of supported languages, the first index will be selected as default.
  //
  // Default Value: ['en']
  langs: string[];
  localesPath?: string;
  localesData?: { [p: string]: { dateLocale?: any; dateFormats?: any; localeData?: any } };

  forceDateFnsLib?: 'jalali' | 'georgian' | undefined,
}

export class CacGlobalConfig {
  // Do not change this variable manually, it's automatically updated via the provider.
  static defaultLang = 'en';
  static applicationName = '';
  static localization: CacBaseLocalizationConfig = {
    langs: ['en'],
  };
  // applies application name to store keys, for example if your store key is `auth`, it will become `app_name_auth`
  static applyPrefixToStorageKeys = true;

  static generateStoreKey(key: string) {
    return `${this.applyPrefixToStorageKeys && this.applicationName.length ? `${this.applicationName}_` : ''}${key}`;
  }
}
