import { AbstractControl, Validators as AngularValidators } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';
import { RegexIP, RegexPassword } from '../../core';
import { CacBase } from '../../configs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// @ts-ignore
export class Validators extends AngularValidators {
  static nationalCode(control: AbstractControl) {
    return Validators.number(
      CacBase.config.validators.nationalCode.min,
      CacBase.config.validators.nationalCode.max,
    )(control) !== null
      ? { codeMelli: { value: control.value } }
      : null;
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

  static password(regex?: RegExp, minLength?: number) {
    return (control: AbstractControl) => {
      const value = control?.value ?? '';
      if (!value || value === '') return null;

      const tested = (regex ?? new RegExp(RegexPassword, 'gm')).test(value);
      const length =
        (value.length ?? 0) >= (minLength !== undefined ? minLength : CacBase.config.validators.password.min);
      return !tested
        ? { passwordChars: { value: control.value } }
        : !length
          ? { passwordLength: { value: control.value } }
          : null;
    };
  }

  static phone(min?: number, max?: number) {
    const felan = inject(HttpClient);
    return (control: AbstractControl) => {
      return Validators.number(
        min === undefined ? CacBase.config.validators.phone.min : min,
        max === undefined ? CacBase.config.validators.phone.max : max,
      )(control) !== null
        ? { phoneNumber: { value: control.value } }
        : null;
    };
  }

  static requiredNullable(control: AbstractControl) {
    const value = control.value;
    const isEmpty = value === undefined || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
    return isEmpty ? { required: true } : null;
  }
}
