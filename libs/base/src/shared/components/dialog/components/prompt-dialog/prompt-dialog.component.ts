import { Component } from '@angular/core';
import { ButtonClickEvent } from '../../../ui';
import { CacDialogLayoutComponent } from '../../../layouts';
import { CacBaseDialogComponent } from '../_base-dialog.component';

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
  selector: 'cac-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss'],
  standalone: true,
  imports: [CacDialogLayoutComponent],
})
export class CacPromptDialogComponent extends CacBaseDialogComponent<PromptDialogData, PromptDialogResult> {
  onYes(e: ButtonClickEvent) {
    this.submit(true, e.pipe());
  }

  onNo() {
    this.close();
  }
}
