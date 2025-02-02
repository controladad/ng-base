import { AbstractControl, Validators as AngularValidators } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';
import { inject, InjectionToken } from '@angular/core';

const RegexIP = new RegExp(`^((25[0-5]|(2[0-4]|1\\d|[1-9]|)\\d)\\.?\\b){4}$`);
const RegexPassword = new RegExp(`^(?=.*\\d)(?=.*[A-Za-z])(?=.*[a-zA-Z]).*$`);

const VALIDATORS_DEFAULTS = {
  phone: {
    min: 11,
    max: 11,
  },
  nationalCode: {
    min: 10,
    max: 10,
  },
  password: {
    regex: RegexPassword,
    min: 8,
  },
};

export const ValidatorsConfig = new InjectionToken<Partial<typeof VALIDATORS_DEFAULTS>>('Validators');

function withDefault<T>(input: T | undefined, defaultValue: T) {
  return input !== undefined ? input : defaultValue;
}

export class Validators extends AngularValidators {
  private static config() {
    const value = inject(ValidatorsConfig);
    return {
      ...VALIDATORS_DEFAULTS,
      ...value,
    };
  }

  static nationalCode(min?: number, max?: number) {
    const config = this.config();
    const minValue = withDefault(min, config.nationalCode.min);
    const maxValue = withDefault(max, config.nationalCode.max);

    return (control: AbstractControl) => {
      return Validators.number(minValue, maxValue)(control) !== null ? { codeMelli: { value: control.value } } : null;
    };
  }

  static clone(controller: AbstractControl) {
    return () => {
      return controller.invalid ? { clone: true } : null;
    };
  }

  static ip(control: AbstractControl) {
    const value = control?.value?.toString() ?? '';
    return !RegexIP.test(value) ? { ip: { value: control.value } } : null;
  }

  static alphabet(lang?: 'en') {
    return (control: AbstractControl) => {
      const value = control?.value?.toString() ?? '';
      const regex = new RegExp(
        lang === 'en' ? '^[A-Za-z0-9\\s!@#$%^&*()_+={}\\[\\]:;"\'<>,.?/\\\\|-]+$' : /^(\p{L}|\p{N}|\p{S}|\s)+$/u,
      );
      return !regex.test(value) ? { alphabet: { value: control.value } } : null;
    };
  }

  static match(secondControl: AbstractControl) {
    let sub = new Subscription();
    return (control: AbstractControl) => {
      sub.unsubscribe();
      sub = secondControl.valueChanges.pipe(take(1), debounceTime(100)).subscribe(() => {
        control.updateValueAndValidity();
      });
      const v1 = secondControl?.value ?? '';
      const v2 = control?.value ?? '';
      return v1 !== v2 ? { unmatched: { value: control.value } } : null;
    };
  }

  static number(minLength = 0, maxLength?: number) {
    return (control: AbstractControl) => {
      const value = control?.value?.toString() ?? '';
      const regex = new RegExp(`\\b(\\d){${minLength},${maxLength ?? ''}}\\b`);
      return !regex.test(value) ? { number: { value: control.value } } : null;
    };
  }

  static password(minLength?: number, regex?: RegExp) {
    const config = this.config();
    const minValue = withDefault(minLength, config.password.min);
    const regexValue = withDefault(regex, config.password.regex);

    return (control: AbstractControl) => {
      const value = control?.value ?? '';
      if (!value || value === '') return null;

      const tested = regexValue.test(value);
      const length = (value.length ?? 0) >= minValue;
      return !tested
        ? { passwordChars: { value: control.value } }
        : !length
          ? { passwordLength: { value: control.value } }
          : null;
    };
  }

  static phone(min?: number, max?: number) {
    const config = this.config();
    const minValue = withDefault(min, config.phone.min);
    const maxValue = withDefault(max, config.phone.max);

    return (control: AbstractControl) => {
      return Validators.number(minValue, maxValue)(control) !== null ? { phoneNumber: { value: control.value } } : null;
    };
  }

  static requiredNullable(control: AbstractControl) {
    const value = control.value;
    const isEmpty = value === undefined || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
    return isEmpty ? { required: true } : null;
  }
}
