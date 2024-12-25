import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '../button';
import { MatIconModule } from '@angular/material/icon';
import { format, newDate } from 'date-fns-jalali';
import { FieldComponent } from '../field';
import { formControl } from '../../../../core';

export const DATE_FORMAT = 'yyyy/MM/dd';

@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  imports: [
    MatDatepickerModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatIconModule,
    FieldComponent,
    MatMenuModule,
    NgSwitchCase,
    NgTemplateOutlet,
    NgSwitch,
    NgIf,
  ],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    { provide: DatePipe },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  @Input() switch: 'calendar' | 'date-picker' | 'input' = 'calendar';
  @Input() mode: 'one-day' | 'range' = 'range';
  @Input() title = 'تاریخ';
  @Output() date = new EventEmitter<DateRange<Date | null> | Date>();

  constructor(private datePipe: DatePipe) {}

  dateControl = formControl();
  dateRangeGroup = new FormGroup({
    start: formControl(),
    end: formControl(),
  });
  selectedDateRange?: DateRange<Date | undefined>;
  oneDayFormControl = formControl<string | undefined>();
  oneDay?: Date;

  selectRange(date: Date | null | undefined): void {
    if (!date) return;

    const jalali = this.makeJalaliDate(date);
    const startDate = this.selectedDateRange?.start;
    if (this.dateRangeGroup.controls.start.value && startDate && date > startDate) {
      this.dateRangeGroup.controls.end.setValue(jalali);
      this.selectedDateRange = new DateRange(this.selectedDateRange?.start, date);
    } else {
      this.dateRangeGroup.controls.end.setValue(undefined);
      this.selectedDateRange = new DateRange(undefined, undefined);
      this.dateRangeGroup.controls.start.setValue(jalali);
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  selectOneDay(date: Date | undefined | null) {
    if (!date) return;

    this.oneDayFormControl?.setValue(this.makeJalaliDate(date));
    this.oneDay = date;
  }

  makeJalaliDate(date: Date) {
    //Milady date
    const year = date.getFullYear();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return format(new Date(year, month, day), DATE_FORMAT);
  }

  inputDateManually(control: FormControl, type?: 'first' | 'second') {
    const date: string[] = control.value.split('/');
    if (date.length < 3) return;
    const dateNumber: number[] = date.map((str) => (str === '' ? Number('01') : Number(str)));
    const miladyDate = newDate(dateNumber[0], dateNumber[1] - 1, dateNumber[2]);

    if (miladyDate) {
      if (this.mode === 'one-day') {
        this.oneDay = miladyDate;
      } else {
        if (type === 'first') {
          this.selectedDateRange = new DateRange(miladyDate, this.selectedDateRange?.end);
        } else {
          this.selectedDateRange = new DateRange(this.selectedDateRange?.start, miladyDate);
        }
      }
    }
  }

  submit() {
    let date;
    if (this.mode === 'range') {
      date = new DateRange(
        new Date(this.dateRangeGroup.controls.start.value ?? ''),
        new Date(this.dateRangeGroup.controls.end.value ?? ''),
      );
    } else {
      date = new Date(this.oneDayFormControl.value ?? '');
    }

    this.date.emit(date ?? undefined);
  }
  cancel() {
    this.selectedDateRange = new DateRange(undefined, undefined);
    this.dateRangeGroup.controls.start.setValue(undefined);
    this.dateRangeGroup.controls.end.setValue(undefined);
    this.oneDayFormControl.setValue(undefined);
    this.oneDay = undefined;
  }
}
