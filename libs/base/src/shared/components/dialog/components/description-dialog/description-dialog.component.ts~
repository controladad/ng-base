import { Component } from '@angular/core';
import { CacBaseDialogComponent } from '../_base-dialog.component';
import { ButtonClickEvent, CacFieldComponent } from '../../../../ui';
import { CacDialogLayoutComponent } from '../../../../layouts';
import { formControl } from '../../../../../forms';

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
  selector: 'cac-description-dialog',
  standalone: true,
  imports: [CacDialogLayoutComponent, CacFieldComponent],
  templateUrl: './description-dialog.component.html',
  styleUrls: ['./description-dialog.component.scss'],
})
export class CacDescriptionDialogComponent extends CacBaseDialogComponent<DescriptionDialogData, DescriptionDialogResult> {
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
