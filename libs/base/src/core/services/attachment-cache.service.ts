import { inject, Injectable } from '@angular/core';
import { AttachmentApiService } from './api';
import { of, retry, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttachmentCacheService {
  private attachmentApi = inject(AttachmentApiService);

  private _cachedBlobs: { [path: string]: Blob } = {};

  fetch(path: string) {
    if (this._cachedBlobs[path]) return of(this._cachedBlobs[path]);

    return this.attachmentApi.download(path).pipe(
      retry(1),
      tap((blob) => {
        this._cachedBlobs[path] = blob;
      }),
    );
  }
}
