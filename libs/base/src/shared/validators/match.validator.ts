import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';

export function ValidatorMatch(secondControl: AbstractControl): ValidatorFn {
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
