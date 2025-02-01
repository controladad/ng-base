import { computed, signal } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { DataFilterTypes, DataGetRequest, getFromItemRecord, getJalaliDate, ItemRecords$ } from '../../core';
import { FormBuilderInputType, TableColumnData, TableColumnFilter, TableFilterOptions } from '../components';
import { BooleanValues } from '../data';

export interface FilterValue {
  key?: string;
  value?: Date | string | number | boolean | string[] | number[];
  displayText?: string | string[];
  type: DataFilterTypes;
  controlType?: FormBuilderInputType;
}

export interface FilterOptions {
  prop: string;
  label: string;
  items?: ItemRecords$<any>;
  filterable?: TableColumnFilter;
  icon?: string;
}

export interface FilterItem {
  // prop is used to identify the filter
  prop: string;
  values: FilterValue[] | undefined;
  // key is for the filtering purpose
  key: string;
  label: string;
  // The prob used, has been set manually and strictly (ex: when using col.filterable as a string)
  strictKey?: boolean;
  // Displayable text for filter
  formatted?: {
    full: string;
    prefix: string;
    text: string;
    suffix: string;
  };
  icon?: string;
}

export type FilterObject = { [p: string]: FilterItem | undefined };

export type TableFilterObject = { [p: string]: FilterValue[] };

export class FilterModel {
  protected _filters = signal<FilterObject>({});
  private _changes$ = new Subject<FilterObject | undefined>();

  filters = computed(() => {
    const obj = this._filters();
    if (!obj) return this.overrideEmpty;
    Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
    if (Object.keys(obj).length === 0) return this.overrideEmpty;
    return obj as FilterObject;
  });
  filtersArray = computed(() => {
    const filters = this.filters();
    if (!filters) return [];
    return Object.values(filters) as FilterItem[];
  });
  hasFilter = computed(() => {
    return this.filters() !== undefined;
  });
  changes$ = this._changes$.pipe(debounceTime(50));

  constructor(
    init?: FilterObject,
    public overrideEmpty?: FilterObject,
  ) {
    this._filters.set(init ?? overrideEmpty ?? {});
  }

  set(data: FilterOptions, values: FilterValue[] | undefined, emit = true) {
    if (values === undefined || values.every((t) => t.value === undefined || t.value === null)) {
      this.remove(data.prop);
      return;
    }

    this._filters.set({
      ...this._filters(),
      [data.prop]: this.createFilterItem(data, values),
    });

    if (emit) this.emitChanges();
  }

  remove(prop: string) {
    this._filters.set({
      ...this._filters(),
      [prop]: undefined,
    });

    this.emitChanges();
  }

  clear() {
    this._filters.set({});

    this.emitChanges();
  }

  create(): DataGetRequest['filters'] {
    const filters = this.filtersArray();
    return filters
      .filter((t) => !!t.values && t.values.length > 0)
      .map((item) =>
        item.values!.map((v) => ({
          key: v.key ?? item.key,
          strictKey: !!item.strictKey || !!v.key,
          value: this.mapValueToString(v.value),
          type: v.type,
        })),
      )
      .reduce((pre, cur) => pre.concat(cur), []);
  }

  // Emit will be called automatically, use this is you disabled emit on any functions
  emitChanges() {
    this._changes$.next(this._filters());
  }

  protected createFilterItem(opts: FilterOptions, value?: FilterValue[]) {
    const item: FilterItem = {
      ...this.getKey(opts),
      values: undefined,
      prop: opts.prop,
      label: opts.label,
      icon: opts.icon,
    };
    return this.setValueForFilterItem(item, value, opts.items);
  }

  protected setValueForFilterItem(item: FilterItem, values?: FilterValue[], records?: ItemRecords$<any>) {
    const newValues = values
      ? values.every((t) => t.value === null || t.value === undefined)
        ? undefined
        : values.map((t) => {
            const value = t.value;

            if (value instanceof Date && t.controlType === 'date') {
              if (t.type === 'lower') {
                value.setHours(23, 59, 59, 999);
              } else {
                value.setHours(0, 0, 0, 0);
              }
            }

            return {
              ...t,
              value,
            } as typeof t;
          })
      : undefined;

    item.values = newValues;
    item.formatted = newValues ? this.formatFilterItem(item, records) : undefined;
    return item;
  }

