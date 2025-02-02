import { Component } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { ButtonClickEvent, FieldComponent } from '../../../ui';
import { DialogLayoutComponent } from '../../../layouts';
import { formControl } from '../../../../forms';

export interface DescriptionDialogData {
  title?: string;
  subtitle?: string;
  value?: string;
  submitBtn?: string;
}

export interface DescriptionDialogResult {
  value?: string;
}

@Component({
  selector: 'feature-description-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FieldComponent],
  templateUrl: './description-dialog.component.html',
  styleUrls: ['./description-dialog.component.scss'],
})
export class DescriptionDialogComponent extends BaseDialogComponent<DescriptionDialogData, DescriptionDialogResult> {
  control = formControl<string | undefined>(undefined);

  constructor() {
    super();

    this.control.setValue(this.data.value);
  }

  onSubmit(e: ButtonClickEvent) {
    this.submit(
      {
        value: this.control.value,
      },
      e.pipe(),
    );
  }
}
