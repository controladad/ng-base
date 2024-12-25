import { Observable } from 'rxjs';
import { FormBuilder, FormBuilderInputType } from '../form-builder';
import {
  ActionTypes,
  DataFilterTypes,
  DataGetFn,
  DataGetRequest,
  DataGetResponse,
  DataSortDirection,
  ItemRecord,
  ItemRecords$,
  ItemToId,
} from '../../../../core';
import { ButtonAppearanceType, ButtonClickEvent, ButtonThemeType, FieldInputType } from '../../ui';
import { SelectionModel, SortModel, TableFilterModel } from '../../../classes';
import { InputDialogExtended } from '../dialog';
import { MatMenuTrigger } from '@angular/material/menu';

export type TableColumnType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'status'
  | 'button'
  | 'plate'
  | 'tag'
  | 'date'
  | 'datetime'
  | 'minutes';

export type TableRefreshFn = () => void;

export type TableActionFn<T> = (item: T, e: TableActionEvent) => void | Observable<any>;

export type TableBatchActionFn<T> = (items: T[], e: TableStateParams) => void | Observable<any>;

export type TableFormOptions<T, U = T> = {
  // title?: string;
  mode?: 'create' | 'edit';
  formBuilder: FormBuilder<T, U>;
  itemName?: string;
  value?: Partial<T>;
};

export type TableMenu<T> = {
  trigger: MatMenuTrigger;
  onClose: Observable<any>;
  action: (action: (model: T) => Observable<any>) => Observable<any>;
};

export type TableMenuParams = {
  openMenu: <T, U>(options: FormBuilder<T, U>, value?: Partial<T>) => TableMenu<T>;
};

export type TableDialogParams = {
  openDialog: <T, U>(formBuilder: FormBuilder<T, U>, value?: Partial<T>) => InputDialogExtended<T, U>;
};

export type TableStateParams = {
  setLoader: (loading: boolean) => void;
  refresh: TableRefreshFn;
};

export type TableAddEvent = TableMenuParams & TableDialogParams;
export type TableActionEvent = TableMenuParams & TableDialogParams;

export type TableFilterOptions = {
  type: DataFilterTypes;
  key?: string;
  label?: string;
  icon?: string;
  controlType?: FormBuilderInputType;
  inputType?: FieldInputType;
  items?: ItemRecords$<any>;
  multiple?: boolean;
};
export type TableColumnFilter = string | boolean | TableFilterOptions[];

export interface TableColumn<T> {
  label: string;
  // second label
  icon?: string;
  hint?: string;
  width?: string;
  type?: TableColumnType;
  // if string provided, it will be used as the sort key instead of the prop
  sortable?: boolean | string;
  // if string provided, it will be used as the filter key instead of the prop
  filterable?: TableColumnFilter;
  class?: string;
  dynamicClass?: (value: any, row: T) => string;
  transform?: (value: any, row: T, transformFn: (value: any) => any) => any;
  transform$?: (value: any, row: T, transformFn: (value: any) => any) => Observable<any>;
  hide?: boolean | ((value: any, row: T) => boolean);
  items?: ItemRecord<any>[];
  onClick?: (row: T, e: ButtonClickEvent) => void;
}

export interface TablePrintOptionsCol<T> {
  prop: string;
  label: string;
  type?: TableColumnType;
  transform?: TableColumn<T>['transform'];
}

export interface TablePrintOptions<T> {
  cols?: (string | TablePrintOptionsCol<T>)[];
  extra?: (response: DataGetResponse<T> | T[]) => ItemRecord<string | number>[];
}

export interface TableAction<T> {
  type: 'icon' | 'text' | 'button';
  theme?: ButtonThemeType;
  appearance?: ButtonAppearanceType;
  class?: string;
  content?: string;
  action: TableActionFn<T>;
  actionType?: ActionTypes;
  permission?: string | ((item: T) => string | undefined);
  disabled$?: (item: T) => Observable<boolean>;
  disabled?: (item: T) => boolean;
  badge?: (item: T) => string;
}

export interface TableBatchAction<T> {
  content: string;
  action: TableBatchActionFn<T>;
  disabled$?: () => Observable<boolean>;
}

export interface TableButtonEvent {
  setLoader: (loading: boolean) => void;
  refreshTable: TableRefreshFn;
}

export interface TableExportOutput {
  sortItem?: string;
  ascDesc?: DataSortDirection;
  print?: boolean;
  event: ButtonClickEvent;
}

type ColumnKeyIndex<T> = keyof Partial<T> | string;

export interface TableOptions<T extends object> {
  itemsFn: DataGetFn<T> | undefined;
  // This function transforms an item into a unique identifier, defaults to: (item) => item.id || item
  itemToIdFn?: ItemToId<T>;
  columns: { [p in ColumnKeyIndex<T>]: TableColumn<T> };
  actions?: TableAction<T>[];
  batchActions?: TableBatchAction<T>[];
  showIndex?: boolean;
  // set to -1 to disable pagination
  pageSize?: number;
  export?: (options: DataGetRequest | undefined) => Observable<any>;
  print?: boolean | TablePrintOptions<T>;
  clickableRows?: boolean;
  selectable?: boolean;
  selectionModel?: SelectionModel<T>;
  filterModel?: TableFilterModel;
  sortModel?: SortModel;
  view?: {
    title?: string;
    itemName?: string;
    addButtonText?: string;
    actionsText?: string;
  };
  transformRequest?: (request: DataGetRequest) => DataGetRequest;
  events?: {
    // returning observable to this event, will automatically refresh the table
    add?: (e: TableAddEvent) => Observable<any> | void;
    response?: (e: DataGetResponse<T> | T[]) => void;
    refresh?: () => void;
  };
}
