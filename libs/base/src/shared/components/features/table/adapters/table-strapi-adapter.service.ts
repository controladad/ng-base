import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface StrapiOptions {
  search?: StrapiSearch[];
  sort?: StrapiSort[];
  pagination?: {
    page: number;
    perPage: number;
  };
  filters?: StrapiFilter[];
}
export interface StrapiSearch {
  strategy?: 'eq' | 'contains' | 'lte' | 'gte' | 'notNull' | 'null';
  key: string;
  term: string;
  operator?: 'or' | 'and';
  customKeyUsed?: boolean;
}
export interface StrapiSort {
  key: string;
  direction: 'asc' | 'desc';
  customKeyUsed?: boolean;
}
export interface StrapiFilter {
  key: string;
  terms?: string | string[];
  /* Default strategy is 'in' */
  strategy?: 'eq' | 'ne' | 'in' | 'gte' | 'lte' | 'notNull' | 'null';
  /* write the param you want except "filters" key */
  andConditionParam?: string;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {
    // ...
  };
}

export interface StrapiPaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

const StrapiIgnorableProps = ['attributes', 'data'];

@Injectable({
  providedIn: 'root',
})
export class TableStrapiAdapter {
  private readonly http = inject(HttpClient);

  createGetRequest<T>(
    url: string,
    mapFn?: (x: any) => StrapiPaginatedResponse<T>,
  ): (options?: StrapiOptions) => Observable<StrapiPaginatedResponse<T> | T[]> {
    return (options) => this.strapiFetchRequest(url, undefined, mapFn, options);
  }

  createPostRequest<T>(
    url: string,
    body: any,
    requestOptions?: any,
  ): (options?: StrapiOptions) => Observable<StrapiPaginatedResponse<T> | T[]> {
    return (options) => this.strapiFetchRequest(url, body, undefined, options, requestOptions);
  }

  createSearchRequest<T>(url: string, searchOption: Omit<StrapiSearch, 'term'>[], term?: string) {
    return this.strapiFetchRequest<T>(url, undefined, undefined, {
      pagination: {
        page: 1,
        perPage: 10,
      },
      search: term
        ? searchOption.map((x) => ({
            term,
            operator: 'or',
            strategy: 'contains',
            ...x,
          }))
        : [],
    });
  }

  generateMultiIdParam(ids: number[], key = 'id') {
    return ids.map((id, index) => `${key}[${index}]=${id}`).join('&');
  }

  generateMultiIdBody(ids: number[], key = 'id'): any {
    return ids.reduce((pre, cur, index) => {
      pre[key + '[' + index + ']'] = cur;
      return pre;
    }, {} as any);
  }

  private strapiFetchRequest<T>(
    url: string,
    body?: any,
    mapFn?: (x: any) => StrapiPaginatedResponse<T>,
    options?: StrapiOptions,
    requestOptions?: any,
  ): Observable<StrapiPaginatedResponse<T> | T[]> {
    const requestUrl = this.optionsToUrl(url, options);
    return (
      body
        ? (this.http.post<StrapiPaginatedResponse<T> | T[]>(requestUrl, body, requestOptions) as any)
        : this.http.get<StrapiPaginatedResponse<T> | T[]>(requestUrl)
    ).pipe(map(mapFn ?? ((x) => x)));
  }

  optionsToUrl(url: string, options: StrapiOptions | undefined, features?: { pagination?: boolean }) {
    const FEATURES = {
      pagination: true,
      ...features,
    };

    let endpoint = url;
    let params: string[] = [];
    if (url.indexOf('?') !== -1) {
      const split = url.split('?');
      endpoint = split[0];
      try {
        params = split[1].split('&');
        // eslint-disable-next-line no-empty
      } catch {}
    }
    if (options?.pagination && FEATURES.pagination) {
      params.push(`pagination[pageSize]=${options.pagination.perPage}`);
      params.push(`pagination[page]=${options.pagination.page <= 0 ? 1 : options.pagination.page ?? 1}`);
    }
    if (options?.sort) {
      options.sort.forEach((value, index) => {
        const keyToUse = value.customKeyUsed ? value.key : this.keyToEndpointProcess(value.key);
        params.push(`sort[${index}]=${keyToUse}:${value.direction.toLowerCase()}`);
      });
    }
    let orIndex = 0;
    if (options?.search) {
      options.search.forEach((value) => {
        if (!value.term) {
          return;
        }
        const strategy = this.strategyResolver(value.strategy);
        let operatorParam = '';
        if (value.operator === 'or') {
          operatorParam = `[$or][${orIndex}]`;
          orIndex++;
        }
        const keyToUse = value.customKeyUsed ? value.key : this.keyToEndpointProcess(value.key);
        params.push(`filters${operatorParam}${this.keyToBracket(keyToUse)}[${strategy}]=${value.term}`);
      });
    }
    let filterAndIndex = 0;
    if (options?.filters) {
      options.filters.forEach((value) => {
        let terms: string[] = value.terms as any;
        if (value.terms instanceof Array && value.terms.length === 0) {
          return;
        } else if (!value.terms && value.strategy !== 'notNull' && value.strategy !== 'null') {
          return;
        }
        if (typeof value.terms === 'string') {
          terms = [value.terms];
        }
        const strategy = this.strategyResolver(value.strategy ?? 'in');
        const param = `filters${
          value.andConditionParam ? '[$and]' + '[' + filterAndIndex + ']' : ''
        }${this.keyToBracket(value.key)}[${strategy}]`;
        for (let i = 0; i < terms.length; i++) {
          params.push(
            `${param}${strategy !== '$null' && strategy !== '$notNull' ? `[${i}]` : ''}=${
              strategy === '$null' || strategy === '$notNull' ? 'true' : terms[i]
            }`,
          );
          if (value.andConditionParam) {
            params.push(`filters[$and][${filterAndIndex}]${value.andConditionParam}`);
            filterAndIndex++;
          }
        }
      });
    }
    return `${endpoint}?${params.join('&')}`;
  }

  private iterateObject<V>(object: { [p: string]: V }, callback: (key: string, value: V, index: number) => void) {
    let index = 0;
    for (const key of Object.keys(object)) {
      callback(key, (object as any)[key] as V, index);
      index++;
    }
  }

  private keyToBracket(key: string) {
    return key
      .split('.')
      .map((x) => `[${x}]`)
      .join('');
  }

  private keyToEndpointProcess(key: string) {
    const segments = key.split('.');
    const newSegments = [];
    for (let i = 0; i < segments.length; i++) {
      if (!StrapiIgnorableProps.includes(segments[i])) {
        newSegments.push(segments[i]);
      }
    }
    return newSegments.join('.');
  }

  private strategyResolver(strategy: string | undefined) {
    switch (strategy) {
      case 'gte':
        return '$gte';
      case 'lte':
        return '$lte';
      case 'contains':
        return '$contains';
      case 'null':
        return '$null';
      case 'notNull':
        return '$notNull';
      case 'in':
        return '$in';
      case 'ne':
        return '$ne';
      default:
        return '$eq';
    }
  }
}
