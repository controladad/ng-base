import { Component, inject, signal } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { ControlBuilderComponent, formBuilder, FormBuilderComponent } from '../../../form-builder';
import { DialogLayoutComponent } from '../../../../layouts';
import { MfPluginsService } from '@mf';
import { NgIf } from '@angular/common';
import { TrafficBillEntity, formControl, NavyApiService } from '../../../../../../core';
import { ButtonComponent } from '../../../../ui';
import { DispatchingTrafficStatusValues, ShipmentOrderContractTypeValues } from '../../../../../data';
import { MapComponent, MapRoute } from '../../../map';

export type DispatchBillDetailsDialogData = TrafficBillEntity;

export interface DispatchBillDetailsDialogResult {
  reason: string;
}
@Component({
  selector: 'ui-dispatch-bill-details-dialog',
  templateUrl: './dispatch-bill-details-dialog.component.html',
  styleUrls: ['./dispatch-bill-details-dialog.component.scss'],
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent, ButtonComponent, NgIf, ControlBuilderComponent, MapComponent],
})
export class DispatchBillDetailsDialogComponent extends BaseDialogComponent<
  DispatchBillDetailsDialogData,
  DispatchBillDetailsDialogResult
> {
  public readonly plugins = inject(MfPluginsService);
  private navyApi = inject(NavyApiService);

  baseForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 3,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      billNumber: {
        control: formControl(),
        label: 'شماره قبض',
        suffixIcon: 'paper-details',
      },
      trafficNumber: {
        control: formControl(),
        label: 'شماره تردد',
        suffixIcon: 'code',
      },
      arrivalTime: {
        control: formControl(),
        label: 'زمان ورود',
        type: 'datetime',
      },
      checkoutTime: {
        control: formControl(),
        label: 'زمان خروج',
        type: 'datetime',
      },
      arrivalConfirmerName: {
        colspan: 4,
        control: formControl(),
        label: 'نام کاربر تایید کننده ورود',
        suffixIcon: 'user',
      },
      checkoutConfirmerName: {
        colspan: 4,
        control: formControl(),
        label: 'نام کاربر تایید کننده خروج',
        suffixIcon: 'user',
      },
      branchName: {
        colspan: 4,
        control: formControl(),
        label: 'نام شعبه',
        suffixIcon: 'branch',
      },
    },
  });

  weighingForm = formBuilder({
    cols: 6,
    defaults: {
      colspan: 3,
      floatLabel: 'always',
    },
    inputs: {
      contractType: {
        control: formControl(),
        label: 'نوع قرارداد',
        suffixIcon: 'paper',
        items: ShipmentOrderContractTypeValues,
        type: 'select',
      },
      itemName: {
        control: formControl(),
        label: 'قلم کالا',
        suffixIcon: 'cargo',
      },
    },
  });
  extrasForm = formBuilder({
    cols: 3,
    defaults: {
      colspan: 3,
      floatLabel: 'always',
      hideError: true,
    },
    inputs: {
      trafficStatus: {
        control: formControl(),
        label: 'وضعیت تردد',
        items: DispatchingTrafficStatusValues,
        type: 'select',
        suffixIcon: 'toggle',
      },
      trafficDuration: {
        control: formControl(),
        label: 'مدت زمان تردد',
        inputType: 'time',
        mask: 'time',
        suffixIcon: 'time',
      },
      arrivalNotes: {
        control: formControl(),
        label: 'توضیحات ورود',
        type: 'textarea',
        rows: 5,
      },
    },
  });
  notesForm = formBuilder({
    cols: 3,
    defaults: {
      colspan: 3,
      floatLabel: 'always',
      hideError: true,
    },
    inputs: {
      declineReason: {
        control: formControl(),
        label: 'توضیحات ابطال',
        type: 'textarea',
        rows: 5,
      },
      checkoutNotes: {
        control: formControl(),
        label: 'توضیحات خروج',
        type: 'textarea',
        rows: 5,
      },
    },
  });
  truckingCompanyForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 3,
      floatLabel: 'always',
    },
    inputs: {
      truckingCompanyName: {
        colspan: 4,
        control: formControl(),
        label: 'شرکت باربر',
        suffixIcon: 'company',
      },
      shipmentOrderNumber: {
        colspan: 4,
        control: formControl(),
        label: 'شماره دستور حمل',
        suffixIcon: 'sort-indicator',
      },
      shipmentOrderTitle: {
        colspan: 4,
        control: formControl(),
        label: 'عنوان دستور حمل',
        suffixIcon: 'field-edit',
      },
      driverName: {
        control: formControl(),
        label: 'نام راننده',
        suffixIcon: 'user',
      },
      vehicleCode: {
        control: formControl(),
        label: 'کد خودرو',
        suffixIcon: 'sort-indicator',
      },
      vehicleType: {
        control: formControl(),
        label: 'نوع خودرو',
        suffixIcon: 'truck',
      },
      vehiclePlateNumber: {
        control: formControl(),
        suffixIcon: 'item',
        type: 'plate',
      },
    },
  });

  mapRoute = signal<MapRoute | undefined>(undefined);

  constructor() {
    super();
    this.fillForms();
    this.setFormsReadonly();
    this.getRoute();
  }

  fillForms() {
    const forms = [this.baseForm, this.notesForm, this.extrasForm, this.weighingForm, this.truckingCompanyForm];
    for (const form of forms) {
      form.patchValue({ ...this.data });
    }
  }

  setFormsReadonly() {
    this.baseForm.setReadonly(true);
    this.notesForm.setReadonly(true);
    this.extrasForm.setReadonly(true);
    this.weighingForm.setReadonly(true);
    this.truckingCompanyForm.setReadonly(true);
  }

  getRoute() {
    if (!this.plugins.isNavyAvailable()) return;
    this.navyApi.getDispatchingTrafficRoute(this.data.id).subscribe(() => {
      // Replace result
      this.mapRoute.set({ start: { lat: 30.285566, lng: 57.043774 }, end: { lat: 30.294608, lng: 57.047379 } });
    });
  }
}
