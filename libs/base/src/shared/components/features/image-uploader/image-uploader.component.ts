import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AsyncPipe } from '@angular/common';
import { CacButtonComponent } from '../../ui';
import { MatIcon } from '@angular/material/icon';
import { Observable, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formControl, FormControlExtended } from '../../../forms';

@Component({
  selector: 'cac-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss'],
  standalone: true,
  imports: [MatProgressSpinner, NgxFileDropModule, AsyncPipe, CacButtonComponent, MatIcon],
})
export class CacImageUploaderComponent<INPUT, OPTION> implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  @Input() control: FormControlExtended = formControl<INPUT | null | undefined>();
  @Input() fetchFn?: (value: INPUT, opts?: OPTION) => Observable<string | File | Blob>;
  @Input() uploadFn?: (file: File, opts?: OPTION) => Observable<INPUT>;
  @Input() options?: OPTION;
  @Input() label = 'Image';
  @Input() disabled = false;
  @Input() accept = '.png,.jpeg,.jpg,.webp';

  @Output() onUploading = new EventEmitter<boolean>();
  @Output() onUploaded = new EventEmitter<INPUT>();

  value = input<string | undefined>();

  isLoading = signal(false);
  url = signal<string | undefined>(undefined);

  private _objectUrls: string[] = [];

  constructor() {
    effect(() => {
      const value = this.value();
      if (value) {
        this.control.setValue(value);
      }
    });
  }

  ngOnInit(): void {
    this.updateValues();
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateValues();
    });
  }

  updateValues() {
    const currentValue = this.control.value;
    if (!this.fetchFn) {
      throw new Error('No fetchFn provided');
    }
    if (currentValue && currentValue.length) {
      if (currentValue.startsWith('http')) {
        this.url.set(currentValue);
      } else {
        this.isLoading.set(true);
        this.fetchFn(currentValue, this.options)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              if (typeof res === 'string') {
                this.url.set(res);
              } else {
                const url = URL.createObjectURL(res);
                this._objectUrls.push(url);
              }

              this.isLoading.set(false);
            },
            error: () => {
              this.isLoading.set(false);
            },
          });
      }
    } else if (!currentValue) {
      this.url.set(undefined);
    }
  }

  ngOnDestroy() {
    this._objectUrls.forEach((t) => URL.revokeObjectURL(t));
  }

  onFileDrop(files: NgxFileDropEntry[]) {
    if (this.disabled || this.control.disabled) return;

    if (!this.uploadFn) {
      throw new Error('No uploadFn provided');
    }

    this.control.markAsTouched();

    const droppedFile = files.at(0);
    if (!droppedFile) return;

    this.isLoading.set(true);
    this.onUploading.next(true);
    this.url.set(undefined);

    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          this.uploadFn!(file, this.options)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (result) => {
                this.control.setValue(result);
                this.url.set(reader.result as string);
                this.isLoading.set(false);
                this.onUploaded.next(result);
                this.onUploading.next(false);
              },
              error: () => {
                this.isLoading.set(false);
                this.onUploading.next(false);
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
