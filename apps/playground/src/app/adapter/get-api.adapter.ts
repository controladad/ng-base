import {
  APIPaginatedData,
  DataGetFn, DataGetFnResponse,
  DataGetOptions,
  DataGetRequest,
  DataGetResponse,
  DataSortDirection, toPascalCase
} from '@controladad/ng-base';
import { map, Observable } from 'rxjs';

const PAGE_INDEX_PARAM = 'Pagination.Page';
const PAGE_SIZE_PARAM = 'Pagination.AmountOfListPerPage';
const SORT_BY_PARAM = 'SortItem';
const SORT_DIR_PARAM = 'IsAsc';
const FILTER_KEY = 'Filters';

const SORT_DIR_MAPPER = (dir: DataSortDirection | undefined) => (dir === 'asc' ? true : false);

// Map APIs response to DataGetResponse interface which is a generalized model used in the code base
const RESPONSE_MAPPER = <T>(response: APIPaginatedData<T> | T[]) => {
  let result: DataGetResponse<T>;
  if (response instanceof Array) {
    result = {
      data: response,
      pagination: {
        page: 1,
        size: response.length,
        total: response.length,
        totalPages: 1,
      },
    };
  } else {
    let objToSearch = response;

    const responseObjValues = Object.values(objToSearch);
    if (responseObjValues.length === 1 && typeof responseObjValues[0] === 'object') {
      objToSearch = responseObjValues[0];
    }

    let dataKey: string | undefined = 'data';
    let data = dataKey in objToSearch ? objToSearch.data : undefined;

    let extra: any = undefined;
    if (!data) {
      const entry = Object.entries(objToSearch).find(([_, v]) => v instanceof Array);
      dataKey = entry?.[0];
      data = entry?.[1];
    }

    for (const [key, value] of Object.entries(objToSearch)) {
      if (key === dataKey || key === 'pagination') continue;
      if (!extra) {
        extra = {};
      }
      extra[key] = value;
    }

    result = {
      data: data ?? [],
      pagination: {
        page: objToSearch.pagination.page,
        total: objToSearch.pagination.total,
        size: objToSearch.pagination.amountOfListPerPage,
        totalPages: objToSearch.pagination.pageCount,
      },
      extra,
    };
  }
  return result;
};

// Returns a function which can be used as an adapter for components such as Table.
export function GetApiAdapter<T>(url: string, opts?: DataGetOptions<T>): DataGetFn<T> {
  return (req) => GetApiAdapterRequestBuild(url, req, opts);
}

// Directly request through the adapter without creating a middleware function
export function GetApiRequest<T>(url: string, reqOptions?: DataGetRequest, opts?: DataGetOptions<T>): Observable<T[]> {
  return GetApiAdapterRequestBuild(url, reqOptions, opts).pipe(
    map((result) => (result instanceof Array ? result : result.data)),
  );
}

// Create and return get request observable for the adapters
function GetApiAdapterRequestBuild<T>(
  url: string,
  reqOptions?: DataGetRequest,
  opts?: DataGetOptions<T>,
): DataGetFnResponse<T> {
  const query = GetApiAdapterOptionsToQueryParam(reqOptions, opts?.default);
  return http$
    .get<APIPaginatedData<T> | T[]>(`${url}${!url.includes('?') ? '?' : !url.endsWith('&') ? '&' : ''}${query}`)
    .pipe(map(opts?.mapFn ?? RESPONSE_MAPPER));
}

export function GetApiAdapterOptionsToQueryParam(reqOptions?: DataGetRequest, defaultOptions?: DataGetRequest) {
  const params: string[] = [];

  reqOptions = requestOptionsMerge(reqOptions, defaultOptions);

  if (reqOptions?.pagination && reqOptions?.pagination.size > 0) {
    params.push(`${PAGE_INDEX_PARAM}=${reqOptions.pagination.page ?? 1}`);
    params.push(`${PAGE_SIZE_PARAM}=${reqOptions.pagination.size}`);
  }

  if (reqOptions?.sort) {
    const sortKeyPascalCase = toPascalCase(reqOptions.sort.key);
    const key = `${sortKeyPascalCase}`;
    params.push(`${SORT_BY_PARAM}=${key}`);
    params.push(`${SORT_DIR_PARAM}=${SORT_DIR_MAPPER(reqOptions.sort.direction)}`);
  }

  if (reqOptions?.filters) {
    const filters: { [p: string]: (number | string)[] } = {};
    for (const filter of reqOptions.filters) {
      if (filter.value === undefined) continue;

      let filterKeyPascalCase = toPascalCase(filter.key);
      if (!filter.strictKey) {
        filterKeyPascalCase = `${filterKeyPascalCase}${
          filter.type === 'greater' ? 'GT' : filter.type === 'lower' ? 'LT' : ''
        }`;
      }
      const param = `${FILTER_KEY}.${filterKeyPascalCase}`;
      const value = filter.value instanceof Array ? filter.value : [filter.value];
      if (param in filters) {
        filters[param].push(...value);
      } else {
        filters[param] = [...value];
      }
    }

    Object.entries(filters).forEach(([key, value]) => {
      params.push(`${value.map((val) => `${key}=${val}`).join('&')}`);
    });
  }

  return `${params.join('&')}`;
}

function requestOptionsMerge(
  main: DataGetRequest | undefined,
  defaults: DataGetRequest | undefined,
): DataGetRequest | undefined {
  if (!main || !defaults) return main ?? defaults;

  const newOptions: DataGetRequest = {
    filters: defaults.filters ? [...defaults.filters] : undefined,
    pagination: defaults.pagination
      ? {
          ...defaults.pagination,
        }
      : undefined,
    sort: defaults.sort ? { ...defaults.sort } : undefined,
  };
  if (!newOptions.filters) {
    newOptions.filters = [];
  }

  if (main.pagination) {
    newOptions.pagination = {
      ...newOptions.pagination,
      ...main.pagination,
    };
  }

  if (main.sort) {
    newOptions.sort = {
      ...newOptions.sort,
      ...main.sort,
    };
  }

  if (main.filters) {
    for (const item of main.filters ?? []) {
      const index = newOptions.filters.findIndex((t) => t.key === item.key);
      if (index !== -1) {
        newOptions.filters.splice(index, 1);
      }
      newOptions.filters.push(item);
    }
  }

  return newOptions;
}
