import { AbstractControl } from '@angular/forms';

const CONTROL_ERROR = {
  required: $localize`:@@base.errors.control.required:این فیلد الزامی می باشد.`,
  email: $localize`:@@base.errors.control.email:این ایمیل درست نیست.`,
  codeMelli: $localize`:@@base.errors.control.nationalCode:کد ملی نامعتبر است.`,
  unmatched: $localize`:@@base.errors.control.unmatched:مقدار این فیلد مطابقت ندارد.`,
  passwordLength: $localize`:@@base.errors.control.passwordLength:پسورد باید ۸ کاراکتر یا بیشتر باشد.`,
  passwordChars: $localize`:@@base.errors.control.passwordChars:پسورد باید شامل حروف و اعداد باشد.`,
  default: $localize`:@@base.errors.control.default:مقدار این فیلد اشتباه میباشد.`,
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
