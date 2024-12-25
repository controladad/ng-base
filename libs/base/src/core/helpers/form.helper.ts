import {
  AbstractControl,
  FormControl,
  FormControlState,
  FormControlStatus,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { BehaviorSubject, debounceTime, map, Observable, startWith, Subject, merge, combineLatest } from 'rxjs';
import { ErrorHelper } from './errors.helper';
import { ValidatorBind } from '../../shared';
import { ItemRecord, Singleton } from '../interfaces';

export interface FormControlExtended<TValue = any, Data = any> extends FormControl<TValue> {
  extended: true;

  status$: Observable<FormControlStatus>;
  invalid$: Observable<boolean>;
  valid$: Observable<boolean>;
  value$: Observable<TValue | undefined>;
  error$: Observable<string | undefined>;
  hasValue$: Observable<boolean>;

  selectedItems$: BehaviorSubject<ItemRecord<Singleton<TValue>>[] | undefined>;
  selectedItems: ItemRecord<Singleton<TValue>>[] | undefined;

  readonly$: BehaviorSubject<boolean>;
  readonly: boolean;

  disabled$: Observable<boolean>;
  enabled$: Observable<boolean>;
  touched$: Observable<boolean>;
  dirty$: Observable<boolean>;
  // This is determined whenever a control is touched & is invalid in order to show error in the UI
  showError$: Observable<boolean>;

  displayText$: BehaviorSubject<string | undefined>;
  displayText: string | undefined;
  displayControl: FormControl<string | undefined | null>;

  // data is being used as extra information that is carried by the formControl
  data$: BehaviorSubject<Data | undefined>;
  // data is being used as extra information that is carried by the formControl
  data: Data | undefined;

  customError?: string;

  setReadonly: (value: boolean) => FormControlExtended<TValue, Data>;
  // if value is typeof string or number, it will be set in the display text, otherwise, undefined
  setDisplayText: (value: any | undefined) => FormControlExtended<TValue>;
  setSelectedItems: (value: ItemRecord<Singleton<TValue>>[] | undefined) => FormControlExtended<TValue, Data>;
  setCustomError: (value: string | undefined) => FormControlExtended<TValue, Data>;
  setDisabled: (value: boolean) => FormControlExtended<TValue, Data>;
  // get value if valid, else, return null
  getValue: () => TValue | null;
  // data is being used as extra information that is carried by the formControl
  setData: (value: Data | undefined) => FormControlExtended<TValue, Data>;
  emitStatus: () => void;
}

export function formControl<T, D = any>(
  value?: FormControlState<T> | T | null,
  validators?: ValidatorFn | ValidatorFn[],
  nullable = true,
) {
  const control = new FormControl(value, {
    validators: validators,
    nonNullable: nullable,
  }) as FormControlExtended<T, D>;

  const statusTrigger = new Subject<FormControlStatus>();
  const disableTrigger = new BehaviorSubject<boolean>(control.disabled);
  const dirtyTrigger = new BehaviorSubject<boolean>(control.dirty);
  const touchedTrigger = new BehaviorSubject<boolean>(control.touched);
  const valueSubject = new BehaviorSubject<T | undefined>(control.value);
  const subControls: AbstractControl[] = [];

  // Extended new properties!

  control.extended = true;

  control.status$ = merge(control.statusChanges, statusTrigger).pipe(startWith(control.status));
  control.invalid$ = control.status$.pipe(map((t) => t === 'INVALID'));
  control.valid$ = control.status$.pipe(map((t) => t === 'VALID'));
  control.value$ = valueSubject.pipe();
  control.hasValue$ = valueSubject.pipe(map((v) => v !== undefined && v !== null && v !== ''));

  control.selectedItems$ = new BehaviorSubject<any>(undefined);
  control.selectedItems = undefined;

  control.readonly$ = new BehaviorSubject(false);
  control.readonly = false;

  control.disabled$ = disableTrigger.asObservable();
  control.enabled$ = control.disabled$.pipe(map((t) => !t));
  control.dirty$ = combineLatest({ trigger: dirtyTrigger, status: control.status$ }).pipe(
    map((t) => (t.status === 'DISABLED' ? false : t.trigger)),
  );
  control.touched$ = combineLatest({ trigger: touchedTrigger, status: control.status$ }).pipe(
    map((t) => (t.status === 'DISABLED' ? false : t.trigger)),
  );
  control.showError$ = combineLatest({ invalid: control.invalid$, touched: control.touched$ }).pipe(
    map((t) => t.invalid && t.touched),
  );

  control.displayText$ = new BehaviorSubject<string | undefined>(undefined);
  control.displayText = undefined;
  control.displayControl = new FormControl<string | undefined>(undefined, [ValidatorBind(control)]);

  control.data$ = new BehaviorSubject(undefined as any);
  control.data = undefined as any;

  control.error$ = control.status$.pipe(
    debounceTime(1),
    map(() => {
      if (control.status === 'INVALID') {
        return ErrorHelper.getControlErrorMessage(control, control.customError);
      }
      return undefined;
    }),
  );
  control.customError = undefined;

  control.setReadonly = (value) => {
    control.readonly = value;
    control.readonly$.next(value);
    return control;
  };
  control.setDisplayText = (value) => {
    let newValue: string | undefined = undefined;
    if (typeof value === 'string' || typeof value === 'number') {
      newValue = typeof value === 'number' ? value.toString() : value;
    }
    control.displayText = newValue;
    control.displayText$.next(newValue);
    control.displayControl.setValue(newValue);

    return control;
  };
  control.setSelectedItems = (value) => {
    control.selectedItems = value;
    control.selectedItems$.next(value);
    return control;
  };
  control.setCustomError = (value) => {
    control.customError = value;
    return control;
  };
  control.setData = (value) => {
    control.data = value;
    control.data$.next(value);
    return control;
  };
  control.setDisabled = (value) => {
    if (value) {
      control.disable();
    } else {
      control.enable();
    }
    return control;
  };
  control.getValue = () => {
    return control.valid ? control.value : null;
  };
  control.emitStatus = () => {
    statusTrigger.next(control.status);
  };

  subControls.push(control.displayControl);

  // Override original functions

  // @ts-ignore
  // control._forEachChild = function (cb: (c: AbstractControl, index: number) => void) {
  //   subControls.forEach((control: AbstractControl, index: number) => {
  //     cb(control, index);
  //   });
  // }
  //
  // // @ts-ignore
  // const _runValidatorFn = control._runValidator
  // // @ts-ignore
  // control._runValidator = function () {
  //   const errors = _runValidatorFn.apply(this);
  //   subControls.forEach(c => {
  //     c.setErrors(errors);
  //   });
  //   return errors;
  // }

  const { setValue, patchValue, reset, disable, enable, markAsTouched, markAsUntouched, markAsDirty, markAsPristine } =
    control;

  control.setValue = function (value, options) {
    setValue.apply(this, [value, options]);
    valueSubject.next(value);
    // control.setDisplayText(value);
  };
  control.patchValue = function (value, options) {
    patchValue.apply(this, [value, options]);
    valueSubject.next(value);
    // control.setDisplayText(value);
  };
  control.reset = function (value, options) {
    reset.apply(this, [value, options]);
    valueSubject.next(value && typeof value === 'object' && 'value' in value ? value.value : value);
    control.setData(undefined);
    control.setSelectedItems(undefined);
    dirtyTrigger.next(control.dirty);
    touchedTrigger.next(control.touched);
  };
  control.disable = function (e) {
    disable.apply(this, [e]);
    disableTrigger.next(true);
  };
  control.enable = function (e) {
    enable.apply(this, [e]);
    disableTrigger.next(false);
  };
  control.markAsTouched = function (opts) {
    markAsTouched.apply(this, [opts]);
    touchedTrigger.next(true);
  };
  control.markAsDirty = function (opts) {
    markAsDirty.apply(this, [opts]);
    dirtyTrigger.next(true);
  };
  control.markAsUntouched = function (opts) {
    markAsUntouched.apply(this, [opts]);
    touchedTrigger.next(false);
  };
  control.markAsPristine = function (opts) {
    markAsPristine.apply(this, [opts]);
    dirtyTrigger.next(false);
  };

  // Initialize

  control.setDisplayText(value);

  return control;
}

export function isFormControlExtended(
  control: AbstractControl | FormControl | FormControlExtended,
): control is FormControlExtended {
  return 'extended' in control;
}

///
/// Form Group
///

export interface FormGroupExtended<TValue extends { [K in keyof TValue]: AbstractControl<any, any> } = any>
  extends FormGroup<TValue> {
  extended: true;

  status$: Observable<FormControlStatus>;
  invalid$: Observable<boolean>;
  valid$: Observable<boolean>;

  setReadonly: (value: boolean, ...keys: (keyof TValue)[]) => FormGroupExtended<TValue>;
}

export function formGroup<T extends { [K in keyof T]: AbstractControl<any, any> }>(inputs: T) {
  const group = new FormGroup<T>(inputs) as FormGroupExtended<T>;

  group.extended = true;
  group.status$ = merge(group.statusChanges).pipe(startWith(group.status));
  group.invalid$ = group.status$.pipe(map((t) => t === 'INVALID'));
  group.valid$ = group.status$.pipe(map((t) => t === 'VALID'));

  const forEachControl = (fn: (key: keyof T, control: AbstractControl) => void) => {
    Object.entries(group.controls).forEach(([key, control]) => fn(key as never, control));
  };

  group.setReadonly = (value, ...keys) => {
    forEachControl((key, control) => {
      if (isFormControlExtended(control) && (keys?.length ? keys.includes(key) : true)) {
        control.setReadonly(value);
      }
    });
    return group;
  };

  return group;
}

export function isFormGroupExtended(group: FormGroup | FormGroupExtended): group is FormGroupExtended {
  return 'extended' in group;
}
