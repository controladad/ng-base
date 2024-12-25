import { InjectionToken } from '@angular/core';

export class InputMaskConfig {
  /**
   * If set true, MutationObserver will be used to look for changes until it finds input with inputSelector
   */
  isAsync: boolean;

  /**
   * CSS like selector, which will be used with `querySelector` to get the native input.
   * If your input is loaded lazily, please use `isAsync` option with this
   */
  inputSelector: string;

  constructor() {
    this.isAsync = false;
    this.inputSelector = 'input';
  }
}

export const INPUT_MASK_CONFIG: InjectionToken<InputMaskConfig> = new InjectionToken('InputMaskConfig');
