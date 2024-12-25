import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegexIP } from '../../core';

export function ValidatorIP(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control?.value?.toString() ?? '';
    return !RegexIP.test(value) ? { number: { value: control.value } } : null;
  };
}
