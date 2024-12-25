import { map, Observable } from 'rxjs';
import { DataGetFn, DataGetFnResponse, DataGetRequest } from '../interfaces';
import * as dateFns from 'date-fns';

export function GetOfflineAdapter<T>(request$: Observable<T[]>): DataGetFn<T> {
  return (options) => {
    return GetOfflineAdapterRequest(request$, options);
  };
}

export function GetOfflineAdapterRequest<T>(request$: Observable<T[]>, options?: DataGetRequest): DataGetFnResponse<T> {
  return request$.pipe(
    map((result) => {
      let data = result;
      if (!options) {
        return data;
      }

      if (options.sort) {
        const sort = options.sort;
        data = data.sort((a, b) => {
          const valueA = getObjectByPath(a, sort.key);
          const valueB = getObjectByPath(b, sort.key);
          return typeof valueA === 'string'
            ? sort.direction === 'asc'
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA)
            : sort.direction === 'desc'
              ? valueA > valueB
                ? 1
                : -1
              : valueA < valueB
                ? 1
                : -1;
        });
      }

      if (options.filters) {
        options.filters.forEach((filter) => {
          const filterValueString = (filter.value || '').toString();
          const dateValue = new Date((filter.value || '').toString());
          const isDate =
            filter.value instanceof Array
              ? false
              : dateFns.isValid(dateValue) && (filterValueString.includes('/') || filterValueString.includes('-'));
          switch (filter.type) {
            case 'contains':
              data = data.filter((x: any) => {
                const itemValue = getObjectByPath(x, filter.key);
                return filter.value instanceof Array
                  ? filter.value.every((term) => itemValue.includes(term))
                  : itemValue.includes(filter.value);
              });
              break;
            case 'equal':
              data = isDate
                ? data.filter((x: any) => {
                    const val = new Date(getObjectByPath(x, filter.key));
                    // If the difference is below 24hours
                    return (
                      Math.abs(val.getTime() - dateValue.getTime()) < 24 * 60 * 60 * 1000 &&
                      val.getDate() === dateValue.getDate()
                    );
                  })
                : data.filter((x: any) => {
                    const itemValue = getObjectByPath(x, filter.key);
                    if (typeof itemValue === 'boolean') {
                      return (
                        (itemValue && filter.value && filter.value === 'true') ||
                        (!itemValue && (filter.value === 'false' || !filter.value))
                      );
                    } else {
                      return filter.value instanceof Array
                        ? filter.value.some((t) => itemValue.toString() === t)
                        : itemValue.toString() === filter.value;
                    }
                  });
              break;
            case 'lower':
              data = isDate
                ? data.filter((x: any) => dateFns.isBefore(new Date(getObjectByPath(x, filter.key)), dateValue))
                : data.filter(
                    (x: any) =>
                      x[filter.key] < (typeof filter.value === 'string' ? filter.value || '' : filter.value || 0),
                  );
              break;
            case 'greater':
              data = isDate
                ? data.filter((x: any) => dateFns.isAfter(new Date(getObjectByPath(x, filter.key)), dateValue))
                : data.filter(
                    (x: any) =>
                      x[filter.key] > (typeof filter.value === 'string' ? filter.value || '' : filter.value || 0),
                  );
              break;
            default:
              break;
          }
        });
      }

      const pageSize = options.pagination?.size || 10;
      const start = ((options.pagination?.page || 1) - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = (data.slice(start, end) || []) as T[];

      return {
        data: paginatedData,
        pagination: {
          total: data.length,
          size: pageSize,
          page: options.pagination?.page || 1,
          totalPages: Math.ceil(data.length / pageSize),
        },
      };
    }),
  );
}

function getObjectByPath(obj: any, path: string) {
  const segments = path.split('.');
  let currentObj = obj;
  for (const key of segments) {
    if (currentObj === undefined || currentObj === null) {
      return currentObj;
    }
    currentObj = currentObj[key];
  }
  return currentObj;
}
