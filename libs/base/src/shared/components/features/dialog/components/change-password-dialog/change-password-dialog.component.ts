import { Component, OnInit, inject } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { FormBuilderComponent, formBuilder } from '../../../form-builder';
import { Validators } from '@angular/forms';
import { BaseDialogComponent } from '../_base-dialog.component';
import { ChangePassword, UserApiService, formControl } from '../../../../../../../../base/src/core';
import { ValidatorMatch, ValidatorPassword } from '../../../../../../../../base/src/shared/validators';
import { ButtonClickEvent } from '../../../../ui';

export type ChangePasswordDialogResult = boolean;

@Component({
  selector: 'feature-change-password-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.css',
})
export class ChangePasswordDialogComponent
  extends BaseDialogComponent<null, ChangePasswordDialogResult>
  implements OnInit
{
  private userApiService = inject(UserApiService);

  formBuilder = formBuilder({
    cols: 1,
    inputs: {
      oldPassword: {
        control: formControl<string>(undefined, Validators.required),
        label: 'رمز عبور فعلی',
        inputType: 'password-eye',
      },
      newPassword: {
        control: formControl<string>(undefined, Validators.required),
        label: 'رمز عبور جدید',
        inputType: 'password-eye',
      },
      newPasswordRepeat: {
        control: formControl<string>(undefined, Validators.required),
        label: 'تکرار رمز عبور جدید',
        inputType: 'password-eye',
      },
    },
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.formBuilder.controls.newPassword.setValidators([Validators.required, ValidatorPassword()]);
    this.formBuilder.controls.newPasswordRepeat.setValidators([
      Validators.required,
      ValidatorMatch(this.formBuilder.controls.newPassword),
    ]);
  }

  onSubmit(e: ButtonClickEvent) {
    const values = this.formBuilder.getValue();
    if (!values) return;
    const model: ChangePassword = {
      oldPassword: values.oldPassword || '',
      newPassword: values.newPassword || '',
    };
    return this.userApiService
      .changePassword(model)
      .pipe(e.pipe())
      .subscribe(() => {
        this.close(true);
      });
  }
}
