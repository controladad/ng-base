import { InputmaskOptions } from './types';

export const createMask: <T>(options: string | InputmaskOptions<T>) => InputmaskOptions<T> = (options) =>
  typeof options === 'string' ? { mask: options } : options;
