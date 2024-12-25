import { Observable, pipe, Subject, Subscription, take, UnaryFunction } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AfterViewInit, ChangeDetectorRef, Component, inject, signal, ViewChild } from '@angular/core';
import { ActionTypes } from '../../../../../core';
import { DialogLayoutComponent } from '../../../layouts';

export interface BaseDialogData<RESULT, ACTION> {
  action?: DialogAction<RESULT, ACTION>;
}
export interface BaseDialogResult<RESULT, ACTION> {
  dialogResult: RESULT;
  actionResult?: ACTION;
}

export type DialogAction<INPUT, RESULT> = (value: INPUT) => Observable<RESULT>;

export type DialogActionEvent<DIALOG, ACTION> = { dialogResult: DIALOG; actionResult: ACTION };

@Component({
  selector: 'ui-base-dialog',
  template: '',
  standalone: true,
})
export class BaseDialogComponent<DATA, RESULT> implements AfterViewInit {
  readonly cdr = inject(ChangeDetectorRef);
  protected dialog = inject(MatDialogRef<never, RESULT>);
  public data: DATA = inject(MAT_DIALOG_DATA);

  @ViewChild(DialogLayoutComponent) dialogLayout?: DialogLayoutComponent;

  private _boundAction?: DialogAction<RESULT, any>;

  protected subs = new Subscription();
  protected actionType?: ActionTypes;

  public onAction = new Subject<DialogActionEvent<any, any>>();
  public isActionBound = signal(false);

  ngAfterViewInit() {
    this.bindToDialogLayout();
    this.subs.add(
      this.dialog
        .beforeClosed()
        .pipe(take(1))
        .subscribe(() => {
          this.cleanup();
        }),
    );
  }

  submit(result: RESULT, actionPipe?: UnaryFunction<any, any>) {
    if (!this._boundAction) {
      this.close(result);
    } else {
      this.subs.add(
        this._boundAction(result)
          .pipe(take(1), actionPipe ?? pipe())
          .subscribe((actionResult) => {
            this.onAction.next({
              dialogResult: result,
              actionResult: actionResult,
            });
            this.close(result);
          }),
      );
    }
  }

  close(result?: RESULT) {
    this.dialog.close(result);
  }

  bindActionToSubmit<ACTION>(action: DialogAction<RESULT, ACTION>) {
    this._boundAction = action;
    this.isActionBound.set(true);
  }

  setActionType(actionType: ActionTypes | undefined) {
    this.actionType = actionType;
    this.setDialogLayoutActionType();
  }

  protected cleanup() {
    this.subs.unsubscribe();
    this.onAction.complete();
  }

  private bindToDialogLayout() {
    if (!this.dialogLayout) return;
    this.setDialogLayoutActionType();
  }

  private setDialogLayoutActionType() {
    if (!this.dialogLayout) return;
    this.dialogLayout.setActionType(this.actionType);

    this.cdr.detectChanges();
  }
}