  private mapValueToString(value: FilterValue['value']): string | string[] {
    if (value instanceof Array) {
      return value.map((t) => this.mapValueToString(t) as string);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return value ?? '';
  }

  private mapValueToReadable(filterValue: FilterValue, records?: ItemRecords$<any>): string {
    const value = filterValue.value;
    if (value instanceof Date) {
      if (filterValue.controlType === 'datetime') {
        return getJalaliDate(value, 'HH:mm ,yyyy/MM/dd');
      }
      return getJalaliDate(value);
    }
    if (filterValue.displayText && filterValue.displayText.length) {
      return filterValue.displayText instanceof Array ? filterValue.displayText.join(', ') : filterValue.displayText;
    }
    if (records && records instanceof Array) {
      return getFromItemRecord(records, value)?.label ?? '';
    }
    if (typeof value === 'boolean') {
      return value ? $localize`:@@base.values.trueText:بله` : $localize`:@@base.values.falseText:خیر`;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return value instanceof Array ? (value.length ? value.join(', ') : '') : value ?? '';
  }

  private getKey(data: FilterOptions): { key: string; strictKey?: boolean } {
    if (data.filterable === true) {
      return { key: data.prop };
    } else if (typeof data.filterable === 'string') {
      return data.filterable !== '' ? { key: data.filterable, strictKey: true } : { key: data.prop };
    }
    return { key: data.prop };
  }

  private formatFilterItem(item: FilterItem, records?: ItemRecords$<any>): FilterItem['formatted'] {
    let prefix = '';
    let suffix = '';

    const equal = item.values?.find((t) => t.type === 'equal' || t.type === 'contains');
    const greater = item.values?.find((t) => t.type === 'greater');
    const lower = item.values?.find((t) => t.type === 'lower');

    const equalValue =
      equal?.value !== undefined && equal?.value !== null ? this.mapValueToReadable(equal, records) : undefined;
    const greaterValue =
      greater?.value !== undefined && greater?.value !== null ? this.mapValueToReadable(greater, records) : undefined;
    const lowerValue =
      lower?.value !== undefined && lower?.value !== null ? this.mapValueToReadable(lower, records) : undefined;

    if (equalValue !== undefined && equalValue !== null) {
      suffix += ` : ${equalValue}`;
    } else if (greaterValue !== undefined && greaterValue !== null && lowerValue !== undefined && lowerValue !== null) {
      prefix += `${greaterValue} < `;
      suffix += ` < ${lowerValue}`;
    } else if (greaterValue !== undefined && greaterValue !== null) {
      suffix += ` > ${greaterValue}`;
    } else if (lowerValue !== undefined && lowerValue !== null) {
      suffix += ` < ${lowerValue}`;
    }

    if (prefix === '' && suffix === '') return undefined;
    return {
      full: `${prefix}${item.label}${suffix}`,
      text: item.label,
      prefix: prefix,
      suffix: suffix,
    };
  }
}

export class TableFilterModel extends FilterModel {
  private _columns?: TableColumnData<any>[];

  columnFilters: { [p: string]: TableFilterOptions[] } = {};
  columnLabels: { [p: string]: string } = {};

  columnsChanged$ = new BehaviorSubject<void>(undefined);

  constructor(
    public initValue?: FilterObject,
    public overrideEmptyValue?: TableFilterObject,
  ) {
    super(initValue);
  }

  override set(columnProp: FilterOptions | string, values: FilterValue[] | undefined, emit = true) {
    if (typeof columnProp === 'object') {
      super.set(columnProp, values, emit);
      return;
    }

    if (!this._columns) return;

    const col = this._columns.find((t) => t.prop === columnProp);

    if (!col) {
      console.error(`Table filter failed with the given prop: '${columnProp}'`);
      return;
    }

    super.set(col, values, emit);
  }

  setColumns(columns: typeof this._columns) {
    this._columns = columns;
    this.updateFilters();
    this.setOverrideEmpty();

    this.columnsChanged$.next();
  }

  getColumnFilters(columnProp: string): TableFilterOptions[] | undefined {
    return this.columnFilters[columnProp];
  }

  private setOverrideEmpty() {
    if (!this.overrideEmptyValue || !this._columns) return;

    this.overrideEmpty = {};
    for (const prop in this.overrideEmptyValue) {
      const column = this._columns.find((t) => t.prop === prop);
      if (!column) continue;

      const value = this.overrideEmptyValue[prop];
      const item = this.createFilterItem(column, value);
      this.overrideEmpty[item.prop] = item;
    }
    if (!this.initValue) {
      this._filters.set(this.overrideEmpty);
    }
  }

  private updateFilters() {
    if (!this._columns) return;

    this.columnFilters = {};
    this.columnLabels = {};
    for (const column of this._columns) {
      let filters: TableFilterOptions[] | undefined;
      if (column.filterable instanceof Array) {
        filters = column.filterable;
      } else if (column.filterable) {
        switch (column.type ?? 'text') {
          case 'number': {
            filters = [
              { inputType: 'number', type: 'equal' },
              { inputType: 'number', type: 'greater' },
              { inputType: 'number', type: 'lower' },
            ];
            break;
          }
          case 'boolean': {
            filters = [{ type: 'equal', controlType: 'select', items: column.items ?? BooleanValues }];
            break;
          }
          case 'plate':
            filters = [{ type: 'equal', controlType: 'plate' }];
            break;
          default: {
            filters = [
              {
                type: 'contains',
                controlType: column.items ? 'select' : 'input',
                items: column.items ?? undefined,
              },
            ];
          }
        }
      }

      if (filters) {
        this.columnLabels[column.prop] = column.label;
        this.columnFilters[column.prop] = filters;
      }
    }
  }
}
