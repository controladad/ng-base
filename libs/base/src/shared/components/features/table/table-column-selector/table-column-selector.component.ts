import { Component, input, signal, effect, OnDestroy } from '@angular/core';
import { CacFieldComponent } from '../../../ui';
import { formControl } from '@al00x/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CacTableComponent, TableColumnData } from '../table.component';

export interface ColumnOption {
  value: string;
  label: string;
}

@Component({
  selector: 'cac-table-column-selector',
  standalone: true,
  imports: [CacFieldComponent],
  templateUrl: './table-column-selector.component.html',
  styleUrl: './table-column-selector.component.scss'
})
export class CacTableColumnSelectorComponent<T extends object> implements OnDestroy {
  tableRef = input.required<CacTableComponent<T>>();
  label = input<string>('Columns');
  placeholder = input<string>('Select columns to display');
  storageKey = input<string>(''); // Optional storage key for persistence

  columnControl = formControl<string[]>([]);
  columnOptions = signal<ColumnOption[]>([]);

  private destroy$ = new Subject<void>();
  private initialized = signal(false);

  constructor() {
    effect(() => {
      const table = this.tableRef();
      if (table && !this.initialized()) {
        this.initializeColumnOptions();
        this.restoreColumnVisibility();
        this.setupColumnControlSubscription();
        this.initialized.set(true);
      }
    });

    // Watch for table initialization and re-apply saved column settings
    effect(() => {
      const table = this.tableRef();
      if (table && table.initialized() && this.initialized()) {
        // Re-apply saved column visibility after table is fully initialized
        this.restoreColumnVisibility();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeColumnOptions() {
    const table = this.tableRef();
    if (!table) return;

    const allColumns = table.columns();
    const options = allColumns.map((col: TableColumnData<T>) => ({
      value: col.prop as string,
      label: col.label
    }));

    this.columnOptions.set(options);
  }

  private restoreColumnVisibility() {
    const key = this.storageKey();
    if (!key) {
      this.setInitialVisibleColumns();
      return;
    }

    try {
      const stored = localStorage.getItem(`cac-table-columns-${key}`);
      if (stored) {
        const hiddenColumns = JSON.parse(stored) as string[];
        const table = this.tableRef();

        if (table && hiddenColumns.length > 0) {
          // Apply hidden columns to table
          table.hiddenColsArray.set(hiddenColumns as (keyof T)[]);
        }
      }
    } catch (error) {
      console.warn('Failed to restore column visibility:', error);
    }

    this.setInitialVisibleColumns();
  }

  private setInitialVisibleColumns() {
    const table = this.tableRef();
    if (!table) return;

    const allColumns = table.columns();
    const hiddenColumns = table.hiddenColsArray();

    const visibleColumnKeys = allColumns
      .filter((col: TableColumnData<T>) => !hiddenColumns.includes(col.prop as keyof T))
      .map((col: TableColumnData<T>) => col.prop as string);

    // Set control value without triggering subscription
    this.columnControl.setValue(visibleColumnKeys, { emitEvent: false });
  }

  private setupColumnControlSubscription() {
    this.columnControl.valueChanges
      .pipe(
        debounceTime(300), // Debounce to avoid excessive calls
        takeUntil(this.destroy$)
      )
      .subscribe(selectedColumns => {
        if (!selectedColumns || !this.initialized()) return;

        const table = this.tableRef();
        if (!table) return;

        this.updateTableColumnVisibility(selectedColumns);
        this.saveColumnVisibility();
      });
  }

  private updateTableColumnVisibility(selectedColumns: string[]) {
    const table = this.tableRef();
    if (!table) return;

    const allColumnKeys = this.columnOptions().map(option => option.value);
    const columnsToHide = allColumnKeys.filter(key => !selectedColumns.includes(key));

    // Set the hidden columns array directly instead of calling hide/show methods
    // to avoid potential conflicts with the existing state
    table.hiddenColsArray.set(columnsToHide as (keyof T)[]);
  }

  private saveColumnVisibility() {
    const key = this.storageKey();
    if (!key) return;

    try {
      const table = this.tableRef();
      if (table) {
        const hiddenColumns = table.hiddenColsArray();
        localStorage.setItem(`cac-table-columns-${key}`, JSON.stringify(hiddenColumns));
      }
    } catch (error) {
      console.warn('Failed to save column visibility:', error);
    }
  }

  /**
   * Reset columns to default visibility
   */
  resetColumns() {
    const table = this.tableRef();
    if (!table) return;

    // Show all columns
    table.hiddenColsArray.set([]);

    // Update control
    const allColumnKeys = this.columnOptions().map(option => option.value);
    this.columnControl.setValue(allColumnKeys, { emitEvent: false });

    // Clear storage
    const key = this.storageKey();
    if (key) {
      localStorage.removeItem(`cac-table-columns-${key}`);
    }
  }
}