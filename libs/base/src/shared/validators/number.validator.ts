import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorNumber(minLength = 0, maxLength?: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control?.value?.toString() ?? '';
    const regex = new RegExp(`\\b(\\d){${minLength},${maxLength ?? ''}}\\b`);
    return !regex.test(value) ? { number: { value: control.value } } : null;
  };
}
