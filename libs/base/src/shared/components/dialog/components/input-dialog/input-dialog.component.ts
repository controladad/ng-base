import { Component, inject } from '@angular/core';

import { CacDialogLayoutComponent } from '../../../layouts';
import { ButtonClickEvent, CacButtonComponent } from '../../../ui';
import { CacBaseDialogComponent, DialogAction, DialogActionEvent } from '../_base-dialog.component';
import { Subject } from 'rxjs';
import { DialogInvokerService } from '../../dialog-invoker.service';
import { CacPromptDialogComponent, PromptDialogData, PromptDialogResult } from '../prompt-dialog/prompt-dialog.component';
import { FormBuilder, CacFormBuilderComponent } from '../../../features';

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
  selector: 'cac-input-dialog',
  standalone: true,
  imports: [
    CacDialogLayoutComponent,
    CacFormBuilderComponent,
    CacButtonComponent,
],
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class CacInputDialogComponent<T, U> extends CacBaseDialogComponent<InputDialogData<T, U>, any> {
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
      .open<CacPromptDialogComponent, PromptDialogData, PromptDialogResult>(CacPromptDialogComponent, {
        title: $localize`:@@base.feature.dialog.input.title:Are You Sure Deleting This Item?`,
        message: $localize`:@@base.feature.dialog.input.message:Deleting Cannot Be Undone, Confirm?`,
        noButtonText: $localize`:@@base.feature.dialog.input.noButton:No, Cancel`,
        yesButtonText: $localize`:@@base.feature.dialog.input.yesButton:Yes, Delete.`,
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
