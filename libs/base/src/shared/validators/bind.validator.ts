import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorBind(controller: AbstractControl): ValidatorFn {
  return (): ValidationErrors | null => {
    return controller.invalid ? { bind: true } : null;
  };
}
