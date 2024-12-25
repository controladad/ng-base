import { Component, inject } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { BillAdminStatus, BillApiService, BillEntity, EntezamatApiService, formControl } from '../../../../../../core';
import { ButtonClickEvent, FieldComponent } from '../../../../ui';
import { BaseDialogComponent } from '../_base-dialog.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { Validators } from '@angular/forms';
import { MfPluginsService } from '@mf';

export interface BillStatusDialogData {
  bill: BillEntity;
  action: 'cancel' | 'submit';
}

export interface BillStatusDialogResult {
  updated: boolean;
}

@Component({
  selector: 'feature-bill-status-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FieldComponent, NgIf, AsyncPipe],
  templateUrl: './bill-status-dialog.component.html',
  styleUrls: ['./bill-status-dialog.component.scss'],
})
export class BillStatusDialogComponent extends BaseDialogComponent<BillStatusDialogData, BillStatusDialogResult> {
  private billApi = inject(BillApiService);
  private entezamatApi = inject(EntezamatApiService);
  private plugins = inject(MfPluginsService);

  entezamatControl = formControl<number>();
  descriptionControl = formControl<string>('');
  title: string;

  entezamatItems$ = this.entezamatApi.getItems(this.data.bill.branch.id);

  constructor() {
    super();

    if (this.data.action === 'cancel') {
      this.title = 'ابطال';
    } else if (this.data.bill.billStatus === 'SecondaryWeighing') {
      this.title = 'صدور';
    } else {
      this.title = 'تایید';
    }

    if (
      this.data.action === 'submit' &&
      this.data.bill.billStatus === 'SecondaryWeighing' &&
      this.data.bill.shipmentOrder.needsEntezamatConfirmation &&
      this.plugins.isEntezamatAvailable()
    ) {
      this.entezamatControl.setValidators(Validators.required);
    } else {
      this.entezamatControl.setDisabled(true);
    }
  }

  onSave(e: ButtonClickEvent) {
    if (this.entezamatControl.invalid) {
      snackbar$.error('لطفا انتظامات را انتخاب کنید.');
      return;
    }

    (this.data.action === 'submit' && this.data.bill.billStatus === 'SecondaryWeighing'
      ? this.entezamatControl.enabled
        ? this.billApi.confirmBillDelivery({
            id: this.data.bill.id,
            deliveryDescription: this.descriptionControl.value ?? '',
            deliveryTime: new Date().toISOString(),
            entezamatID: this.entezamatControl.value,
          })
        : this.updateStatus('Submitted')
      : this.data.action === 'submit'
        ? this.updateStatus('Submitted')
        : this.updateStatus('Canceled')
    )
      .pipe(e.pipe())
      .subscribe(() => {
        this.close({ updated: true });
      });
  }

  private updateStatus(status: BillAdminStatus) {
    return this.billApi.updateStatus({
      id: this.data.bill.id,
      adminStatus: status,
      explanation: this.descriptionControl.value ?? '',
    });
  }
}
