import { AbstractControl } from '@angular/forms';
import { APIError } from '../models';

const CONTROL_ERROR = {
  required: 'این فیلد الزامی می باشد.',
  email: 'این ایمیل درست نیست.',
  codeMelli: 'کد ملی نامعتبر است.',
  unmatched: 'مقدار این فیلد مطابقت ندارد.',
  passwordLength: 'پسورد باید ۸ کاراکتر یا بیشتر باشد.',
  passwordChars: 'پسورد باید شامل حروف و اعداد باشد.',
  default: 'مقدار این فیلد اشتباه میباشد.',
} as const;

const SERVER_ERROR = {
  0: 'اشکال در اتصال، اینترنت خود را چک کنید.',
  401: 'نشست شما منقضی شده، لطفا دوباره لاگین کنید.',
  403: 'شما دسترسی برای ادامه ندارید.',
  404: 'مقصد مورد نظر یافت نشد.',
  500: 'اشکالی در سرور رخ داده.',
  503: 'سرور غیر فعال میباشد.',
  default: 'ارور.',
} as const;

const API_ERROR = {
  1: 'نام کاربری یا رمز عبور صحیح نمیباشد',
} as const;

export class ErrorHelper {
  static getControlErrorMessage(control: AbstractControl, customMessage?: string) {
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

  static getResponseErrorMessage(serverCode: number, apiError?: APIError) {
    return serverCode === 400 && apiError ? this.getApiErrorMessage(apiError) : this.getServerErrorMessage(serverCode);
  }

  static getServerErrorMessage(status: number) {
    return SERVER_ERROR[status as never] ?? SERVER_ERROR.default;
  }

  static getApiErrorMessage(error: { code: number; message: string }) {
    return API_ERROR[error.code as never] ?? error.message;
  }

  // we pass the error object, returned by the api to this function
  static parseApiErrorObject(error: any): APIError | undefined {
    if (!error) return undefined;
    if (typeof error === 'object') {
      if ('error' in error) {
        return error.error;
      }
      if ('errors' in error) {
        const message = this.extractMessageFromObjectRecord(error.errors);
        return message
          ? {
              code: -1,
              message,
            }
          : undefined;
      }
      return error;
    } else if (typeof error === 'string') {
      try {
        return JSON.parse(error);
      } catch {
        return {
          code: -1,
          message: error,
        };
      }
    }
    return undefined;
  }

  private static extractMessageFromObjectRecord(object: any): string | undefined {
    const values = Object.values(object);
    for (const value of values) {
      if (value instanceof Array && value.length > 0) {
        return value[0];
      } else if (typeof value === 'string') {
        return value;
      }
    }
    return undefined;
  }
}
