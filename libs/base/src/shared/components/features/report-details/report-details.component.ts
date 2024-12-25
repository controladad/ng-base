import { Component, input, OnInit, signal } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { of } from 'rxjs';
import { ReportTimeRangeValues, ReportFieldValues } from '../../../data';
import { table, TableComponent } from '../table';
import { FieldComponent } from '../../ui/field';
import { ButtonComponent } from '../../ui/button';
import { formControl, GetOfflineAdapter, ReportTimeRange } from '../../../../core';

@Component({
  selector: 'feature-report-details',
  standalone: true,
  imports: [TableComponent, FieldComponent, ButtonComponent],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss',
})
export class ReportDetailsComponent implements OnInit {
  mode = input<'preview' | 'view'>();
  reportId = input<number>();

  rangeItems = ReportTimeRangeValues;
  rangeControl = formControl<ReportTimeRange>(undefined);
  manualRange = signal<DateRange<Date | null> | null>(null);

  table = table({
    itemsFn: undefined,
    columns: {},
  });

  ngOnInit(): void {
    this.getReport();
  }

  getReport() {
    const report = {
      name: 'نام گزارش',
      cols: ['TrafficNumber', 'CheckoutTime', 'DriverName', 'PlateNumber', 'BillNumber'],
    };
    let tableCols = {};
    report.cols.forEach((col) => {
      const field = ReportFieldValues.find((x) => x.value === col);
      tableCols = {
        ...tableCols,
        [col]: { label: field?.label || col, type: field?.alt || 'text', sortable: false, filterable: false },
      };
    });
    this.table.setOptions({
      itemsFn: GetOfflineAdapter(
        of([
          {
            TrafficNumber: '12345',
            CheckoutTime: new Date(),
            DriverName: 'Driver name',
            PlateNumber: '44ن44444',
            BillNumber: '12',
            id: 1,
          },
        ]),
      ),
      ...(this.mode() === 'view'
        ? {
            view: {
              title: report.name,
            },
            print: {
              cols: report.cols,
            },
            export: () => {
              return of([]);
            },
          }
        : {}),
      columns: tableCols,
    });
  }

  selectRange() {
    this.getReport();
  }

  selectRangeManually() {
    dialog$
      .calendar()
      .afterSubmit()
      .subscribe((result) => {
        this.rangeControl.reset();
        this.manualRange.set(result.range);
        this.getReport();
      });
  }
}
