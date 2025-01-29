import { Component, inject } from '@angular/core';

import { FormBuilder, FormBuilderComponent } from '../../../form-builder';
import { DialogLayoutComponent } from '../../../../layouts';
import { ButtonClickEvent, ButtonComponent } from '../../../../ui';
import { BaseDialogComponent, DialogAction, DialogActionEvent } from '../_base-dialog.component';
import { Subject } from 'rxjs';
import { DialogInvokerService } from '../../dialog-invoker.service';
import { PromptDialogComponent, PromptDialogData, PromptDialogResult } from '../prompt-dialog/prompt-dialog.component';

export interface InputDialogData<T, U> {
  title: string;
  subtitle?: string;
  formBuilder: FormBuilder<T, U>;

  addButtonText?: string;
  addButtonClass?: string;
  deleteButton?: boolean;

  footerHtmlContent?: string;
}

@Component({
  selector: 'feature-input-dialog',
  standalone: true,
  imports: [
    DialogLayoutComponent,
    FormBuilderComponent,
    ButtonComponent
],
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent<T, U> extends BaseDialogComponent<InputDialogData<T, U>, any> {
  readonly dialogInvoker = inject(DialogInvokerService);

  protected _boundDeleteAction?: DialogAction<null, any>;

  public onDeleteAction = new Subject<DialogActionEvent<any, any>>();

  onCancel() {
    this.close();
  }

  onSave(e: ButtonClickEvent) {
    const value = this.data.formBuilder.getValue();
    if (value) {
      this.submit(value, e.pipe());
    }
  }

  onDelete() {
    if (!this._boundDeleteAction) return;

    this.dialogInvoker
      .open<PromptDialogComponent, PromptDialogData, PromptDialogResult>(PromptDialogComponent, {
        title: 'آیا از حذف این مورد مطمئن هستید؟',
        message: 'با حذف مورد انتخاب شده دیگر قادر به بازگردانی آن‌ها نخواهید بود.',
        noButtonText: 'خیر، لغو گردد',
        yesButtonText: 'بله، تایید می‌کنم.',
      })
      .setActionType('delete')
      .action(() => this._boundDeleteAction!(null))
      .subscribe(() => {
        this.onDeleteAction.next({
          dialogResult: null,
          actionResult: true,
        });
        this.close(null);
      });
  }

  bindActionToDelete<ACTION>(action: DialogAction<null, ACTION>) {
    this._boundDeleteAction = action;
  }

  protected override cleanup() {
    super.cleanup();
    this.onDeleteAction.complete();
  }
}
