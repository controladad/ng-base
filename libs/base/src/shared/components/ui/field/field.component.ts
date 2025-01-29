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
  getDurationInHHMM,
  getHHMMInDuration,
  getJalaliDate,
  parseJalaliDate,
} from '../../../../core';
import { SelectOptionsComponent, OptionsTriggerDirective } from '../select-options';
import { IconComponent } from '../icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ControlErrorComponent } from '../control-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formControl, FormControlExtended } from '../../../forms';

export type FieldInputType = 'text' | 'password' | 'password-eye' | 'number' | 'number-nobtn' | 'time';
export type FieldControlType = 'input' | 'date' | 'datetime' | 'textarea' | 'select';
export type FieldAppearanceType = 'outlined' | 'simple' | 'compact';
export type FieldMaskType = 'time';
export type FieldFloatLabelType = 'always' | 'auto';

// TODO: Remove inputmask package & replace it with a ESM package & update mask directive to support it

@Component({
  selector: 'ui-field',
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
    SelectOptionsComponent,
    OptionsTriggerDirective,
    IconComponent,
    MatProgressSpinnerModule,
    ControlErrorComponent
],
})
export class FieldComponent<T> implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  readonly destroyRef = inject(DestroyRef);

  @ViewChild('MatFormField') formField!: MatFormField;
  @ViewChild('InputElement') inputElement?: ElementRef<HTMLInputElement>;
  @ViewChild('SelectElement') selectElement?: ElementRef<HTMLInputElement>;
  @ViewChild('Options') selectOptions?: SelectOptionsComponent<any>;
  @ViewChild('DatePicker') datepickerElement?: MatDatepicker<any>;

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
  @Input() floatLabel?: FieldFloatLabelType = 'auto';

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

  @Output() onSelect = new EventEmitter<T>();

  controlSub = new Subscription();
  itemsUpdateSub = new Subscription();
  showPassword$ = new BehaviorSubject(false);
  inputMask?: InputmaskOptions<any>;

  overrideFloatLabel = signal<FieldFloatLabelType | undefined>(undefined);
  isLoading = signal(false);
  isFocused = signal(false);
  isMenuOpen = signal(false);
  hasStar = signal(false);

  protected tempControl = formControl();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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
    // In multiple, floatLabel doesn't move on select, so we need to override it
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
    }
    currentValue += value;
    this.control.setValue(currentValue);
  }

  protected passwordVisibility() {
    this.showPassword$.next(!this.showPassword$.value);
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
          return getHHMMInDuration(v);
        },
        formatter: (v: string | number) => {
          return typeof v === 'string' ? v : getDurationInHHMM(v);
        },
      });
    case 'datetime':
      return createMask({
        alias: 'datetime',
        inputFormat: 'yyyy/mm/dd , HH:MM',
        placeholder: '____/__/__ , __:__',
        parser: (v: string) => {
          if (v.includes('_')) return v;
          return parseJalaliDate(v, 'yyyy/MM/dd , HH:mm');
        },
        formatter: (v: Date | string) => {
          return getJalaliDate(v, 'yyyy/MM/dd , HH:mm');
        },
      });
  }
}
