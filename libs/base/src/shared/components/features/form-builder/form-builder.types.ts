import type { FieldAppearanceType, FieldControlType, FieldFloatLabelType, FieldInputType, FieldMaskType } from '../../ui';
import type { ItemRecords$ } from '../../../../core';
import type { Observable, Subscription } from 'rxjs';
import type { Signal } from '@angular/core';
import type { FormControlExtended } from '../../../forms';

export type FormBuilderInputType = FieldControlType | 'radio' | 'switch' | 'checkbox' | 'plate' | 'datetime';

export interface FormBuilderInputOption<T> {
  control: FormControlExtended<T>;
  // It will make the input invisible but not disabled
  invisible?: boolean;
  // It will make the input hidden, dus its also disabled
  hidden?: boolean;
  label?: string;
  colspan?: number;
  floatLabel?: 'auto' | 'always';
  appearance?: FieldAppearanceType;
  type?: FormBuilderInputType;
  inputType?: FieldInputType;
  placeholder?: string;
  items?: ItemRecords$<any>;
  mask?: FieldMaskType;
  prefixIcon?: string;
  suffixIcon?: string;
  suffix?: string;
  class?: string;
  hideError?: boolean;
  clearable?: boolean;
  autocomplete?: boolean | string;

  categories?: ItemRecords$<any>;
  showIcons?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  optional?: boolean;
  rows?: number;
  menuClass?: string;

  //
  hidden$?: Observable<boolean>;
  class$?: Observable<string>;
  disabled$?: Observable<boolean>;
}

export interface FormBuilderOptions<T> {
  width?: string;
  cols?: number;
  gap?: string;
  allowAutocomplete?: boolean;
  defaults?: {
    colspan?: number;
    clearable?: boolean;
    appearance?: FieldAppearanceType;
    floatLabel?: 'auto' | 'always';
    hideError?: boolean;
  };
  inputs: { [key in keyof T]: FormBuilderInputOption<T[key]> };
  values?: FormBuilderValue<T>;

  // By returning a subscription or observable, it will be automatically unsubscribed after component's destroy event
  onInit?: (
    controls: { [key in keyof T]: FormControlExtended<T[key]> },
    opts: FormBuilderOptions<T>,
  ) => void | Observable<any> | Subscription;
  // By returning a subscription or observable, it will be automatically unsubscribed after component's destroy event
  onAfterInit?: (
    controls: { [key in keyof T]: FormControlExtended<T[key]> },
    opts: FormBuilderOptions<T>,
  ) => void | Observable<any> | Subscription;
}

export type FormBuilderValue<T> = { [key in keyof T]?: T[key] | undefined };

export type FormBuilderInputItem<T> = FormBuilderInputOption<T> & {
  key: string;
  appearance: FieldAppearanceType;
  floatLabel: FieldFloatLabelType | undefined;
  class$Value: Signal<string | undefined>;
  hidden$Value: Signal<boolean | undefined>;
  styles$Value: Signal<any | undefined>;
};
