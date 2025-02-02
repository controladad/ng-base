import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { BaseDialogComponent, DialogAction, DialogActionEvent } from './components/_base-dialog.component';
import { filter, map, Observable, take } from 'rxjs';
import { ActionTypes } from '../../../core';
import { CacBase } from '../../../configs';

export interface DialogExtended<T, R> {
  ref: MatDialogRef<T, R>;
  afterOpened: () => Observable<void>;
  afterClosed: () => Observable<R | undefined>;
  beforeClosed: () => Observable<R | undefined>;
  afterSubmit: () => Observable<R>;
  setActionType: (actionType: ActionTypes | undefined) => DialogExtended<T, R>;
  action: <ACTION>(action: DialogAction<R, ACTION>) => Observable<DialogActionEvent<R, ACTION>>;
}

export interface DialogExtendedConfig<D> extends MatDialogConfig<D> {
  backdropBlur?: 'sm' | 'normal' | 'xl';
}

@Injectable({
  providedIn: 'root',
})
export class DialogInvokerService {
  constructor(private dialog: MatDialog) {}

  open<T, D, R>(component: ComponentType<T>, data?: D, config?: DialogExtendedConfig<D>): DialogExtended<T, R> {
    const defaultConfig = CacBase.config.components.dialog

    const ref = this.dialog.open<T, D, R>(component, {
      data,
      backdropClass: [
        config?.backdropBlur === 'xl' ? 'ui-backdrop-blur-xl' : 'ui-backdrop-blur',
        config?.enterAnimationDuration === 0 ? 'ui-no-transition' : '',
      ],
      ...defaultConfig.defaults,
      ...config,
    });

    const componentIns = ref.componentInstance as BaseDialogComponent<D, R>;
    const extended: DialogExtended<T, R> = {
      ref,
      afterOpened: () => ref.afterOpened(),
      afterClosed: () => ref.afterClosed(),
      beforeClosed: () => ref.beforeClosed(),
      setActionType: (actionType: ActionTypes | undefined) => {
        componentIns.setActionType(actionType);
        return extended;
      },
      afterSubmit: () =>
        ref.afterClosed().pipe(
          filter((result) => result !== undefined && result !== null && result !== false),
          map((result) => result as R),
        ),
      action: <ACTION>(action: DialogAction<R, ACTION>) => {
        componentIns.bindActionToSubmit(action);
        return componentIns.onAction.asObservable().pipe(take(1)) as Observable<DialogActionEvent<R, ACTION>>;
      },
    };
    return extended;
  }
}
