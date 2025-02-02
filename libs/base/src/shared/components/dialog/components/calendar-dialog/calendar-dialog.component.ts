import { Component } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { DatePickerComponent } from '../../../ui';
import { DateRange } from '@angular/material/datepicker';

export interface CalendarsDialogResult {
  range: DateRange<Date | null>;
}

@Component({
  selector: 'feature-calendar-dialog',
  standalone: true,
  imports: [DatePickerComponent],
  templateUrl: './calendar-dialog.component.html',
  styleUrl: './calendar-dialog.component.scss',
})
export class CalendarDialogComponent extends BaseDialogComponent<null, CalendarsDialogResult> {
  onSave(range: DateRange<Date | null> | Date) {
    this.submit({ range: range as DateRange<Date | null> });
  }
}
