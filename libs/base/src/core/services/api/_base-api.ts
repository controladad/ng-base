import { map, Observable, tap } from 'rxjs';
import { GetApiAdapter, GetApiAdapterOptionsToQueryParam, GetApiRequest } from '../../adapters';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getJalaliDate, toPascalCase } from '../../helpers';
import { DataGetOptions, DataGetRequest, ItemRecord } from '../../interfaces';
import { ENVIRONMENT } from '../../../configs';

type ResponseType = 'json' | 'text' | 'blob' | undefined;
interface ApiOptions {
  responseType?: ResponseType;
}

export type EndpointMethods = 'get' | 'getById' | 'post' | 'put' | 'delete' | 'deleteById';
export type EndpointMapper = { [p in EndpointMethods]?: ((path: string) => string) | string };

class Endpoint {
  constructor(
    public path: string,
    public mapper?: EndpointMapper,
  ) {}

  get(method: EndpointMethods) {
    let path = toPascalCase(this.path);
    if (this.mapper && method in this.mapper) {
      const mapFn = this.mapper![method]!;
      path = typeof mapFn === 'function' ? mapFn(path) : mapFn;
    }
    return path;
  }
}

export class BaseApi<ENTITY, CREATE = any, UPDATE = any> {
  readonly http = inject(HttpClient);
  readonly environment = inject(ENVIRONMENT);

  protected endpoint: Endpoint;
  protected prefix: string;

  /**
   *
   * @param endpoint is the base url to request at, slash at the start is optional
   * @param endpointMapper is used when the endpoint path is not following the default rule and needs to be changed.
   */
  constructor(endpoint: string, endpointMapper?: EndpointMapper) {
    const segments = this.dropSlash(endpoint).split('/');
    this.endpoint = new Endpoint(segments.at(-1) ?? '', endpointMapper);
    this.prefix = `/${segments.length > 1 ? segments.slice(0, -1).join('/') + '/' : ''}`;
  }

  getAdapter(options?: DataGetOptions<ENTITY>) {
    return GetApiAdapter<ENTITY>(`${this.prefix}${this.endpoint.get('get')}`, options);
  }

  getAdapterFiltered(defaultFilters?: DataGetRequest['filters']) {
    return this.getAdapter({
      default: {
        filters: defaultFilters,
      },
    });
  }

  get(id: string | number, opts?: ApiOptions): Observable<ENTITY> {
    return this.http.get(`${this.prefix}${this.endpoint.get('getById')}/${id}`, this.getOptions(opts) as never).pipe(
      map((result: any) => {
        const keys = Object.keys(result);
        if (keys.length === 1 && !keys.includes('id')) {
          return result[keys[0]];
        }
        return result;
      }),
    ) as never;
  }

  getAll<T = ENTITY>(opts?: DataGetRequest, overrideUrl?: string): Observable<T[]> {
    return GetApiRequest<T>(overrideUrl ?? `${this.prefix}${this.endpoint.get('get')}`, {
      pagination: {
        page: 1,
        size: 999999,
      },
      ...opts,
    });
  }

  create<T>(model: CREATE, opts?: ApiOptions): Observable<T> {
    return this.http.post<T>(
      `${this.prefix}${this.endpoint.get('post')}`,
      model,
      this.getOptions(opts) as never,
    ) as never;
  }

  update<T>(id: number, model: UPDATE, opts?: ApiOptions): Observable<T> {
    return this.http.put<T>(
      `${this.prefix}${this.endpoint.get('put')}/${id}`,
      model,
      this.getOptions(opts) as never,
    ) as never;
  }

  delete<T>(id: number | number[] | { id: number } | { id: number }[], opts?: ApiOptions): Observable<T> {
    return id instanceof Array
      ? (this.http.delete(
          `${this.prefix}${this.endpoint.get('delete')}?${id
            .map((x) => `ID=${typeof x === 'number' ? x : x.id}`)
            .join('&')}`,
          this.getOptions(opts) as never,
        ) as never)
      : (this.http.delete(
          `${this.prefix}${this.endpoint.get('deleteById')}/${typeof id === 'number' ? id : id.id}`,
          this.getOptions(opts) as never,
        ) as never);
  }

  protected getItemRecords(
    mapTo: keyof ENTITY | ((item: ENTITY) => string | ItemRecord<number>),
    filterByStatus = true,
    filterBy?: ((item: ENTITY) => boolean) | DataGetRequest['filters'],
  ): Observable<ItemRecord<number>[]> {
    const filters: DataGetRequest['filters'] = [];
    if (filterByStatus) {
      filters.push({
        key: 'status',
        value: 'active',
      });
    }
    if (filterBy instanceof Array) {
      filters.push(...filterBy);
    }

    return this.getAll({
      filters,
    }).pipe(
      map((result) => {
        let currentList = result;
        // We also do the filter manually, cause not all endpoints support filters...
        if (filterByStatus) {
          currentList = currentList.filter((t) => {
            if (!t || typeof t !== 'object') return true;
            let status: string | boolean | undefined;
            if ('status' in t) {
              status = t.status as any;
            }

            if (status !== undefined) {
              return typeof status === 'string' ? status.toLowerCase() === 'active' : status;
            }

            return true;
          });
        }
        if (filterBy && typeof filterBy === 'function') {
          currentList = currentList.filter(filterBy);
        }
        return currentList.map((t) => {
          if (typeof mapTo === 'function') {
            const fnResult = mapTo(t);
            return typeof fnResult === 'string' ? { label: fnResult, value: t['id' as never] } : fnResult;
          } else {
            return { label: t[mapTo], value: t['id' as never] };
          }
        }) as ItemRecord<number>[];
      }),
    );
  }

  protected exportAndDownload<T>(url: string, query?: DataGetRequest, filename?: string) {
    const params = GetApiAdapterOptionsToQueryParam({
      ...query,
      pagination: undefined,
    });
    return this.http
      .get<T>(`${this.prependSlash(url)}?${params}`)
      .pipe(tap((result) => this.downloadUrl(result as never, filename)));
  }

  protected downloadUrl(resultUrl: object | string, filename?: string) {
    let exportUrl;
    if (typeof resultUrl === 'string') {
      exportUrl = resultUrl;
    } else {
      exportUrl = Object.values(resultUrl).find((t) => typeof t === 'string');
    }
    if (!exportUrl || exportUrl === '') {
      console.error('Cannot find a url from this object to download', resultUrl);
      return;
    }
    // window.open(`${this.environment.apiBaseUrl}/${this.dropSlash(exportUrl)}`, '_blank');

    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.href = `${this.environment.apiBaseUrl}/${this.dropSlash(exportUrl)}`;
    a.download = `${filename ? filename : 'export'}_${getJalaliDate(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private getOptions(options?: ApiOptions | undefined) {
    return {
      responseType: 'json' as const,
      ...(options ?? {}),
    };
  }

  private dropSlash(url: string) {
    return url.startsWith('/') ? url.substring(1) : url;
  }

  private prependSlash(url: string) {
    return url.startsWith('/') ? url : `/${url}`;
  }
}
