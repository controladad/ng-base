import { AbstractControl, ValidationErrors, ValidatorFn, Validators as AngularValidators } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';
import { RegexIP, RegexPassword } from '../../core';

// @ts-ignore
export class Validators extends AngularValidators {
  static codeMelli(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.number(10, 10)(control) !== null ? { codeMelli: { value: control.value } } : null;
    };
  }

  static clone(controller: AbstractControl): ValidatorFn {
    return (): ValidationErrors | null => {
      return controller.invalid ? { bind: true } : null;
    };
  }

  static ip(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control?.value?.toString() ?? '';
      return !RegexIP.test(value) ? { number: { value: control.value } } : null;
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
      const length = (value.length ?? 0) >= 8;
      return !tested
        ? { passwordChars: { value: control.value } }
        : !length
        ? { passwordLength: { value: control.value } }
        : null;
    };
  }

  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return Validators.number(11, 11)(control) !== null ? { phoneNumber: { value: control.value } } : null;
    };
  }

  static requiredNullable(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const isEmpty =
        value === undefined ||
        ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
      return isEmpty ? { required: true } : null;
    };
  }
}
