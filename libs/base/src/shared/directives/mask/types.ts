import type InputMask from 'inputmask';
export declare type InputmaskOptions<T> = InputMask.Options & {
  parser?: (value: any) => T;
  formatter?: (value: any) => any;
};
