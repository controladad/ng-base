import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidatorNumber } from './number.validator';

export function ValidatorCodeMelli(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return ValidatorNumber(10, 10)(control) !== null ? { codeMelli: { value: control.value } } : null;
  };
}
