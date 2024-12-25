import { Component } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { BaseDialogComponent } from '../_base-dialog.component';
import { IconComponent } from '../../../../ui';

export interface ProfileDialogDialogData {
  profileImageUrl: string;
  userFullname: string;
}

export type ProfileDialogDialogResult = 'change-password' | 'signout';

@Component({
  selector: 'feature-profile-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, IconComponent],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.scss',
})
export class ProfileDialogComponent extends BaseDialogComponent<ProfileDialogDialogData, ProfileDialogDialogResult> {
  constructor() {
    super();
  }

  onSelect(action: ProfileDialogDialogResult) {
    this.close(action);
  }
}
