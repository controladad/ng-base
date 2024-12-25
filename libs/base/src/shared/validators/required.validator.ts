import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// This one has an option to only error when undefined, Angular Validators.required is strict to error for null and undefined both.
export function ValidatorRequired(nullable?: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let passed = false;
    const value = control?.value;
    if (value === null && nullable) {
      passed = true;
    } else if (value !== undefined && value !== '') {
      passed = true;
    }
    return !passed ? { required: true } : null;
  };
}
