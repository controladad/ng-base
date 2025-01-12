import { FormBuilderInputOption, FormBuilderOptions } from './form-builder.types';
import { clone } from '../../../../core';
import { computed, signal } from '@angular/core';
import { FormControlExtended, formGroup } from '../../../forms';

type FormBuilderTransformer<T, U> = (value: T, raw: T) => U;

// this function acts as a type infer for typescript, using this function is optional
export function formBuilder<T, U = T>(
  options: FormBuilderOptions<T>,
  transformer?: FormBuilderTransformer<T, U>,
): FormBuilder<T, U> {
  return new FormBuilder<T, U>(options, transformer);
}

export class FormBuilder<T, U = T> implements FormBuilderOptions<T> {
  cols = 1;
  width = '100%';
  gap = '0.75rem 2rem';
  allowAutocomplete = false;
  defaults: FormBuilderOptions<T>['defaults'] = {
    colspan: 1,
    clearable: true,
    appearance: 'outlined',
    hideError: false,
  };
  inputs: { [key in keyof T]: FormBuilderInputOption<T[key]> } = {} as any;

  formGroup = formGroup<any>({});
  keys: string[] = [];

  controls!: { [p in keyof T]: FormControlExtended<T[p]> };

  hiddenKeysArray = signal<(keyof T)[]>([]);
  hiddenKeys = computed(() =>
    this.hiddenKeysArray().reduce(
      (pre, cur) => {
        pre[cur] = true;
        return pre;
      },
      {} as { [key in keyof T]: boolean },
    ),
  );

  invisibleKeysArray = signal<(keyof T)[]>([]);
  invisibleKeys = computed(() =>
    this.invisibleKeysArray().reduce(
      (pre, cur) => {
        pre[cur] = true;
        return pre;
      },
      {} as { [key in keyof T]: boolean },
    ),
  );

  private _onInit: FormBuilderOptions<T>['onInit'] = undefined;
  private _onAfterInit: FormBuilderOptions<T>['onAfterInit'] = undefined;
  private _values: FormBuilderOptions<T>['values'] = undefined;
  private _initialValues?: T;
  private _transfomer?: (v: T, raw: T) => U;

  constructor(opts: FormBuilderOptions<T>, transformer?: FormBuilderTransformer<T, U>) {
    this.cols = opts.cols ?? this.cols;
    this.gap = opts.gap ?? this.gap;
    this.width = opts.width ?? this.width;
    this.allowAutocomplete = opts.allowAutocomplete !== undefined ? opts.allowAutocomplete : this.allowAutocomplete;
    this.inputs = opts.inputs ?? this.inputs;
    this._values = opts.values ?? this._values;
    this._onInit = opts.onInit ?? this._onInit;
    this._onAfterInit = opts.onAfterInit ?? this._onAfterInit;
    this._transfomer = transformer;
    this.defaults = {
      ...this.defaults,
      ...opts.defaults,
    };

    this.updateFormGroup();
  }

  private updateFormGroup() {
    this.keys = Object.keys(this.inputs);
    const inputOptions: FormBuilderInputOption<T>[] = Object.values(this.inputs);

    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i];
      const option = inputOptions[i];
      if (this.formGroup.contains(key)) {
        this.formGroup.removeControl(key);
      }
      this.formGroup.addControl(key, option.control);

      if (option.invisible) {
        this.setInvisible(true, key as keyof T);
      }
      if (option.hidden) {
        this.setHidden(true, key as keyof T);
      }
    }

    this._initialValues = this.formGroup.getRawValue();

    if (this._values) {
      this.formGroup.patchValue(this._values);
    }

    this.controls = this.formGroup.controls as any;
  }

  validate() {
    if (this.formGroup.status === 'DISABLED') return true;
    this.formGroup.markAllAsTouched();
    return this.formGroup.valid;
  }

  getValue(): U | null {
    if (!this.validate()) return null;

    const value = this.formGroup.value;
    const raw = this.formGroup.getRawValue();

    return this._transfomer ? this._transfomer(value, raw) : value;
  }

  setValue(value: T) {
    this.formGroup.reset();
    this.formGroup.patchValue(value as never);
  }

  patchValue(value: Partial<T>) {
    this.formGroup.patchValue(value);
  }

  reset(value?: any) {
    this.formGroup.reset(value ?? this._initialValues ?? undefined);
    this._values = value;
  }

  invokeInit() {
    if (this._onInit) {
      return this._onInit(this.formGroup.controls as any, this);
    }
  }

  invokeAfterInit() {
    if (this._onAfterInit) {
      return this._onAfterInit(this.formGroup.controls as any, this);
    }
  }

  clone(values?: any): FormBuilder<T, U> {
    const cloned = new FormBuilder<T, U>(
      {
        ...this,
        values: clone(this._values),
      },
      this._transfomer,
    );
    cloned.reset(values);
    return cloned;
  }

  setReadonly(state: boolean, ...keys: (keyof T)[]) {
    this.forEachControl(
      (control) => {
        control.setReadonly(state);
      },
      ...keys,
    );
  }

  get values() {
    return this._values;
  }

  updateInput(key: keyof T, options: Partial<FormBuilderInputOption<T>>) {
    const current = this.inputs[key];
    this.inputs[key] = {
      ...current,
      ...options,
    };
  }

  hide(...keys: (keyof T)[]) {
    this.setHidden(true, ...keys);
  }
  show(...keys: (keyof T)[]) {
    this.setHidden(false, ...keys);
  }

  setHidden(state: boolean, ...keys: (keyof T)[]) {
    const current = this.hiddenKeysArray();

    for (const key of keys) {
      const index = current.indexOf(key);

      if (state && index === -1) {
        current.push(key);
        this.inputs[key].control.setDisabled(true);
      } else if (!state && index !== -1) {
        current.splice(index, 1);
        this.inputs[key].control.setDisabled(false);
      }
    }
    this.hiddenKeysArray.set(current);
  }

  setInvisible(state: boolean, ...keys: (keyof T)[]) {
    const current = this.invisibleKeysArray();

    for (const key of keys) {
      const index = current.indexOf(key);

      if (state && index === -1) {
        current.push(key);
      } else if (!state && index !== -1) {
        current.splice(index, 1);
      }
    }
    this.invisibleKeysArray.set(current);
  }

  setDisabled(state: boolean, ...keys: (keyof T)[]) {
    this.forEachControl(
      (control) => {
        control.setDisabled(state);
      },
      ...keys,
    );
  }

  private forEachControl(fn: (control: FormControlExtended) => void, ...keys: (keyof T)[]) {
    for (const [key, input] of Object.entries(this.inputs)) {
      if (keys.length && !keys.includes(key as never)) continue;
      fn((input as FormBuilderInputOption<any>).control);
    }
  }
}
