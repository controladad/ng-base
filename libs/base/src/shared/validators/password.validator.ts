import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegexPassword } from '../../core';

export function ValidatorPassword(): ValidatorFn {
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
