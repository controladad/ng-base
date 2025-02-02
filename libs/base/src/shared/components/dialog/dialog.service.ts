import { Injectable } from '@angular/core';
import {
  PromptDialogComponent,
  PromptDialogData,
  PromptDialogResult,
} from './components/prompt-dialog/prompt-dialog.component';
import { DialogExtended, DialogInvokerService } from './dialog-invoker.service';
import { InputDialogComponent, InputDialogData } from './components/input-dialog/input-dialog.component';
import { DialogAction, DialogActionEvent } from './components/_base-dialog.component';
import { merge, Observable, take } from 'rxjs';
import {
  DescriptionDialogComponent,
  DescriptionDialogData,
  DescriptionDialogResult,
} from './components/description-dialog/description-dialog.component';
import {
  ChangePasswordDialogComponent,
  ChangePasswordDialogResult,
} from './components/change-password-dialog/change-password-dialog.component';
import { CalendarDialogComponent, CalendarsDialogResult } from './components/calendar-dialog/calendar-dialog.component';

export interface InputDialogExtended<T, U> extends DialogExtended<InputDialogComponent<T, U>, U> {
  deleteAction: <ACTION>(action: DialogAction<null, ACTION>) => InputDialogExtended<T, U>;
  onDelete: () => Observable<DialogActionEvent<any, any>>;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: DialogInvokerService) {}

  prompt(data: PromptDialogData) {
    return this.dialog.open<PromptDialogComponent, PromptDialogData, PromptDialogResult>(PromptDialogComponent, data, {
      width: '85vw',
      maxWidth: '46rem',
    });
  }

  deletePrompt(multiple?: boolean) {
    const itemName = multiple ? 'موارد' : 'مورد';

    return this.prompt({
      title: `آیا از حذف ${itemName} انتخاب شده مطمئن هستید؟`,
      message: `با حذف ${itemName} انتخاب شده دیگر قادر به بازگردانی آن‌ها نخواهید بود. آیا حذف اطلاعات را تایید مکنید؟`,
      yesButtonText: 'بله، تایید می‌کنم.',
      noButtonText: 'خیر، لغو گردد.',
    }).setActionType('delete');
  }

  input<T, U>(data: InputDialogData<T, U>, width?: string) {
    const dialog = this.dialog.open<InputDialogComponent<T, U>, InputDialogData<T, U>, U>(InputDialogComponent, data, {
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
    return this.dialog.open<DescriptionDialogComponent, DescriptionDialogData, DescriptionDialogResult>(
      DescriptionDialogComponent,
      data,
      {
        minWidth: '40rem',
      },
    );
  }

  changePassword() {
    return this.dialog.open<ChangePasswordDialogComponent, null, ChangePasswordDialogResult>(
      ChangePasswordDialogComponent,
    );
  }

  calendar() {
    return this.dialog.open<CalendarDialogComponent, null, CalendarsDialogResult>(CalendarDialogComponent, null, {
      width: '25rem',
      maxWidth: '90vw',
    });
  }
}
