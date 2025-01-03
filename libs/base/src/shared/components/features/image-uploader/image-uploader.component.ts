import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '../../ui';
import { AttachmentApiService, AttachmentCacheService } from '../../../../core';
import { MatIcon } from '@angular/material/icon';
import { formControl } from '../../../forms';

@Component({
  selector: 'feature-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  standalone: true,
  imports: [MatProgressSpinner, NgxFileDropModule, AsyncPipe, ButtonComponent, MatIcon],
})
export class ImageUploaderComponent implements OnInit, OnDestroy {
  private readonly attachmentApi = inject(AttachmentApiService);
  private readonly attachmentCache = inject(AttachmentCacheService);

  @Input() control = formControl<string | null | undefined>();

  isLoading = signal(false);
  url = signal<string | undefined>(undefined);

  private _objectUrls: string[] = [];

  ngOnInit() {
    const currentValue = this.control.value;
    if (currentValue && currentValue.length) {
      this.isLoading.set(true);
      this.attachmentCache.fetch(currentValue).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this._objectUrls.push(url);
          this.url.set(url);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  ngOnDestroy() {
    this._objectUrls.forEach((t) => URL.revokeObjectURL(t));
  }

  onFileDrop(files: NgxFileDropEntry[]) {
    this.control.markAsTouched();

    const droppedFile = files.at(0);
    if (!droppedFile) return;

    this.isLoading.set(true);
    this.url.set(undefined);

    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.attachmentApi.uploadImage(file).subscribe({
            next: (path) => {
              this.control.setValue(path);
              this.url.set(reader.result as string);
              this.isLoading.set(false);
            },
            error: () => {
              this.isLoading.set(false);
            },
          });
        },
        false,
      );
      reader.readAsDataURL(file);
    });
  }

  onDelete() {
    this.control.markAsTouched();
    this.url.set(undefined);
    this.control.setValue(null);
  }
}
