import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { AbstractControl } from '@angular/forms';
import { ButtonClickEvent, CacIconComponent } from '../../ui';
import { CacBottomControlsComponent } from '../../features/bottom-controls';
import { ActionTypes } from '../../../../core';

@Component({
  selector: 'cac-dialog-layout',
  standalone: true,
  imports: [CacIconComponent, CacBottomControlsComponent],
  templateUrl: './dialog-layout.component.html',
  styleUrls: ['./dialog-layout.component.scss'],
})
export class CacDialogLayoutComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() submitBtn?: string;
  @Input() cancelBtn?: string;
  @Input() submitClass?: string;
  @Input() cancelClass?: string;
  @Input() showCloseBtn = true;
  @Input() form?: AbstractControl;
  @Input() hideControls = false;

  @Output() onSubmit = new EventEmitter<ButtonClickEvent>();
  @Output() onError = new EventEmitter();
  // Use this event only if you need to handle
  @Output() onCancel = new EventEmitter();

  SUBMIT_DEFAULT_TEXT = $localize`:@@base.feature.dialog.saveButtonDefault:Save`;
  CANCEL_DEFAULT_TEXT = $localize`:@@base.feature.dialog.cancelButtonDefault:Cancel`;
  
  // ActionType is being set by the BaseDialog.setActionType, or you can call the setActionType from this component directly.
  protected actionType = signal<ActionTypes | undefined>(undefined);

  constructor(public dialogRef: MatDialogRef<CacDialogLayoutComponent>) {}

  onCancelClick() {
    this.closeDialog();
    this.onCancel.emit();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setActionType(actionType: ActionTypes | undefined) {
    this.actionType.set(actionType);
  }
}
