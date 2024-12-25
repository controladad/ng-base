import { DataGetRequest, ItemRecord } from '../interfaces';

export class RequestHelper {
  static addFilterIfNotAvailable(
    req: DataGetRequest,
    key: string,
    value: string | string[] | ItemRecord<string> | ItemRecord<string>[],
  ) {
    const values =
      value instanceof Array
        ? value.map((t) => (typeof t === 'object' ? t.value : t))
        : typeof value === 'object'
          ? value.value
          : value;

    if (!req.filters?.some((t) => t.key === key)) {
      req.filters = [
        ...(req.filters ?? ([] as any)),
        {
          key: key,
          value: values,
          type: 'equal',
        },
      ];
    }
    return req;
  }
}
