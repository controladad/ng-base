import { inject, Injectable } from '@angular/core';
import {
  CacPromptDialogComponent,
  PromptDialogData,
  PromptDialogResult,
} from './components/prompt-dialog/prompt-dialog.component';
import { DialogExtended, DialogInvokerService } from './dialog-invoker.service';
import { CacInputDialogComponent, InputDialogData } from './components/input-dialog/input-dialog.component';
import { DialogAction, DialogActionEvent } from './components/_base-dialog.component';
import { merge, Observable, take } from 'rxjs';
import {
  CacDescriptionDialogComponent,
  DescriptionDialogData,
  DescriptionDialogResult,
} from './components/description-dialog/description-dialog.component';
import {
  CacChangePasswordDialogComponent,
  ChangePasswordDialogResult,
} from './components/change-password-dialog/change-password-dialog.component';
import { CacCalendarDialogComponent, CalendarsDialogResult } from './components/calendar-dialog/calendar-dialog.component';

export interface InputDialogExtended<T, U> extends DialogExtended<CacInputDialogComponent<T, U>, U> {
  deleteAction: <ACTION>(action: DialogAction<null, ACTION>) => InputDialogExtended<T, U>;
  onDelete: () => Observable<DialogActionEvent<any, any>>;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  protected readonly dialog = inject(DialogInvokerService)

  readonly DELETE_TITLE_PRE = $localize`:@@base.feature.dialog.delete.titleBeforeItemName:Are You Sure Deleteing: `
  readonly DELETE_TITLE_AFTER = $localize`:@@base.feature.dialog.delete.titleAfterItemName:?`
  readonly DELETE_CAPTION_PRE = $localize`:@@base.feature.dialog.delete.captionBeforeItemName:Deleting `
  readonly DELETE_CAPTION_AFTER = $localize`:@@base.feature.dialog.delete.captionAfterItemName:Cannot Be Undone, Continue?`

  prompt(data: PromptDialogData) {
    return this.dialog.open<CacPromptDialogComponent, PromptDialogData, PromptDialogResult>(CacPromptDialogComponent, data, {
      width: '85vw',
      maxWidth: '46rem',
    });
  }

  deletePrompt(multiple?: boolean) {
    const itemName = multiple ? $localize`:@@base.feature.dialog.item:Items` : $localize`:@@base.feature.dialog.item:Item`;

    return this.prompt({
      title: `${this.DELETE_TITLE_PRE} ${itemName} ${this.DELETE_TITLE_AFTER}`,
      message: `${this.DELETE_CAPTION_PRE} ${itemName} ${this.DELETE_CAPTION_AFTER}`,
      yesButtonText: $localize`:@@base.feature.dialog.input.yesButton:Yes, Continue.`,
      noButtonText: $localize`:@@base.feature.dialog.input.noButton:No, Cancel.`,
    }).setActionType('delete');
  }

  input<T, U>(data: InputDialogData<T, U>, width?: string) {
    const dialog = this.dialog.open<CacInputDialogComponent<T, U>, InputDialogData<T, U>, U>(CacInputDialogComponent, data, {
      width: width,
      minHeight: '17rem',
      maxWidth: '90vw',
      maxHeight: '90vh',
    }) as InputDialogExtended<T, U>;

    dialog.deleteAction = (a1) => {
      dialog.ref.componentInstance.bindActionToDelete(a1);
      return dialog;
    };
    dialog.onDelete = () => {
      return dialog.ref.componentInstance.onDeleteAction.asObservable().pipe(take(1));
    };
    dialog.action = (action) => {
      dialog.ref.componentInstance.bindActionToSubmit(action);
      return merge(
        dialog.ref.componentInstance.onAction.pipe(take(1)),
        dialog.ref.componentInstance.onDeleteAction.pipe(take(1)),
      ).pipe(take(1));
    };

    return dialog;
  }

  description(data: DescriptionDialogData) {
    return this.dialog.open<CacDescriptionDialogComponent, DescriptionDialogData, DescriptionDialogResult>(
      CacDescriptionDialogComponent,
      data,
      {
        minWidth: '40rem',
      },
    );
  }

  changePassword() {
    return this.dialog.open<CacChangePasswordDialogComponent, null, ChangePasswordDialogResult>(
      CacChangePasswordDialogComponent,
    );
  }

  calendar() {
    return this.dialog.open<CacCalendarDialogComponent, null, CalendarsDialogResult>(CacCalendarDialogComponent, null, {
      width: '25rem',
      maxWidth: '90vw',
    });
  }
}
