import Inputmask from 'inputmask';
export declare type InputmaskOptions<T> = Inputmask.Options & {
  parser?: (value: any) => T;
  formatter?: (value: any) => any;
};
