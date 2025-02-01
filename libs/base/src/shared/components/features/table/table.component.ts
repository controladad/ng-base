import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
  computed,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  OnInit,
  ElementRef,
  inject,
  DestroyRef,
  TrackByFunction,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  BehaviorSubject,
  Observable,
  map,
  of,
  tap,
  Subscription,
  Subject,
  debounceTime,
  UnaryFunction,
  pipe,
  catchError,
  NEVER,
  switchMap,
  take,
} from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { formatNumber, NgTemplateOutlet } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import {
  TableAction,
  TableBulkAction,
  TableButtonEvent,
  TableColumn,
  TableDialogParams,
  TableExportOutput,
  TableMenuParams,
  TableOptions, TablePagination,
  TablePrintOptionsCol,
  TableStateParams
} from './table.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableFilterBarComponent } from './table-filter-bar/table-filter-bar.component';
import { TableFormMenuComponent } from './table-form-menu/table-form-menu.component';
import { DataGetRequest, DataGetResponse, effectDep, ItemRecord, ItemToId, objectToId } from '../../../../core';
import { SelectionModel, SortModel, TableFilterModel } from '../../../classes';
import {
  ButtonClickEvent,
  PaginationComponent,
  SkeletonComponent,
} from '../../ui';
import * as dateFns from 'date-fns-jalali';
import { PrintableTableComponent } from '../printable-table';
import { ForNumberDirective } from '../../../directives';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { formControl } from '../../../forms';
import {
  TABLE_COL_SELECTION_PROP,
  TableColSelectionComponent
} from './columns/table-col-selection/table-col-selection.component';
import { TABLE_COL_INDEX_PROP, TableColIndexComponent } from './columns/table-col-index/table-col-index.component';
import { TableColDefaultComponent } from './columns/table-col-default/table-col-default.component';
import { TABLE_COL_ACTION_PROP, TableColActionComponent } from './columns/table-col-action/table-col-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { CacBase } from '../../../../configs';

interface TableRowData {
  value: any;
  value$?: Observable<any>;
  rawValue: any;
  dynamicClass: string;
  dynamicClass$?: Observable<string | undefined>;
  isValueTrue: boolean;
  isValueTrue$?: Observable<boolean>;
  getValue: () => any;
}

interface TableRowAction {
  disabled$?: Observable<boolean>;
  disabled?: boolean;
  permission?: string;
}

export interface TableRow<T> {
  id: string | number;
  // This is used to track if an item is mutated and update the view.
  mutation: number;
  data: { [p: string]: TableRowData };
  originalItem: T;
  actions: { [p: number]: TableRowAction };
}

export interface TableColumnData<T> extends TableColumn<T> {
  prop: string;
  isHidden: boolean;
}

const TABLE_DEFAULT_GENERATOR = () =>
  ({
    itemToIdFn: objectToId,
    actions: [],
    bulkActions: [],
    selectionModel: new SelectionModel<any>(0, true, [], objectToId),
    sortModel: new SortModel(),
    filterModel: new TableFilterModel(),
    ...CacBase.config.components.table,
    columns: {},
    itemsFn: undefined,
  }) as TableOptions<any>;

export class TablePaginationMismatchError extends Error {
  constructor() {
    super(
      "Table's pagination mismatched from what is being provided by the api, switching to the last available page index.",
    );
    this.name = 'TablePaginationMismatchError';
  }
}

// TODO: Table loader should be inline in each row instead of hiding everything.
// like showing the header and each row containing a skeleton
// TODO: Add tooltip to action buttons
// TODO: Refactor using TableService

export class TableClass<T extends object> {
  private _initFn?: (ref: TableComponent<T>) => void;

  public items$ = new BehaviorSubject<T[] | undefined>(undefined);
  public ref?: TableComponent<T>;

  constructor(public options?: TableOptions<T>) {}

  onInit(fn: typeof this._initFn) {
    this._initFn = fn;
  }

  setOptions(options: TableOptions<T>) {
    this.options = options;
    this.ref?.setOptions();
  }

  setRef(ref: TableComponent<T>) {
    this.ref = ref;
    this._initFn?.(ref);
  }

