import { Component, inject, signal } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { ControlBuilderComponent, formBuilder, FormBuilderComponent } from '../../../form-builder';
import { BaseDialogComponent } from '../_base-dialog.component';
import { TrafficBillApiService, TrafficBillEntity, formControl, getJalaliDate } from '../../../../../../core';
import { ButtonComponent } from '../../../../ui';
import { switchMap, take } from 'rxjs';

export interface DispatchDetailsDialogData {
  item: TrafficBillEntity;
}

export interface DispatchDetailsDialogResult {
  submit: boolean;
  checkoutDescription?: string;
  exit?: boolean;
}

@Component({
  selector: 'feature-dispatch-details-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, ControlBuilderComponent, FormBuilderComponent, ButtonComponent],
  templateUrl: './dispatch-details-dialog.component.html',
  styleUrl: './dispatch-details-dialog.component.scss',
})
export class DispatchDetailsDialogComponent extends BaseDialogComponent<
  DispatchDetailsDialogData,
  DispatchDetailsDialogResult
> {
  private readonly trafficBillApiService = inject(TrafficBillApiService);

  checkoutDescription = signal<string>('');
  baseForm = formBuilder({
    cols: 2,
    inputs: {
      trafficNumber: {
        control: formControl(''),
        label: 'شماره تردد',
        suffixIcon: 'code',
        hideError: true,
      },
      arrivalConfirmerName: {
        control: formControl(''),
        label: 'نام کاربر تائید کننده ورود',
        suffixIcon: 'user',
        hideError: true,
      },
      arrivalTime: {
        control: formControl(''),
        label: 'ساعت ورود',
        suffixIcon: 'time',
        hideError: true,
      },
      arrivalDate: {
        control: formControl(''),
        label: 'تاریخ ورود',
        suffixIcon: 'calendar',
        hideError: true,
      },
      arrivalNotes: {
        control: formControl(''),
        label: 'توضیحات ورود',
        type: 'textarea',
        rows: 5,
        hideError: true,
      },
    },
  });

  weightForm = formBuilder({
    cols: 4,
    defaults: {
      hideError: true,
      clearable: false,
    },
    inputs: {
      contractType: {
        control: formControl(''),
        label: 'نوع قرارداد',
        suffixIcon: 'paper',
      },
      shipmentOrderNumber: {
        control: formControl(''),
        label: 'شماره دستور حمل',
        suffixIcon: 'sort-indicator',
      },
      shipmentOrderTitle: {
        control: formControl(''),
        label: 'عنوان دستور حمل',
        suffixIcon: 'field-edit',
      },
      item: {
        control: formControl(''),
        label: 'قلم کالا',
        suffixIcon: 'cargo',
      },
    },
  });

  companyForm = formBuilder({
    cols: 4,
    defaults: {
      hideError: true,
      clearable: false,
    },
    inputs: {
      company: {
        control: formControl(''),
        label: 'شرکت باربر',
        suffixIcon: 'building',
      },
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
      vehiclePlate: {
        control: formControl(''),
        label: 'پلاک خودرو',
        type: 'plate',
      },
    },
  });

  constructor() {
    super();

    this.baseForm.setReadonly(true);
    this.weightForm.setReadonly(true);
    this.companyForm.setReadonly(true);

    this.baseForm.patchValue({
      trafficNumber: this.data.item.trafficNumber,
      arrivalNotes: '-',
      arrivalConfirmerName: this.data.item.arrivalConfirmerName,
      arrivalDate: getJalaliDate(this.data.item.arrivalTime, 'yyyy/MM/dd'),
      arrivalTime: getJalaliDate(this.data.item.arrivalTime, 'HH:mm'),
    });
    this.weightForm.patchValue({
      contractType: this.data.item.contractType,
      shipmentOrderNumber: this.data.item.shipmentOrderNumber,
      shipmentOrderTitle: this.data.item.shipmentOrderTitle,
      item: this.data.item.itemName,
    });
    this.companyForm.patchValue({
      company: this.data.item.truckingCompanyName,
      driverName: this.data.item.driverName,
      vehicleCode: this.data.item.vehicleCode,
      vehiclePlate: this.data.item.vehiclePlateNumber,
    });
    this.checkoutDescription.set(this.data.item.checkoutDescription ?? '');
  }

  onAddDescription() {
    dialog$
      .description({
        title: 'افزودن توضیح',
        submitBtn: 'ذخیره',
        value: this.checkoutDescription(),
      })
      .afterSubmit()
      .pipe(take(1))
      .subscribe((result) => {
        this.checkoutDescription.set(result.value ?? '');
      });
  }

  onCheckout() {
    dialog$
      .description({
        title: 'تایید خروج',
        submitBtn: 'تایید',
      })
      .afterSubmit()
      .pipe(take(1))
      .subscribe((result) => {
        this.submit({ submit: true, exit: true, checkoutDescription: result.value ?? '' });
      });
  }

  onCancel() {
    dialog$
      .description({
        title: 'تایید ابطال ورود',
        submitBtn: 'تایید',
      })
      .afterSubmit()
      .pipe(
        switchMap((result) =>
          this.trafficBillApiService.declineTraffic({
            id: this.data.item.id,
            reason: result.value ?? '',
          }),
        ),
        take(1),
      )
      .subscribe(() => {
        this.submit({ submit: true });
      });
  }
}
