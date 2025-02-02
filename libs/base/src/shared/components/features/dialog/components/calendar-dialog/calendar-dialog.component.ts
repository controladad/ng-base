import { Component } from '@angular/core';
import { CacBaseDialogComponent } from '../_base-dialog.component';
import { CacDatePickerComponent } from '../../../../ui';
import { DateRange } from '@angular/material/datepicker';

export interface CalendarsDialogResult {
  range: DateRange<Date | null>;
}

@Component({
  selector: 'cac-calendar-dialog',
  standalone: true,
  imports: [CacDatePickerComponent],
  templateUrl: './calendar-dialog.component.html',
  styleUrl: './calendar-dialog.component.scss',
})
export class CacCalendarDialogComponent extends CacBaseDialogComponent<null, CalendarsDialogResult> {
  onSave(range: DateRange<Date | null> | Date) {
    this.submit({ range: range as DateRange<Date | null> });
  }
}