  refresh() {
    this.ref?.refresh();
  }
}

// this function acts as a type infer for typescript, using this function is optional
export function table<T extends object>(options?: TableOptions<T>): TableClass<T> {
  return new TableClass(options);
}

@Component({
  selector: 'feature-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    PaginationComponent,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    TableFilterBarComponent,
    PrintableTableComponent,
    NgxSkeletonLoaderModule,
    ForNumberDirective,
    SkeletonComponent,
    MatProgressBarModule,
    TableFormMenuComponent,
    TableColSelectionComponent,
    TableColIndexComponent,
    TableColDefaultComponent,
    TableColActionComponent,
    NgTemplateOutlet,
    TableHeaderComponent
],
  providers: [],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T extends object> implements OnInit, OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
  readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly ACTIVE_STRING_VALUE = 'Active';

  readonly EMPTY_VALUE = $localize`:@@base.feature.table.emptyValue:-`;
  readonly ADD_TEXT = $localize`:@@base.feature.table.addText:اضافه کردن`;
  readonly EDIT_TEXT = $localize`:@@base.feature.table.editText:تغییر دادن`;
  readonly NEW_TEXT = $localize`:@@base.feature.table.newText:جدید`;
  readonly TRUE_TEXT = $localize`:@@base.values.trueText:بله`;
  readonly FALSE_TEXT = $localize`:@@base.values.falseText:خیر`;
  readonly ACTIVE_TEXT = $localize`:@@base.feature.table.activeText:فعال`;
  readonly INACTIVE_TEXT = $localize`:@@base.feature.table.inactiveText:غیرفعال`;
  
  readonly HOURS_TEXT = $localize`:@@base.feature.table.cellFormatting.hours:ساعت`;
  readonly HOURS_AND_TEXT = $localize`:@@base.feature.table.cellFormatting.hoursAnd:ساعت و`;
  readonly MINUTES_TEXT = $localize`:@@base.feature.table.cellFormatting.minutes:دقیقه`;
  readonly DATE_TEXT = $localize`:@@base.feature.table.cellFormatting.date:تاریخ`;
  readonly PLATE_COUNTRY_TEXT = $localize`:@@base.feature.table.cellFormatting.plateCountry:ایران`;


  readonly TABLE_DEFAULTS = TABLE_DEFAULT_GENERATOR();

  @ViewChild('Pagination') pagination?: PaginationComponent;
  @ViewChild('FormMenu') tableFormMenu!: TableFormMenuComponent;
  @ViewChild('MenuTriggerAddButton') menuTriggerAddButton?: MatMenuTrigger;
  @ViewChild('PrintableTable') printableTable!: PrintableTableComponent;
  @ViewChild('Table') tableElement!: ElementRef<HTMLElement>;
  @ViewChild('ActionCol') actionCol!: TableColActionComponent;

  @Input('options') rawOptions: TableClass<T> | TableOptions<T> = this.TABLE_DEFAULTS as TableOptions<T>;

  @Output() add = new EventEmitter<TableButtonEvent>();
  @Output() clickRow = new EventEmitter<T>();
  @Output() export = new EventEmitter<TableExportOutput>();

  private _sessionSubs = new Subscription();
  private _eventSub?: Subscription;
  private _printSub?: Subscription;
  private _exportSub?: Subscription;
  private _fetchSub?: Subscription;
  private _refreshTrigger$ = new Subject();
  private _dataSource$ = new BehaviorSubject<TableRow<T>[] | undefined>(undefined);
  private _class?: TableClass<T>;

  protected trackByProp = (index: number, item: TableColumnData<any>) => item.prop;
  protected trackByItem: TrackByFunction<any> = (index: number, item: TableRow<T>) => `${item.id}${item.mutation}`;
  protected isFirstLoad = signal(true);

  dataSource: CdkTableDataSourceInput<TableRow<T> | undefined> = this._dataSource$.pipe(map((t) => t ?? []));
  tableRawResponse$ = new BehaviorSubject<any>(undefined);

  options = signal<TableOptions<T>>(this.TABLE_DEFAULTS);
  totalItems = signal(0);
  lastRequestOptions = signal<DataGetRequest | undefined>(undefined);
  loading = signal(true);
  initialized = signal(false);
  hiddenColsArray = signal<(keyof T)[]>([]);
  highlightedRowsArray = signal<(string | number)[]>([]);

  // if undefined, pagination is disabled
  paginationOptions = computed(
    () => (!this.options().pagination ? null : this.options().pagination) as TablePagination,
  );

  hiddenCols = computed(() =>
    this.hiddenColsArray().reduce(
      (pre, cur) => {
        pre[cur] = true;
        return pre;
      },
      {} as { [key in keyof T]: boolean },
    ),
  );
  highlightedRows = computed(() =>
    this.highlightedRowsArray().reduce(
      (pre, cur) => {
        pre[cur] = true;
        return pre;
      },
      {} as { [key: string | number]: boolean },
    ),
  );
  columns = computed<TableColumnData<T>[]>(() =>
    Object.entries(this.options().columns).map(([key, value]) => ({
      prop: key,
      isHidden: this.hiddenCols()[key as keyof T] ?? false,
      ...value,
    })),
  );
  actions = computed<TableAction<T>[]>(() => {
    const actions = this.options().actions ?? [];
    return actions.map((action) => this.actionAutoPermissionize(action));
  });
  bulkActions = computed<ItemRecord<TableBulkAction<T>>[]>(() =>
    (this.options().bulkActions ?? []).map((t) => ({ label: t.content, value: t })),
  );
  isActionHidden = computed(
    () => this.hiddenColsArray().includes(TABLE_COL_ACTION_PROP as any) || this.actions().length === 0,
  );
  hasFilter = computed(() => this.columns().some((v) => v.filterable));
  columnsLabels = computed<string[]>(() => {
    const isActionHidden = this.isActionHidden();
    const cols = this.columns()
      .filter((t) => !t.isHidden)
      .map((x) => x.prop);

    cols.unshift(
      ...([
        this.options().selectable ? TABLE_COL_SELECTION_PROP : undefined,
        this.options().showIndex ? TABLE_COL_INDEX_PROP : undefined,
      ].filter((x) => !!x) as string[]),
    );
    if (!isActionHidden) {
      cols.push(TABLE_COL_ACTION_PROP);
    }

    return cols;
  });

  constructor() {
    this._refreshTrigger$.pipe(takeUntilDestroyed(), debounceTime(50)).subscribe(() => {
      this._refresh();
    });

    effectDep(this.options, () => {
      this._sessionSubs.unsubscribe();
      this._sessionSubs = new Subscription();
      this._sessionSubs.add(
        this.options().sortModel!.changes$.subscribe(() => {
          this.onSort();
        }),
      );
      this._sessionSubs.add(
        this.options().filterModel!.changes$.subscribe(() => {
          this.onFilter();
        }),
      );
      if (!this.initialized()) return;
      this.refresh();
    });

    effectDep(this.columns, (columns) => {
      const options = this.options();
      options.filterModel?.setColumns(columns);
    });
  }

  ngOnInit() {
    this.setOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rawOptions'] && !changes['rawOptions'].firstChange) {
      this.setOptions();
    }
  }

  ngAfterViewInit() {
    this.actionCol.onVisible$.pipe(take(1)).subscribe((isVisible) => {
      this.setHidden(!isVisible, TABLE_COL_ACTION_PROP as any);
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.initialized.set(true);
      this.refresh();
    }, 50);
  }

  ngOnDestroy() {
    this._sessionSubs.unsubscribe();
    this._eventSub?.unsubscribe();
  }

  print() {
    const printOptions = this.options()?.print;
    const originalColumns = this.columns();
    let columns: TablePrintOptionsCol<T>[] = [];
    if (typeof printOptions === 'object' && printOptions.cols && printOptions.cols.length) {
      for (const col of printOptions.cols) {
        if (typeof col === 'string') {
          const foundCol = originalColumns.find((t) => t.prop === col);
          if (!foundCol) continue;
          columns.push(foundCol);
          continue;
        }
        columns.push(col);
      }
    } else {
      columns = originalColumns;
    }

    const items = this.invokeAdapter({
      ...this.lastRequestOptions(),
      pagination: {
        page: 1,
        size: 999999,
      },
    });

    return items.pipe(
      switchMap((value) => {
        const items = this.mapResponseToItems(value.result);

        const header: string[] = [];
        for (const col of columns) {
          header.push(col.label);
        }

        const rows: string[][] = [];
        for (const item of items) {
          const newItem: string[] = [];
          for (const col of columns) {
            const value = this.getPropertyValue(item, col.prop);
            const transformedValue = this.transformValue(value, item, col);
            newItem.push(transformedValue);
          }
          rows.push(newItem);
        }

        const extra: ItemRecord<string | number>[] = [];
        extra.push({ value: value.totalItems.toString(), label: $localize`:@@base.feature.table.extras.total:تعداد کل` });
        if (typeof printOptions === 'object' && printOptions.extra) {
          extra.push(...printOptions.extra(value.result));
        }

        return this.printableTable.print({
          header,
          rows,
          extra,
        });
      }),
    );
  }

  getCurrentItems() {
    return this._dataSource$.value;
  }

  getCurrentItems$() {
    return this._dataSource$;
  }

  scrollToRowById(id: number | string | undefined) {
    if (id === undefined) return;
    const el = this.getRowsElementList().find((t) => t.dataset['id'] === id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  scrollToRowByIndex(index: number) {
    const el = this.getRowsElementList().at(index);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setHighlighted(...ids: (string | number | undefined)[]) {
    this.highlightedRowsArray.set(ids.filter((t) => t !== undefined) as (string | number)[]);
  }
  clearHighlights() {
    this.highlightedRowsArray.set([]);
  }

  refresh() {
    this._refreshTrigger$.next(null);
  }

  hide(...keys: (keyof T)[]) {
    this.setHidden(true, ...keys);
  }
  show(...keys: (keyof T)[]) {
    this.setHidden(false, ...keys);
  }

  setHidden(state: boolean, ...cols: (keyof T)[]) {
    const current = this.hiddenColsArray();

    for (const col of cols) {
      const index = current.indexOf(col);

      if (state && index === -1) {
        current.push(col);
      } else if (!state && index !== -1) {
        current.splice(index, 1);
      }
    }
    this.hiddenColsArray.set([...current]);
  }

  getRowsElementList() {
    return Array.from(this.tableElement.nativeElement.querySelectorAll('tbody > tr')) as HTMLTableRowElement[];
  }

  getItem(id: number | string) {
    const currentData = this._dataSource$.value;
    if (!currentData) return null;
    const index = currentData.findIndex((t) => t.id === id);
    if (index === -1) return;
    return currentData[index];
  }

  mutateItem(id: number | string, newData: Partial<T>) {
    const currentData = this._dataSource$.value;
    if (!currentData) return;
    const index = currentData.findIndex((t) => t.id === id);
    if (index === -1) return;

    const currentItem = currentData[index];
    currentData[index] = this.mapItemToRow(
      {
        ...currentItem.originalItem,
        ...newData,
      },
      currentItem.mutation + 1,
    );

    this._dataSource$.next(currentData);
  }

  setOptions() {
    let rawOpts;
    if (this.rawOptions instanceof TableClass) {
      this._class = this.rawOptions;
      this._class.setRef(this);
      rawOpts = this._class.options;
    } else {
      rawOpts = this.rawOptions;
    }

    if (!rawOpts) return;

    const opt = {
      ...this.TABLE_DEFAULTS,
      ...rawOpts,
      view: {
        ...this.TABLE_DEFAULTS.view,
        ...rawOpts.view,
      },
    };
    if (opt.bulkActions?.length) {
      opt.selectable = true;
    }
    this.options.set(opt);
  }

  protected onAction(item: T, action: TableAction<T>, trigger: MatMenuTrigger, e?: ButtonClickEvent) {
    const result = action.action(item, {
      ...this.createTableDialogParam('edit'),
      ...this.createTableMenuParam('edit', trigger),
    });

    this.subscribeToEventResult(result, () =>
      pipe(
        tap(() => {
          this.options().selectionModel?.clear();
        }),
        e?.pipe() ?? pipe(),
      ),
    );
  }

  protected onBulkActionApply(bulkAction: any, e: ButtonClickEvent) {
    if (!bulkAction) return;

    const selectedItems = this.options().selectionModel?.selected() ?? [];
    if (selectedItems.length === 0) return;

    const result = bulkAction.action(selectedItems, this.createTableStateParam());
    this.subscribeToEventResult(result, () =>
      pipe(
        tap(() => {
          // this.batchActionControl.setValue(undefined);
          this.options().selectionModel?.clear();
        }),
      ),
    );
  }

  protected onAdd(e: ButtonClickEvent) {
    if (this.options().events?.add) {
      const result = this.options().events!.add!({
        ...this.createTableDialogParam('create'),
        ...this.createTableMenuParam('create', this.menuTriggerAddButton!),
      });

      this.subscribeToEventResult(result);
    }
  }

  protected onRowClick(row: T) {
    if (this.options().clickableRows) {
      this.clickRow.emit(row);
    }
  }

  protected onExport(e: ButtonClickEvent) {
    this._exportSub?.unsubscribe();
    this._exportSub = this.options().export!(this.lastRequestOptions()).pipe(e.pipe()).subscribe();
  }

  protected onPaginate() {
    if (this.initialized()) this.refresh();
  }

  protected onSort() {
    this.pagination?.set(0);
    this.refresh();
  }

  protected onFilter() {
    this.pagination?.set(0);
    this.refresh();
  }

  protected onPrint(e: ButtonClickEvent) {
    this._printSub?.unsubscribe();
    this._printSub = this.print().pipe(e.pipe()).subscribe();
  }

  protected onRefresh() {
    this.refresh();
  }

  protected onHeaderSelection(checked: boolean) {
    checked ? this.options().selectionModel!.selectAll() : this.options().selectionModel!.deselectAll();
    // this.cdr.detectChanges();
  }

  protected onItemSelection(item: T, checked: boolean) {
    checked ? this.options().selectionModel?.select(item) : this.options().selectionModel!.deselect(item);
    // this.cdr.detectChanges();
  }

  private invokeAdapter(data: DataGetRequest) {
    const items = this.options().itemsFn ? this.options().itemsFn!(data) : [];

    return (items instanceof Array ? of(items) : items).pipe(
      map((result) => {
        let totalItems: number;
        if (!result) {
          totalItems = 0;
        } else if (result instanceof Array) {
          totalItems = result.length;
        } else {
          totalItems = result.pagination.total;
        }
        return {
          result,
          totalItems,
        };
      }),
    );
  }

  private mapResponseToItems(result: DataGetResponse<T> | T[]) {
    return (result instanceof Array ? result : result?.data) ?? [];
  }

  private mapItemToCol(item: T, col: TableColumnData<T>): TableRowData {
    const value = this.getPropertyValue(item, col.prop);
    const transformedValue = this.transformValue(value, item, col);
    let value$;
    const valueState$ = new BehaviorSubject(transformedValue);
    if (col.transform$) {
      const transformerFn = this.colToTransformFn(col);
      value$ = col.transform$?.(value, item, transformerFn)?.pipe(tap((v) => valueState$.next(v)));
    }

    return {
      rawValue: value,
      value: transformedValue,
      value$: value$?.pipe(map((v) => this.transformValue(v, item, col))),
      dynamicClass: `${col.dynamicClass?.(value, item) ?? ''} ${col.class ?? ''}`,
      dynamicClass$: col.dynamicClass
        ? value$?.pipe(map((v) => `${col.dynamicClass!(v, item)} ${col.class ?? ''}`))
        : undefined,
      isValueTrue: this.isValueTrue(value),
      isValueTrue$: value$?.pipe(map((t) => this.isValueTrue(t))),
      getValue: () => valueState$.value,
    };
  }

  private mapItemToRow(item: T, mutation?: number) {
    const newItem: TableRow<T> = {
      id: this.options().itemToIdFn!(item),
      data: {},
      originalItem: item,
      actions: {},
      mutation: mutation ?? 0,
    };
    for (const col of this.columns()) {
      const mapped = this.mapItemToCol(item, col);
      newItem.data[col.prop] = mapped;

      const isHidden = typeof col.hide === 'function' ? col.hide(mapped.value, item) : (col.hide ?? false);
      this.setHidden(isHidden, col.prop as any);
    }
    this.actions().forEach((action, index) => {
      newItem.actions[index] = {
        disabled$: action.disabled$?.(item),
        disabled: action.disabled?.(item),
        permission: typeof action.permission === 'function' ? action.permission(item) : action.permission,
      };
    });
    return newItem;
  }

  private _refresh() {
    const options = this.options();

    if (options.itemsFn === undefined) {
      return;
    }

    // Cancel the previous request
    this._fetchSub?.unsubscribe();

    this.loading.set(true);
    this.options().events?.refresh?.();

    let data: DataGetRequest = {
      pagination: {
        page: this.pagination?.page?.(),
        size: this.pagination?.size() ?? -1,
      },
      sort: options.sortModel?.create(),
      filters: options.filterModel?.create(),
    };

    if (options.transformRequest) {
      data = options.transformRequest(data);
    }

    this.lastRequestOptions.set(data);

    this._fetchSub = this.invokeAdapter(data)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        map((value) => {
          const result = value.result;
          this.options().events?.response?.(result);
          const items = this.mapResponseToItems(result);
          this._class?.items$?.next(items);

          this.tableRawResponse$.next(result);
          this.totalItems.set(value.totalItems);

          this.options().selectionModel?.setItems(items);
          this.options().selectionModel?.setTotalCount(value.totalItems);

          // If total pages mismatched the current selected page, simply change the page.
          if ('pagination' in result && result.pagination.totalPages !== undefined) {
            const currentPage = this.pagination?.page() ?? 0;
            if (result.pagination.totalPages !== 0 && currentPage > 1 && result.pagination.totalPages < currentPage) {
              this.pagination?.set(result.pagination.totalPages - 1);
              throw new TablePaginationMismatchError();
            }
          }

          return items;
        }),
        map((result) => result.map((item) => this.mapItemToRow(item))),
        tap((items) => {
          this._dataSource$.next(items);
          this.loading.set(false);
          if (this.isFirstLoad()) {
            this.isFirstLoad.set(false);
          }
        }),
        catchError((err) => {
          if (err instanceof TablePaginationMismatchError) {
            console.warn(err.message);
            return NEVER;
          }
          throw err;
        }),
      )
      .subscribe();
    this.cdr.detectChanges();
  }

  private actionAutoPermissionize(action: TableAction<T>): TableAction<T> {
    const currentActionType = action.actionType;
    if (currentActionType) return action;

    switch (action.content) {
      case 'edit':
      case 'update':
        return {
          ...action,
          actionType: 'update',
        };

      default:
        return action;
    }
  }

  private getPropertyValue(object: any, key: string) {
    const segments = key.split('.');
    let result = object;
    for (const key of segments) {
      result = result?.[key];
      if (result === undefined || result === null) break;
    }
    return result;
  }

  private transformValue(value: any, row: T, col: TableColumn<T>) {
    const valueToItemTransform = (value: any) => {
      if ((col.items?.length ?? 0) === 0) return value;
      if (value instanceof Array) {
        return col.items!.filter((x) => value.includes(x.value)).map((x) => x.label);
      } else {
        return col.items!.find((x) => x.value === value)?.label;
      }
    };
    const emptyValueTransform = (value: any) => {
      return this.isValueEmpty(value) ? this.EMPTY_VALUE : value;
    };

    let newValue = value;

    const transformerFn = this.colToTransformFn(col);

    if (col.type === 'number') {
      newValue = transformerFn(newValue);
    }
    if (col.transform) {
      newValue = col.transform(newValue, row, transformerFn);
    } else {
      newValue = transformerFn(newValue);
    }

    if (col.items) {
      newValue = valueToItemTransform(newValue);
    }
    newValue = emptyValueTransform(newValue);

    return newValue;
  }

  private isValueTrue(value: any) {
    return typeof value === 'number'
      ? value === 1
      : typeof value === 'string'
        ? value === this.ACTIVE_STRING_VALUE
        : !!value;
  }

  private isValueEmpty(value: any) {
    return value === '' || value === undefined || value === null || (value instanceof Array && !value.length);
  }

  private colToTransformFn(col: TableColumn<T>) {
    switch (col.type ?? 'text') {
      case 'number':
        return (value: any) => {
          if (value === undefined || value === null) return value;

          const digitsInfo = '1.0-0';
          const locale = 'en';

          const parsed = typeof value !== 'number' ? parseInt(value) : value;
          if (parsed === value) {
            return formatNumber(value, locale, digitsInfo);
          } else {
            return `${value}`.replace(`${parsed}`, formatNumber(parsed, locale, digitsInfo));
          }
        };

      case 'boolean':
        return (value: any) => {
          return value ? this.TRUE_TEXT : this.FALSE_TEXT;
        };

      case 'status':
        return (value: any) => {
          const status =
            typeof value === 'number'
              ? value === 1
              : typeof value === 'string'
                ? value === this.ACTIVE_STRING_VALUE
                : value;
          return status ? this.ACTIVE_TEXT : this.INACTIVE_TEXT;
        };

      case 'date':
        return (value: any) => {
          if (this.isValueEmpty(value)) return this.EMPTY_VALUE;
          return dateFns.format(new Date(value), 'yyyy/MM/dd');
        };

      case 'datetime':
        return (value: any) => {
          if (this.isValueEmpty(value)) return this.EMPTY_VALUE;
          const format = dateFns.format(new Date(value), 'yyyy/MM/dd HH:mm').split(' ');
          return `${this.DATE_TEXT} ${format[0]} \n ${this.HOURS_TEXT} ${format[1]}`;
        };

      case 'minutes':
        return (value: any) => {
          const hours = Math.floor(value / 60);
          const minutes = value % 60;
          return `${hours > 0 ? `${hours} ${this.HOURS_AND_TEXT} ` : ''}${minutes} ${this.MINUTES_TEXT}`;
        };

      case 'plate':
        return (value: any) => {
          return `${value.slice(6)} ${this.PLATE_COUNTRY_TEXT} ${value.slice(3, 6)} ${value.slice(2, 3)} ${value.slice(0, 2)}`;
        };

      default:
        return (value: any) => value;
    }
  }

  private createTableStateParam() {
    const e = {
      setLoader: (loading) => this.loading.set(loading),
      refresh: () => this.refresh(),
    } as TableStateParams;
    return e;
  }

  private createTableMenuParam(mode: 'create' | 'edit', trigger: MatMenuTrigger) {
    return {
      openMenu: (opt, value) =>
        this.tableFormMenu.openFormMenu(trigger, {
          itemName: this.options().view!.itemName,
          mode: mode,
          formBuilder: opt as any,
          value,
        }),
    } as TableMenuParams;
  }

  private createTableDialogParam(mode: 'create' | 'edit') {
    return {
      openDialog: (formBuilder, value) => {
        formBuilder.reset(value);

        return dialog$
          .input({
            title:
              mode === 'create'
                ? `${this.ADD_TEXT} ${this.options().view!.itemName} ${this.NEW_TEXT}`
                : `${this.EDIT_TEXT} ${this.options().view!.itemName}`,
            subtitle: $localize`:@@base.feature.table.createDialog.subtitle:مشخصات را وارد کنید و دکمه ذخیره را بزنید`,
            deleteButton: true,
            formBuilder,
          })
          .setActionType(mode === 'edit' ? 'update' : 'create');
      },
    } as TableDialogParams;
  }

  private subscribeToEventResult(result: void | Observable<any>, morePipe?: () => UnaryFunction<any, any>) {
    if (result instanceof Observable) {
      this._eventSub = result
        .pipe(
          tap(() => {
            this.refresh();
          }),
          morePipe?.() ?? pipe(),
        )
        .subscribe({
          error: (e) => {
            if (e) {
              console.error(e);
            }
          },
        });
    }
  }
}
