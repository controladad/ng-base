import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidatorNumber } from './number.validator';

export function ValidatorPhoneNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return ValidatorNumber(11, 11)(control) !== null ? { phoneNumber: { value: control.value } } : null;
  };
}
