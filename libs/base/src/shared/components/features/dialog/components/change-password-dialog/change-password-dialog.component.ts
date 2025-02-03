import { Component } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { FormBuilderComponent, formBuilder } from '../../../form-builder';
import { BaseDialogComponent } from '../_base-dialog.component';
import { ButtonClickEvent } from '../../../../ui';
import { formControl, Validators } from '../../../../../forms';

export interface ChangePasswordDialogData {}

export type ChangePasswordDialogResult = {
  oldPassword: string;
  newPassword: string;
};

@Component({
  selector: 'feature-change-password-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss',
})
export class ChangePasswordDialogComponent
  extends BaseDialogComponent<ChangePasswordDialogData, ChangePasswordDialogResult>
{
  formBuilder = formBuilder({
    cols: 1,
    inputs: {
      oldPassword: {
        control: formControl<string>(undefined, Validators.required),
        label: $localize`:@@base.feature.dialog.currentPassword:Current Password`,
        inputType: 'password-eye',
      },
      newPassword: {
        control: formControl<string>(undefined, [Validators.required, Validators.password]),
        label: $localize`:@@base.feature.dialog.newPassword:New Password`,
        inputType: 'password-eye',
      },
      newPasswordRepeat: {
        control: formControl<string>(undefined, Validators.required),
        label: $localize`:@@base.feature.dialog.newPasswordRepeat:Confirm New Password`,
        inputType: 'password-eye',
      },
    },
    onAfterInit: (controls) => {
      controls.newPasswordRepeat.setValidators([
        Validators.required,
        Validators.match(controls.newPassword),
      ])
    }
  });

  constructor() {
    super();
  }

  onSubmit(e: ButtonClickEvent) {
    const values = this.formBuilder.getValue();
    if (!values) return;
    const result: ChangePasswordDialogResult = {
      oldPassword: (values.oldPassword as string) || '',
      newPassword: (values.newPassword as string) || '',
    };
    this.submit(result);
  }
}
