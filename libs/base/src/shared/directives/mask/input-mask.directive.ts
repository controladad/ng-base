import { isPlatformServer } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  Self,
} from '@angular/core';
import { InputMaskConfig, INPUT_MASK_CONFIG } from './config';
import { AbstractControl, ControlValueAccessor, NgControl, Validator } from '@angular/forms';
import { InputmaskOptions } from './types';
import Inputmask from 'inputmask';

// The initial issue: https://github.com/ngneat/input-mask/issues/40
// Webpack 5 has module resolution changes. Libraries should configure the `output.export`
// (https://webpack.js.org/configuration/output/#outputlibraryexport) property when published in
// a UMD format, to tell Webpack that there's a default export.
// The `_Inputmask` is an object with 2 properties: `{ __esModule: true, default: Inputmask }`.
// But we want to be backwards-compatible, so we try to read the `default` property first; otherwise, we fall back to `_Inputmask`.

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[inputMask]',
  standalone: true,
})
export class InputMaskDirective<T = any> implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() get inputMask() {
    return this.inputMaskOptions;
  }
  set inputMask(inputMask: InputmaskOptions<T> | undefined) {
    if (inputMask) {
      this.inputMaskOptions = inputMask;
      this.updateInputMask();
    }
  }

  private inputMaskOptions: InputmaskOptions<T> = {};
  private mutationObserver?: MutationObserver;

  inputMaskPlugin?: Inputmask.Instance;
  nativeInputElement?: HTMLInputElement;
  defaultInputMaskConfig: InputMaskConfig;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    @Optional() @Self() public ngControl?: NgControl,
    @Optional() @Inject(INPUT_MASK_CONFIG) public config?: InputMaskConfig,
  ) {
    this.defaultInputMaskConfig = new InputMaskConfig();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.setNativeInputElement(config);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: T | null) => void = () => {};

  @HostListener('input', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onInput = (_: any) => {};

  @HostListener('blur', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = (_: any) => {};

  validate = (control: AbstractControl) => {
    return !control.value || !this.inputMaskPlugin || this.inputMaskPlugin.isValid() ? null : { inputMask: true };
  };

  ngOnInit() {
    this.control?.addValidators(this.validate);
    this.control?.updateValueAndValidity();
  }

  ngOnDestroy() {
    this.removeInputMaskPlugin();
    this.mutationObserver?.disconnect();
  }

  writeValue(value: string) {
    const formatter = this.inputMaskOptions?.formatter;
    if (this.nativeInputElement) {
      this.renderer.setProperty(this.nativeInputElement, 'value', formatter && value ? formatter(value) : value ?? '');
    }
  }

  registerOnChange(onChange: (value: T | null) => void) {
    this.onChange = onChange;
    const parser = this.inputMaskOptions?.parser;
    this.onInput = (value) => {
      this.onChange(parser && value ? parser(value) : value);
    };
  }

  registerOnTouched(fn: VoidFunction) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    if (this.nativeInputElement) {
      this.renderer.setProperty(this.nativeInputElement, 'disabled', disabled);
    }
  }

  updateInputMask() {
    this.removeInputMaskPlugin();
    this.createInputMaskPlugin();
    // This re-creates the `onInput` function since `inputMaskOptions` might be changed and the `parser`
    // property now differs.
    this.registerOnChange(this.onChange);
  }

  createInputMaskPlugin() {
    const { nativeInputElement, inputMaskOptions } = this;
    if (
      isPlatformServer(this.platformId) ||
      !nativeInputElement ||
      inputMaskOptions === null ||
      Object.keys(inputMaskOptions).length === 0
    ) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { parser, formatter, ...options } = inputMaskOptions;
    this.inputMaskPlugin = this.ngZone.runOutsideAngular(() => new Inputmask(options).mask(nativeInputElement));
    if (this.control) {
      setTimeout(() => {
        this.control!.updateValueAndValidity();
      });
    }
  }

  get control() {
    return this.ngControl?.control;
  }

  setNativeInputElement(config: InputMaskConfig | undefined) {
    if (this.elementRef.nativeElement.tagName === 'INPUT') {
      this.nativeInputElement = this.elementRef.nativeElement;
    } else {
      this.defaultInputMaskConfig = {
        ...this.defaultInputMaskConfig,
        ...(config ?? {}),
      };
      if (this.defaultInputMaskConfig.isAsync) {
        // Create an observer instance linked to the callback function
        this.mutationObserver = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const nativeInputElement = this.elementRef.nativeElement.querySelector(
                this.defaultInputMaskConfig!.inputSelector,
              );
              if (nativeInputElement) {
                this.nativeInputElement = nativeInputElement;
                this.mutationObserver?.disconnect();
                this.createInputMaskPlugin();
              }
            }
          }
        });
        // Start observing the target node for configured mutations
        this.mutationObserver.observe(this.elementRef.nativeElement, {
          childList: true,
          subtree: true,
        });
      } else {
        this.nativeInputElement = this.elementRef.nativeElement.querySelector(
          this.defaultInputMaskConfig.inputSelector,
        );
      }
    }
  }

  removeInputMaskPlugin() {
    this.inputMaskPlugin?.remove();
    this.inputMaskPlugin = undefined;
  }
}
