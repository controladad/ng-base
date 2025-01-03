import { Component } from '@angular/core';
import { ButtonClickEvent, ButtonComponent } from '../../../../ui';
import { DialogLayoutComponent } from '../../../../layouts';
import { BaseDialogComponent } from '../_base-dialog.component';

export interface PromptDialogData {
  title: string;
  message: string;
  yesButtonText?: string;
  noButtonText?: string;
  yesButtonClassList?: string;
  noButtonClassList?: string;
}

export type PromptDialogResult = boolean;

@Component({
  selector: 'feature-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  standalone: true,
  imports: [DialogLayoutComponent],
})
export class PromptDialogComponent extends BaseDialogComponent<PromptDialogData, PromptDialogResult> {
  onYes(e: ButtonClickEvent) {
    this.submit(true, e.pipe());
  }

  onNo() {
    this.close();
  }
}
