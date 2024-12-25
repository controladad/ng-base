import { Component, inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  BranchApiService,
  formControl,
  formGroup,
  omit,
  RoleApiService,
  StatusType,
  UserApiService,
  UserEntity,
} from '../../../../../../core';
import { DialogLayoutComponent } from '../../../../layouts';
import { ButtonClickEvent, FieldComponent } from '../../../../ui';
import { ImageUploaderComponent } from '../../../image-uploader';
import { BaseDialogComponent } from '../_base-dialog.component';
import { ValidatorCodeMelli, ValidatorMatch, ValidatorPassword, ValidatorPhoneNumber } from '../../../../../validators';
import { StatusValues } from '../../../../../data';

export interface UserCreateDialogData {
  user?: UserEntity;
}

export type UserCreateDialogResult = boolean;

@Component({
  selector: 'feature-user-create-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FieldComponent, ImageUploaderComponent],
  templateUrl: './user-create-dialog.component.html',
  styleUrl: './user-create-dialog.component.scss',
})
export class UserCreateDialogComponent
  extends BaseDialogComponent<UserCreateDialogData, UserCreateDialogResult>
  implements OnInit
{
  private roleApi = inject(RoleApiService);
  private branchApi = inject(BranchApiService);
  private userApi = inject(UserApiService);

  form = formGroup({
    imagePath: formControl<string | null | undefined>(undefined),
    firstName: formControl<string>(undefined, Validators.required),
    lastName: formControl<string>(undefined, Validators.required),
    personnelID: formControl<string>(undefined, [Validators.required]),
    nationalCode: formControl<string>(undefined, [Validators.required, ValidatorCodeMelli()]),
    phoneNumber: formControl<string>(undefined, [Validators.required, ValidatorPhoneNumber()]),
    roleIds: formControl<number[]>(null, [Validators.required]),
    status: formControl<StatusType>('Active'),
    branchList: formControl<number[]>(undefined, [Validators.required]),
    password: formControl<string>(undefined),
    passwordConfirm: formControl<string>(undefined),
  });

  roles = this.roleApi.getItems();
  branches = this.branchApi.getItems();
  StatusValues = StatusValues;

  ngOnInit() {
    if (this.data.user) {
      this.form.controls.password.setValidators([ValidatorPassword()]);
      this.form.controls.passwordConfirm.setValidators([ValidatorMatch(this.form.controls.password)]);
    } else {
      this.form.controls.password.setValidators([Validators.required, ValidatorPassword()]);
      this.form.controls.passwordConfirm.setValidators([
        Validators.required,
        ValidatorMatch(this.form.controls.password),
      ]);
    }
    this.form.controls.passwordConfirm.updateValueAndValidity();
    this.form.controls.password.updateValueAndValidity();

    this.form.patchValue({
      ...this.data.user,
      imagePath: this.data.user?.profileImagePath,
      branchList: this.data.user?.branches.map((t) => t.id),
      roleIds: this.data.user?.roles.map((t) => t.id),
    });
  }

  onSubmit(e: ButtonClickEvent) {
    const model = omit(this.form.getRawValue(), 'passwordConfirm');
    model.imagePath = model.imagePath ?? '';

    (this.data.user ? this.userApi.update(this.data.user.id, model) : this.userApi.create(model))
      .pipe(e.pipe())
      .subscribe(() => {
        this.submit(true);
      });
  }
}
