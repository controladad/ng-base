import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NgForOf, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, pairwise, startWith } from 'rxjs';
import { DateFilterFn } from '@angular/material/datepicker';
import { TableColumnData, TableFilterMenuComponent } from '../table';
import { FieldComponent, IconComponent } from '../../ui';
import { BottomControlsComponent } from '../bottom-controls';
import { BranchApiService, formControl, ItemRecord } from '../../../../core';
import { FilterModel } from '../../../classes';

export interface DashboardFilterChangeEvent {
  startDate?: Date;
  endDate?: Date;
  branchIds?: number[];
}

@Component({
  selector: 'feature-dashboard-filter',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    TableFilterMenuComponent,
    MatIconModule,
    ReactiveFormsModule,
    MatMenuModule,
    NgForOf,
    NgIf,
    IconComponent,
    FieldComponent,
    BottomControlsComponent,
  ],
  templateUrl: './dashboard-filter.component.html',
  styleUrl: './dashboard-filter.component.scss',
})
export class DashboardFilterComponent implements AfterViewInit {
  private destroyRef = inject(DestroyRef);
  private branchApiService = inject(BranchApiService);

  @ViewChild('DateRangeMenuTrigger') menuTrigger!: MatMenuTrigger;

  @Output() onChange = new EventEmitter<DashboardFilterChangeEvent>();

  filters: ItemRecord<string | number>[] = [
    { label: 'امروز', value: 1 },
    { label: '۷ روز', value: 7 },
    { label: '۳۰ روز', value: 30 },
    { label: '۹۰ روز', value: 90 },
  ];

  selectedFilter = formControl<string | number>(1);
  lastSelectedFilter?: string | number;
  filterModel = new FilterModel();

  customFilterCol: TableColumnData<any> = {
    prop: 'custom',
    type: 'date',
    label: 'تقویم',
    isHidden: false,
  };

  lowDateControl = formControl<Date>(undefined, Validators.required);
  highDateControl = formControl<Date>();
  branchControl = formControl<number[]>([]);

  branchItems = this.branchApiService.getItems();

  dateFilter: DateFilterFn<Date> = (date) => new Date() >= (date ?? new Date());

  constructor() {
    this.branchControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const selectedFilter = this.selectedFilter.value;
      if (typeof selectedFilter === 'number') {
        this.handleFilterChange(selectedFilter);
      } else {
        const startDate = this.lowDateControl.value;
        const endDate = this.highDateControl.value;
        this.emit(startDate, endDate);
      }
    });
  }

  ngAfterViewInit() {
    this.selectedFilter.valueChanges
      .pipe(
        startWith(this.selectedFilter.value),
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        pairwise(),
      )
      .subscribe((filter) => {
        this.lastSelectedFilter = filter[0];
        const value = filter[1];

        this.lowDateControl.reset();
        this.highDateControl.reset();

        if (value === 'default') {
          this.emit(undefined, undefined);
          return;
        }

        if (typeof value !== 'number') return;

        this.handleFilterChange(value);
      });

    this.handleFilterChange(this.selectedFilter.value as number);
  }

  onSubmitRange() {
    const startDate = this.lowDateControl.value;
    let endDate = this.highDateControl.value;

    if (!startDate) {
      this.onCancelRange(true);
      return;
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);
    }

    this.emit(startDate, endDate);
    this.menuTrigger.closeMenu();
  }

  onCancelRange(clear?: boolean) {
    if (clear || !this.lowDateControl.value || !this.highDateControl.value) {
      this.selectedFilter.setValue(this.lastSelectedFilter ?? 1);
    }

    this.menuTrigger.closeMenu();
  }

  private handleFilterChange(valueDays: number) {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - valueDays + 1);
    this.emit(startDate, endDate);
  }

  private emit(startDate?: Date, endDate?: Date) {
    if (this.selectedFilter.value !== 'custom') {
      startDate?.setHours(0, 0, 0, 0);
      endDate?.setHours(23, 59, 59, 999);
    }
    const branchIds = this.branchControl.value;
    this.onChange.emit({ startDate, endDate, branchIds });
  }
}
