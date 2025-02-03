import { AbstractControl } from '@angular/forms';

const CONTROL_ERROR = {
  required: $localize`:@@base.errors.control.required:This Field Is Required.`,
  email: $localize`:@@base.errors.control.email:Email Format Is Incorrect.`,
  codeMelli: $localize`:@@base.errors.control.nationalCode:National Code Format Is Incorrect.`,
  unmatched: $localize`:@@base.errors.control.unmatched:This Field Does Not Match.`,
  passwordLength: $localize`:@@base.errors.control.passwordLength:Password Should Be 8 Characters Or More`,
  passwordChars: $localize`:@@base.errors.control.passwordChars:Password Should Contain Both Numbers And Letters.`,
  default: $localize`:@@base.errors.control.default:This Field Is Incorrect.`,
} as const;

export function getControlErrorMessage(control: AbstractControl, customMessage?: string) {
  if (control.status !== 'INVALID') return undefined;
  if (customMessage) {
    return customMessage;
  }
  const errorKeys = Object.keys(control.errors ?? {});
  const firstKey = errorKeys.length > 0 ? errorKeys[0] : undefined;

  let error: string | undefined;
  if (firstKey) {
    error = CONTROL_ERROR[firstKey as never];
    if (!error) {
      error = !customMessage ? CONTROL_ERROR.default : customMessage;
    }
  }
  return error;
}
