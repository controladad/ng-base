import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { CacIconComponent } from '../../../ui';

export interface SnackbarData {
  message: string;
  panelClass?: string;
  action?: string;
  offset?: number;
  code?: number;
  duration?: number;
}

@Component({
  selector: 'cac-snackbar',
  standalone: true,
  imports: [CacIconComponent],
  templateUrl: './snackbar-base.component.html',
  styleUrls: ['./snackbar-base.component.scss'],
})
export class CacSnackbarBaseComponent implements AfterViewInit {
  @ViewChild('Wrapper') wrapperEl!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private ref: MatSnackBarRef<any>,
  ) {}

  ngAfterViewInit() {
    if (this.data.offset) {
      this.wrapperEl.nativeElement.style.marginBottom = `${this.data.offset}px`;
    }
  }

  onClick() {
    this.ref.dismiss();
  }

  onAction() {
    this.ref.dismissWithAction();
  }
}
