import { DateHelper } from './date.helper';

export class APIHelper {
  static dropSlash(url: string) {
    return url.startsWith('/') ? url.substring(1) : url;
  }

  static prependSlash(url: string) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  // turn `{ id: 1, a: "", b: "", c: "" }` to `{ id: 1, a: { value: "" }, b: {value: ""}, c: { value: ""} }`
  static nestValues(obj: any, keepIdAtTopLevel = true) {
    const keys = Object.keys(obj);
    const idKey = keys.find((t) => t === 'id') ?? keys.find((t) => t.toLowerCase().includes('id'));

    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;
      if (key === idKey && keepIdAtTopLevel) {
        acc[key] = value; // Keep "id" at the top level
      } else {
        acc[key] = { value };
      }
      return acc;
    }, {} as any);
  }

  // if result (object) is passed, it will automatically search for url string inside of it.
  static download(resultOrUrl: object | string, baseUrl: string, filename?: string) {
    let exportUrl;
    if (typeof resultOrUrl === 'string') {
      exportUrl = resultOrUrl;
    } else {
      exportUrl = Object.values(resultOrUrl).find((t) => typeof t === 'string');
    }
    if (!exportUrl || exportUrl === '') {
      throw new Error('Cannot find a url from this object to download', {
        cause: resultOrUrl
      });
    }
    // window.open(`${this.environment.apiBaseUrl}/${this.dropSlash(exportUrl)}`, '_blank');

    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.href = `${baseUrl}/${this.dropSlash(exportUrl)}`;
    a.download = `${filename ? filename : 'export'}_${DateHelper.format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
