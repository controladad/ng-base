import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarData, SnackbarBaseComponent } from './snackbar-base/snackbar-base.component';
import { APIError, ErrorHelper } from '../../../../core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  readonly DEFAULT_DURATION = 3200;

  constructor(private snackbar: MatSnackBar) {}

  show(message: string, options?: Omit<SnackbarData, 'message'>) {
    return this.open(message, {
      panelClass: 'is-message',
      ...options,
    });
  }

  error(message: string, options?: Omit<SnackbarData, 'message'>) {
    return this.open(message, {
      panelClass: 'is-error',
      ...options,
    });
  }

  showServerError(serverCode: number, apiError?: APIError) {
    this.error(`${ErrorHelper.getResponseErrorMessage(serverCode, apiError)}`, {
      code: serverCode,
    });
  }

  private open(message: string, options?: Omit<SnackbarData, 'message'>) {
    const ref = this.snackbar.openFromComponent(SnackbarBaseComponent, {
      panelClass: `ui-snackbar-default`,
      data: { message, ...options } as SnackbarData,
      duration: options?.duration ?? this.DEFAULT_DURATION,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    // This is a fix for snackbar, sometimes it appears at the top of the screen,
    // which the below code will fix it...
    // @ts-ignore
    const wrapper = ref._overlayRef.hostElement as HTMLElement;
    wrapper.style.alignItems = 'flex-end';
    wrapper.style.justifyContent = 'center';

    return ref;
  }
}
