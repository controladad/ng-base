import { SnackbarService } from '@controladad/ng-base';
import { HttpClient } from '@angular/common/http';
import { ExtendedDialog } from './app/features/dialog-page/extended-dialog';

declare global {
  let dialog$: ExtendedDialog;
  let snackbar$: SnackbarService;
  let http$: HttpClient;
}
