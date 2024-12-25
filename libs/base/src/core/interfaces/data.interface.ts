import { Observable } from 'rxjs';

export type DataSortDirection = 'asc' | 'desc';

export type DataFilterTypes = 'equal' | 'contains' | 'greater' | 'lower';

export type DataGetRequest = {
  pagination?: {
    // If size is 0 or less, pagination will be ignored.
    size: number;
    page?: number;
  };
  sort?: {
    key: string;
    direction?: DataSortDirection;
  };
  filters?: {
    key: string;
    strictKey?: boolean;
    value: string | number | (string | number)[] | undefined;
    type?: DataFilterTypes;
  }[];
};

export type DataGetOptions<T> = {
  mapFn?: (x: any) => DataGetResponse<T>;
  default?: DataGetRequest;
};

export interface DataGetResponse<T> {
  data: T[];
  pagination: {
    total: number;
    size: number;
    page: number;
    totalPages: number;
  };
  extra?: any;
}

export type DataGetFnResponse<T> = Observable<DataGetResponse<T> | T[]>;

export type DataGetFn<T> = (options?: DataGetRequest) => DataGetFnResponse<T>;
