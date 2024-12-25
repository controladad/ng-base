import { Component } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { DialogLayoutComponent } from '../../../../layouts';
import { ButtonClickEvent, FieldComponent } from '../../../../ui';
import { formControl } from '../../../../../../core';

export interface BillDescriptionDialogData {
  description: string | null;
}
export type BillDescriptionDialogResult = {
  description: string;
};

@Component({
  selector: 'feature-bill-description-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FieldComponent],
  templateUrl: './bill-description-dialog.component.html',
  styleUrls: ['./bill-description-dialog.component.scss'],
})
export class BillDescriptionDialogComponent extends BaseDialogComponent<
  BillDescriptionDialogData,
  BillDescriptionDialogResult
> {
  descriptionControl = formControl<string>('');

  constructor() {
    super();
    this.descriptionControl.setValue(this.data.description ?? '');
  }

  onSave(_: ButtonClickEvent) {
    const description = this.descriptionControl.value;

    this.close({ description });
  }
}
