import { Component, signal } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { DialogLayoutComponent } from '../../../../layouts';
import { formBuilder, FormBuilderComponent } from '../../../form-builder';
import { formControl, ItemRecord } from '../../../../../../../src/core';
import { ButtonComponent, IconComponent } from '../../../../ui';
import { BehaviorSubject, take } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

export interface DispatchDialogData {
  isArrival: boolean;
  driverName?: string;
  vehicleCode?: string;
  vehiclePlate?: string;
  company?: string;
  orderId?: number;
  orderItems: ItemRecord<number, { contractType?: string; branch?: string }>[];
  getRegistrationErrors: (vehiclePlate?: string, orderId?: number) => string | null;
}

export interface DispatchDialogResult {
  description: string;
  orderId: number;
}

@Component({
  selector: 'feature-dispatch-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent, ButtonComponent, AsyncPipe, NgIf, IconComponent],
  templateUrl: './dispatch-dialog.component.html',
  styleUrl: './dispatch-dialog.component.scss',
})
export class DispatchDialogComponent extends BaseDialogComponent<DispatchDialogData, DispatchDialogResult> {
  description = signal<string>('');
  registrationErrors$ = new BehaviorSubject<string | null>(null);

  companyForm = formBuilder({
    cols: 2,
    defaults: {
      hideError: true,
      clearable: false,
    },
    inputs: {
      driverName: {
        control: formControl(''),
        label: 'نام راننده',
        suffixIcon: 'user',
      },
      vehicleCode: {
        control: formControl(''),
        label: 'کد خودرو',
        suffixIcon: 'code',
      },
      company: {
        control: formControl(''),
        label: 'شرکت باربر',
        suffixIcon: 'building',
      },
      vehiclePlate: {
        control: formControl(''),
        label: 'پلاک خودرو',
        type: 'plate',
      },
    },
  });

  weightForm = formBuilder({
    cols: 2,
    defaults: {
      hideError: true,
      clearable: false,
    },
    inputs: {
      shipmentOrderNumber: {
        control: formControl<number>(undefined),
        label: 'دستور حمل',
        suffixIcon: 'sort-indicator',
        type: 'select',
        items: this.data.orderItems,
        colspan: 2,
      },
      contractType: {
        control: formControl(''),
        label: 'نوع قرارداد',
        suffixIcon: 'paper',
      },
      branch: {
        control: formControl(''),
        label: 'شعبه',
        suffixIcon: 'branch',
      },
    },
    onInit: (controls) => {
      controls.shipmentOrderNumber.valueChanges.subscribe((orderId) => {
        const order = this.data.orderItems.find((x) => x.value === orderId);
        this.weightForm.patchValue({
          branch: order?.alt?.branch,
          contractType: order?.alt?.contractType,
        });
        if (this.data.isArrival) {
          this.registrationErrors$.next(
            this.data.getRegistrationErrors(this.data.vehiclePlate, controls.shipmentOrderNumber.value),
          );
        }
      });
    },
  });

  constructor() {
    super();

    this.companyForm.setReadonly(true);
    this.weightForm.setReadonly(true);

    if (this.data.isArrival) {
      this.weightForm.setReadonly(false, 'shipmentOrderNumber');
    }

    this.companyForm.patchValue({
      driverName: this.data.driverName,
      company: this.data.company,
      vehicleCode: this.data.vehicleCode,
      vehiclePlate: this.data.vehiclePlate,
    });
    const order = this.data.orderId
      ? this.data.orderItems.find((order) => order.value === this.data.orderId)
      : this.data.orderItems?.at(0);
    this.weightForm.patchValue({
      branch: order?.alt?.branch,
      contractType: order?.alt?.contractType,
      shipmentOrderNumber: order?.value,
    });
  }

  onAddDescription() {
    dialog$
      .description({
        title: 'افزودن توضیح',
        submitBtn: 'ذخیره',
        value: this.description(),
      })
      .afterSubmit()
      .pipe(take(1))
      .subscribe((result) => {
        this.description.set(result.value ?? '');
      });
  }

  onConfirm() {
    const hasRegistrationError = this.data.isArrival && this.registrationErrors$.value;
    const orderId = this.weightForm.controls.shipmentOrderNumber.value;

    if (!orderId || hasRegistrationError) return;

    dialog$
      .description({
        title: `تایید ${this.data.isArrival ? 'ورود' : 'خروج'}`,
        submitBtn: 'تایید',
        value: this.description(),
      })
      .afterSubmit()
      .pipe(take(1))
      .subscribe((result) => {
        this.submit({ orderId: orderId, description: result.value ?? '' });
      });
  }

  onCancel() {
    this.close();
  }
}
