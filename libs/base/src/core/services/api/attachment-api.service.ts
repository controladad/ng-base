import { Injectable } from '@angular/core';
import { BaseApi } from './_base-api';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttachmentApiService extends BaseApi<any> {
  constructor() {
    super('');
  }

  uploadImage(file: File) {
    const form = new FormData();
    form.set('file', file);
    return http$.post<{ filePath: string }>(`/Image/Upload`, form).pipe(map((t) => t.filePath));
  }

  download(path: string) {
    return http$.get(`/Image/Download?path=${path}`, {
      responseType: 'blob',
    });
  }
}
