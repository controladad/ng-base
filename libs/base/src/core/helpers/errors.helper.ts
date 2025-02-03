import { APIError } from '../models';

const SERVER_ERROR = {
  0: $localize`:@@base.errors.server.0:Error connecting, Check your network connection.`,
  401: $localize`:@@base.errors.server.401:Your session has expired, please login again.`,
  403: $localize`:@@base.errors.server.403:You do not have permission to continue.`,
  404: $localize`:@@base.errors.server.404:The requested destination was not found.`,
  500: $localize`:@@base.errors.server.500:An error occurred on the server.`,
  503: $localize`:@@base.errors.server.503:The server is unavailable.`,
  default: $localize`:@@base.errors.server.default:Error.`,
} as const;

const API_ERROR = {
  1: $localize`:@@base.errors.api.default:Username or Password is incorrect`,
} as const;

export class ErrorHelper {

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
      if ('error' in error && typeof error.error === 'string') {
        return error.error;
      }
      if ('errors' in error && typeof error.errors === 'object') {
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
