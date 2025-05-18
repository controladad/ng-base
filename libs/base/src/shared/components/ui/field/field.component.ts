import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DateFilterFn, MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { createMask, InputMaskDirective, InputmaskOptions } from '../../../directives';
import {
  ItemRecords$,
  ItemRecord, DateHelper
} from '../../../../core';
import { CacSelectOptionsComponent, OptionsTriggerDirective } from '../select-options';
import { CacIconComponent } from '../icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CacControlErrorComponent } from '../control-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { QuillModule, QuillModules } from 'ngx-quill';
import { formControl, FormControlExtended } from '@al00x/forms';
import { CacButtonComponent } from '../button';

export type FieldInputType = 'text' | 'password' | 'password-eye' | 'number' | 'number-nobtn' | 'time';
export type FieldControlType = 'input' | 'date' | 'datetime' | 'textarea' | 'select' | 'rich-text' | 'file';
export type FieldAppearanceType = 'outlined' | 'simple' | 'compact';
export type FieldMaskType = 'time';
export type FieldFloatLabelType = 'always' | 'auto';

// TODO: Remove inputmask package & replace it with a ESM package & update mask directive to support it

@Component({
  selector: 'cac-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    AsyncPipe,
    InputMaskDirective,
    CacSelectOptionsComponent,
    OptionsTriggerDirective,
    CacIconComponent,
    MatProgressSpinnerModule,
    CacControlErrorComponent,
    QuillModule,
    CacButtonComponent,
  ],
})
export class CacFieldComponent<T> implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  readonly destroyRef = inject(DestroyRef);

  @ViewChild('MatFormField') formField!: MatFormField;
  @ViewChild('InputElement') inputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('SelectElement') selectElement?: ElementRef<HTMLInputElement>;
  @ViewChild('Options') selectOptions?: CacSelectOptionsComponent<any>;
  @ViewChild('DatePicker') datepickerElement?: MatDatepicker<any>;
  @ViewChild('FileInput') fileInputElement?: ElementRef<HTMLInputElement>;

  // Primary Inputs

  @Input() control: FormControlExtended = formControl(undefined);
  @Input() value?: any;
  @Input() controlType: FieldControlType = 'input';
  @Input() appearance?: FieldAppearanceType = 'outlined';
  @Input() label?: string;
  @Input() placeholder?: string = '';
  @Input() align?: 'left' | 'right';
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() suffix?: string;
  @Input() prefix?: string;
  // the whole error component will be removed (no error styling)
  @Input() hideError?: boolean;
  // the error text will be invisible (error styling and space is available)
  @Input() invisibleError?: boolean;
  @Input() clearable = false;
  @Input() hint?: string;
  @Input() loading = false;
  @Input() hideStar = false;
  @Input() floatLabel?: FieldFloatLabelType;

  // Secondary Inputs

  @Input() inputType: FieldInputType = 'text';
  @Input() maskType?: FieldMaskType;
  @Input() items: ItemRecords$<T, any> | undefined;
  @Input() categories?: ItemRecords$<string | number, any>;
  @Input() multiple?: boolean;
  @Input() optional = false;
  @Input() searchable = true;
  @Input() showIcons = false;
  @Input() autoComplete: boolean | 'new-password' | string = true;
  @Input() textareaRows?: number = 3;
  @Input() resizable = false;
  @Input() hideSuffix = false;
  @Input() dateFilter: DateFilterFn<any> = () => true;
  @Input() menuClass?: string;
  @Input() min = 0;
  @Input() fileAccept?: string;
  @Input() fileMaxSize?: number;
  @Input() quillModules!: QuillModules;

  @Output() onSelect = new EventEmitter<T>();

  controlSub = new Subscription();
  itemsUpdateSub = new Subscription();
  showPassword$ = new BehaviorSubject(false);
  inputMask?: InputmaskOptions<any>;
  isLoading = signal(false);
  isFocused = signal(false);
  isMenuOpen = signal(false);
  hasStar = signal(false);
  overrideFloatLabel = signal<FieldFloatLabelType | undefined>(undefined);

  protected tempControl = formControl();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.quillModules && this.quillModules.toolbar === undefined) {
      this.quillModules.toolbar = {};
    } else {
      this.quillModules = { toolbar: {} }
    }

    if (this.maskType) {
      this.inputMask = getInputMask(this.maskType);
    } else if (this.controlType === 'datetime') {
      this.inputMask = getInputMask('datetime');
    }

    this.tempControl.valueChanges.subscribe((value) => {
      this.control.setValue(value);
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();

    setTimeout(() => {
      if (this.selectOptions) {
        this.selectOptions.isLoading$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((v) => {
          this.isLoading.set(v);
        });
      }
    }, 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['control']) {
      this.controlSub?.unsubscribe();
      this.hasStar.set(this.control.hasValidator(Validators.required));
      this.controlSub = this.control.status$.subscribe(() => {
        this.control.updateValueAndValidity({ emitEvent: false });
      });
      this.controlSub.add(
        this.control.value$.subscribe((value) => {
          if (this.controlType === 'file') return;
          this.tempControl.setValue(value, { emitEvent: false });
        }),
      );
    }
    if (changes['value']) {
      this.control.setValue(this.value);
    }
  }

  ngOnDestroy() {
    this.controlSub?.unsubscribe();
    this.itemsUpdateSub?.unsubscribe();
  }

  reset() {
    this.control.reset();
  }

  setFocus(state: boolean) {
    this.isFocused.set(state);
  }

  focus() {
    this.inputElement?.nativeElement.focus();
    this.selectElement?.nativeElement.focus();
  }

  protected onClearClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.control.setValue(this.controlType === 'input' ? '' : null);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.emitStatus();
    this.tempControl.reset();
    this.focus();
  }

  protected onFocus() {
    this.setFocus(true);
    if (this.controlType === 'date') {
      this.datepickerElement?.open();
    }
  }

  protected onBlur() {
    this.setFocus(false);

    // There's a problem/bug with password typed inputs, which their statuses are not being updated...
    // We call the update manually
    if (this.inputType === 'password') {
      setTimeout(() => {
        this.control.emitStatus();
      }, 1);
    }
  }

  protected onFileBrowse(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.fileInputElement?.nativeElement.click();
  }

  protected onFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.tempControl.setValue(undefined);
      this.control.setValue(undefined);
      return;
    }
    const file = input.files[0];

    if (this.fileMaxSize && file.size > this.fileMaxSize!) {
      alert(`File is too large. Maximum size allowed: ${this.formatFileSize(this.fileMaxSize)}`);
      this.tempControl.setValue(undefined);
      this.control.setValue(undefined);
      return;
    }

    this.tempControl.setValue(file.name);
    this.control.setValue(file as any);
  }

  protected onFormFieldClick() {
    if (this.controlType === 'select') {
      setTimeout(() => {
        this.focus();
      }, 1);
    } else if (this.controlType === 'date') {
      this.datepickerElement?.open();
    }
  }

  protected onNumericUp() {
    this.numericAddToValue(1);
  }

  protected onNumericDown() {
    this.numericAddToValue(-1);
  }

  protected onSelectOptionsMultiple(v: any[]) {
    // In multiple mode, floatLabel doesn't move on select, so we need to override it
    this.overrideFloatLabel.set(v && v.length ? 'always' : undefined);
  }

  protected openDatePicker(e: MouseEvent) {
    e.stopPropagation();
    this.isMenuOpen.set(true);
    this.datepickerElement?.open();
  }

  protected onDatePickerClose() {
    this.isMenuOpen.set(false);
    if (this.controlType === 'datetime') {
      this.focus();
    }
  }

  private numericAddToValue(value: number) {
    let currentValue = parseInt(this.control.value);
    if (isNaN(currentValue)) {
      this.control.setValue(value);
      return;
    } else {
      currentValue += value;
      this.control.setValue(currentValue);
    }
  }

  protected passwordVisibility() {
    this.showPassword$.next(!this.showPassword$.value);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

function getInputMask(type: FieldMaskType | 'datetime') {
  switch (type) {
    case 'time':
      return createMask({
        alias: 'datetime',
        inputFormat: 'HH:MM',
        placeholder: '__:__',
        parser: (v: string) => {
          return DateHelper.formattedTimeToMinutes(v);
        },
        formatter: (v: string | number) => {
          return typeof v === 'string' ? v : DateHelper.minutesToFormattedTime(v);
        },
      });
    case 'datetime':
      return createMask({
        alias: 'datetime',
        inputFormat: 'yyyy/mm/dd , HH:MM',
        placeholder: '____/__/__ , __:__',
        parser: (v: string) => {
          if (v.includes('_')) return v;
          return DateHelper.parse(v, 'yyyy/MM/dd , HH:mm');
        },
        formatter: (v: Date | string) => {
          return DateHelper.format(v, 'yyyy/MM/dd , HH:mm');
        },
      });
  }
}
