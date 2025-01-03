import { AbstractControl, ValidationErrors, ValidatorFn, Validators as AngularValidators } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';
import { RegexIP, RegexPassword } from '../../core';
import { CacBase } from '../../configs';

// @ts-ignore
export class Validators extends AngularValidators {
  static nationalCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.number(CacBase.config.validators.nationalCode.min, CacBase.config.validators.nationalCode.max)(control) !== null ? { codeMelli: { value: control.value } } : null;
    };
  }

  static clone(controller: AbstractControl): ValidatorFn {
    return (): ValidationErrors | null => {
      return controller.invalid ? { clone: true } : null;
    };
  }

  static ip(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value?.toString() ?? '';
      return !RegexIP.test(value) ? { ip: { value: control.value } } : null;
    };
  }

  static alphabet(lang?: 'en'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value?.toString() ?? '';
      const regex = new RegExp(
        lang === 'en' ? '^[A-Za-z0-9\\s!@#$%^&*()_+={}\\[\\]:;"\'<>,.?/\\\\|-]+$' : /^(\p{L}|\p{N}|\p{S}|\s)+$/u,
      );
      return !regex.test(value) ? { alphabet: { value: control.value } } : null;
    };
  }

  static match(secondControl: AbstractControl): ValidatorFn {
    let sub = new Subscription();
    return (control: AbstractControl): ValidationErrors | null => {
      sub.unsubscribe();
      sub = secondControl.valueChanges.pipe(take(1), debounceTime(100)).subscribe(() => {
        control.updateValueAndValidity();
      });
      const v1 = secondControl?.value ?? '';
      const v2 = control?.value ?? '';
      return v1 !== v2 ? { unmatched: { value: control.value } } : null;
    };
  }

  static number(minLength = 0, maxLength?: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value?.toString() ?? '';
      const regex = new RegExp(`\\b(\\d){${minLength},${maxLength ?? ''}}\\b`);
      return !regex.test(value) ? { number: { value: control.value } } : null;
    };
  }

  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value ?? '';
      if (!value || value === '') return null;

      const tested = new RegExp(RegexPassword, 'gm').test(value);
      const length = (value.length ?? 0) >= CacBase.config.validators.password.min;
      return !tested
        ? { passwordChars: { value: control.value } }
        : !length
        ? { passwordLength: { value: control.value } }
        : null;
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.number(CacBase.config.validators.phone.min, CacBase.config.validators.phone.max)(control) !== null
        ? { phoneNumber: { value: control.value } }
        : null;
    };
  }

  static requiredNullable(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isEmpty =
        value === undefined || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
      return isEmpty ? { required: true } : null;
    };
  }
}
