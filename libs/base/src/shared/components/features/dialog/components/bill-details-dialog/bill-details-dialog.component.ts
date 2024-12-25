import { Component, inject, signal, ViewChild } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import {
  BillEntity,
  formControl,
  getFullName,
  getFromItemRecord,
  getJalaliDate,
  getPureWeight,
  OtherBillEntity,
  getDurationInHHMM,
  NavyApiService,
} from '../../../../../../core';
import { DialogLayoutComponent } from '../../../../layouts';
import { formBuilder, FormBuilderComponent } from '../../../form-builder';
import {
  BillAdminStatusValues,
  BillStatusValues,
  BooleanValues,
  ShipmentOrderNumberOfWeighingTypeValues,
  ShipmentOrderTypeValues,
  VehicleTypeValues,
} from '../../../../../data';
import { ButtonClickEvent, ButtonComponent } from '../../../../ui';
import { NgIf } from '@angular/common';
import { AlxPrintDirective, AlxPrintModule } from '@al00x/printer';
import { PrintableBillComponent } from '../../../printable-bill';
import { BottomControlsComponent } from '../../../bottom-controls';
import { DialogInvokerService } from '../../dialog-invoker.service';
import {
  BillDescriptionDialogComponent,
  BillDescriptionDialogData,
  BillDescriptionDialogResult,
} from '../bill-description-dialog/bill-description-dialog.component';
import { MfPluginsService } from '@mf';

export interface BillDetailsDialogData {
  bill: BillEntity | OtherBillEntity;
  hideExtraDetails?: boolean;
  print?: boolean;
  addDescription?: boolean;
}

export interface BillDetailsDialogResult {
  description?: string;
}

@Component({
  selector: 'feature-bill-details-dialog',
  standalone: true,
  imports: [
    DialogLayoutComponent,
    FormBuilderComponent,
    ButtonComponent,
    NgIf,
    AlxPrintModule,
    PrintableBillComponent,
    BottomControlsComponent,
  ],
  templateUrl: './bill-details-dialog.component.html',
  styleUrls: ['./bill-details-dialog.component.scss'],
})
export class BillDetailsDialogComponent extends BaseDialogComponent<BillDetailsDialogData, BillDetailsDialogResult> {
  private readonly dialogInvoker = inject(DialogInvokerService);
  private readonly navyApi = inject(NavyApiService);
  public readonly plugins = inject(MfPluginsService);

  @ViewChild('Printer') printer!: AlxPrintDirective;

  baseForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 2,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      billNumber: {
        colspan: 3,
        control: formControl(),
        label: 'شماره قبض',
        suffixIcon: 'paper-details',
      },
      shipmentOrderType: {
        colspan: 3,
        control: formControl(),
        label: 'نوع حمل',
        suffixIcon: 'truck',
      },
      initialWeightDate: {
        colspan: 3,
        control: formControl(),
        label: 'تاریخ',
        suffixIcon: 'calendar',
      },
      initialWeightTime: {
        colspan: 3,
        control: formControl(),
        label: 'ساعت',
        suffixIcon: 'time',
      },
      station: {
        control: formControl(),
        label: 'نام ایستگاه',
        suffixIcon: 'location-check',
      },
      entezamat: {
        control: formControl(),
        label: 'انتظامات',
        suffixIcon: 'security',
      },
      entezamatDefault: {
        control: formControl(),
        label: 'انتظامات پیشفرض',
        suffixIcon: 'security',
      },
      branch: {
        control: formControl(),
        label: 'شعبه',
        suffixIcon: 'branch',
      },
      user: {
        control: formControl(),
        label: 'نام کاربر',
        suffixIcon: 'user',
      },
      recipient: {
        control: formControl(),
        label: 'نام کاربر تائید کننده',
        suffixIcon: 'user',
      },
    },
  });
  weightForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 2,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      pureWeight: {
        control: formControl(),
        label: 'وزن خالص بار',
        suffixIcon: 'weight',
        suffix: 'KG',
      },
      initialWeight: {
        control: formControl(),
        label: 'وزن اولیه',
        suffixIcon: 'weight',
        suffix: 'KG',
      },
      secondaryWeight: {
        control: formControl(),
        label: 'وزن ثانویه',
        suffixIcon: 'weight',
        suffix: 'KG',
      },
      weighingCount: {
        control: formControl(),
        label: 'نوع توزین',
        suffixIcon: 'sort-indicator',
      },
      itemName: {
        colspan: 4,
        control: formControl(),
        label: 'قلم کالا',
        suffixIcon: 'cargo',
      },
      shouldWeighAtDestination: {
        colspan: 4,
        control: formControl(true),
        label: 'نیاز به توزین در مقصد',
        type: 'select',
        items: BooleanValues,
      },
      deliveryWeight: {
        colspan: 4,
        control: formControl(),
        label: 'وزن تحویل',
        suffix: 'KG',
        suffixIcon: 'weight',
      },
      netDeliveryWeight: {
        colspan: 4,
        control: formControl(),
        label: 'بار خالص تحویل',
        suffix: 'KG',
        suffixIcon: 'weight',
      },
    },
  });
  stateForm = formBuilder({
    cols: 2,
    defaults: {
      colspan: 2,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      shippingTime: {
        control: formControl(),
        label: 'مدت زمان تردد',
        suffixIcon: 'time',
      },
      delayTime: {
        control: formControl(),
        label: 'مدت زمان تاخیر',
        suffixIcon: 'stopwatch',
      },
      adminStatus: {
        control: formControl(),
        label: 'وضعیت قبض',
        suffixIcon: 'paper-details',
      },
      billStatus: {
        control: formControl(),
        label: 'وضعیت بار',
        suffixIcon: 'cargo',
      },
    },
  });
  descriptionForm = formBuilder({
    cols: 2,
    defaults: {
      colspan: 1,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      deliveryExplanation: {
        control: formControl(),
        label: 'توضیح تحویل قبض',
        type: 'textarea',
        rows: 5,
      },
      submitExplanation: {
        control: formControl(),
        label:
          this.isMainBill(this.data.bill) && this.data.bill.adminStatus === 'Canceled'
            ? 'توضیح ابطال قبض'
            : 'توضیح تائید نهایی',
        type: 'textarea',
        rows: 5,
      },
      initialExplanation: {
        control: formControl(),
        label: 'توضیح ثبت موقت قبض',
        type: 'textarea',
        rows: 5,
      },
      secondaryExplanation: {
        control: formControl(),
        label: 'توضیح ثبت نهایی قبض',
        type: 'textarea',
        rows: 5,
      },
    },
  });
  companyForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 4,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      truckingCompany: {
        control: formControl(),
        label: 'شرکت باربر',
        suffixIcon: 'building',
      },
      shipmentOrderNumber: {
        control: formControl(),
        label: 'شماره دستور حمل',
        suffixIcon: 'sort-indicator',
      },
      rfidTag: {
        control: formControl(),
        label: 'سریال تگ',
        suffixIcon: 'hashtag',
      },
      driver: {
        control: formControl(),
        label: 'نام راننده',
        suffixIcon: 'user',
      },
      vehicleType: {
        colspan: 5,
        control: formControl(),
        label: 'نوع خودرو',
        suffixIcon: 'truck',
      },
      plateNumber: {
        colspan: 2,
        control: formControl(),
        // label: 'پلاک',
        type: 'plate',
      },
      vehicleCode: {
        control: formControl(),
        label: 'کد خودرو',
      },
    },
  });

  isOtherBill = signal(false);
  description = signal<string | undefined>(undefined);

  constructor() {
    super();

    if (!this.plugins.isEntezamatAvailable()) {
      this.baseForm.hide('entezamat', 'entezamatDefault');
      this.weightForm.hide('shouldWeighAtDestination', 'deliveryWeight', 'netDeliveryWeight');
      this.baseForm.updateInput('station', { colspan: 3 });
      this.baseForm.updateInput('branch', { colspan: 3 });
      this.baseForm.updateInput('user', { colspan: 3 });
      this.baseForm.updateInput('recipient', { colspan: 3 });
    }
    if (this.isOtherBill()) {
      this.weightForm.hide('shouldWeighAtDestination', 'deliveryWeight', 'netDeliveryWeight');
    }
    const bill = this.data.bill;

    this.fillGeneralBillInfo(bill);
    if (this.isMainBill(bill)) {
      // Main bill
      this.fillMainBillInfo(bill);
    } else {
      // Other bill
      this.isOtherBill.set(true);
      this.fillOtherBillInfo(bill);

      this.weightForm.updateInput('itemName', { colspan: 6 });
      this.weightForm.hide('weighingCount');

      this.companyForm.hide('rfidTag', 'shipmentOrderNumber');
      this.companyForm.updateInput('driver', { colspan: 3 });
      this.companyForm.updateInput('truckingCompany', { colspan: 3 });
      this.companyForm.updateInput('vehicleType', { colspan: 3 });
      this.companyForm.updateInput('plateNumber', { colspan: 3 });
    }

    this.baseForm.setReadonly(true);
    this.weightForm.setReadonly(true);
    this.companyForm.setReadonly(true);
    this.descriptionForm.setReadonly(true);
    this.stateForm.setReadonly(true);
  }

  onAddDescription() {
    this.dialogInvoker
      .open<BillDescriptionDialogComponent, BillDescriptionDialogData, BillDescriptionDialogResult>(
        BillDescriptionDialogComponent,
        {
          description: (this.data.bill as BillEntity).deliveryDescription,
        },
      )
      .afterSubmit()
      .subscribe((result) => {
        this.description.set(result.description);
        this.onSubmit();
      });
  }

  onOpenMapRoute(e: ButtonClickEvent) {
    this.navyApi
      .getBillRoute(this.data.bill.id)
      .pipe(e.pipe())
      .subscribe(() => {
        dialog$.map({ start: { lat: 30.285566, lng: 57.043774 }, end: { lat: 30.294608, lng: 57.047379 } });
      });
  }

  onSubmit() {
    this.submit({
      description: this.description(),
    });
  }

  private fillGeneralBillInfo(bill: BillDetailsDialogData['bill']) {
    const isMainBill = this.isMainBill(bill);

    if (this.data.hideExtraDetails) {
      this.baseForm.hide('recipient');
    }

    this.baseForm.patchValue({
      user: getFullName(bill.user),
      recipient: isMainBill ? getFullName(bill.recipient) : '',
      station: 'station' in bill ? bill.station.stationName : bill.weighingStation?.stationName,
      initialWeightDate: getJalaliDate(bill.dateTimeOfInitialWeight),
      initialWeightTime: getJalaliDate(bill.dateTimeOfInitialWeight, 'HH:mm'),
      shipmentOrderType: getFromItemRecord(
        ShipmentOrderTypeValues,
        isMainBill ? bill.shipmentOrder.shipmentOrderType : bill.shipmentOrderType,
      )?.label,
      branch: bill.branch.name,
      billNumber: bill.billNumber,
      entezamatDefault: isMainBill ? bill.shipmentOrder?.defaultEntezamat?.name : '',
      entezamat: isMainBill && bill.shipmentOrder.needsEntezamatConfirmation ? bill.entezamat?.name : '',
    });
    this.weightForm.patchValue({
      pureWeight: getPureWeight(bill),
      initialWeight: bill.initialWeight,
      secondaryWeight: bill.secondaryWeight,
      itemName: isMainBill ? bill.shipmentOrder.item.itemName : bill.item.itemName,
      shouldWeighAtDestination: isMainBill ? bill.shouldWeighAtDestination : undefined,
      deliveryWeight: isMainBill ? bill.deliveryWeight : undefined,
      netDeliveryWeight: isMainBill ? bill.netDeliveryWeight : undefined,
      weighingCount: isMainBill
        ? getFromItemRecord(ShipmentOrderNumberOfWeighingTypeValues, bill.shipmentOrder?.numberOfWeighing)?.label
        : '',
    });
  }

  private fillMainBillInfo(bill: BillEntity) {
    this.companyForm.patchValue({
      driver: getFullName(bill.vehicle.driver),
      truckingCompany: bill.shipmentOrder.truckingCompany.truckingCompanyName,
      shipmentOrderNumber: bill.shipmentOrder.shipmentOrderNumber,
      plateNumber: bill.vehicle.plateNumber,
      rfidTag: bill.vehicle.rfidCode,
      vehicleType: getFromItemRecord(VehicleTypeValues, bill.vehicle.vehicleType)?.label,
      vehicleCode: bill.vehicle.vehicleCode,
    });
    this.stateForm.patchValue({
      adminStatus: getFromItemRecord(BillAdminStatusValues, bill.adminStatus)?.label,
      billStatus: getFromItemRecord(BillStatusValues, bill.billStatus)?.label,
      delayTime: bill.delayedLoad && bill.delayAmount ? getDurationInHHMM(bill.delayAmount) : 'بدون تاخیر',
      shippingTime: bill.shippingTime ? getDurationInHHMM(bill.shippingTime) : '',
    });
    this.descriptionForm.patchValue({
      deliveryExplanation: bill.deliveryDescription,
      submitExplanation: bill.adminStatus !== 'Canceled' ? bill.submitDescription : bill.canceledDescription,
      initialExplanation: bill.initialDescription,
      secondaryExplanation: bill.secondaryDescription,
    });
  }

  private fillOtherBillInfo(bill: OtherBillEntity) {
    this.companyForm.patchValue({
      truckingCompany: bill.companyName,
      driver: bill.driverName,
      vehicleType: getFromItemRecord(VehicleTypeValues, bill.vehicleType)?.label,
      plateNumber: bill.plateNumber,
    });
    this.descriptionForm.patchValue({
      initialExplanation: bill.basicExplanation,
      secondaryExplanation: bill.finalExplanation,
    });
    this.baseForm.setHidden(true, 'entezamat', 'entezamatDefault', 'recipient');
    this.descriptionForm.setHidden(true, 'submitExplanation', 'deliveryExplanation');
    this.companyForm.setHidden(true, 'vehicleCode');
  }

  private isMainBill(bill: typeof this.data.bill): bill is BillEntity {
    return 'shipmentOrder' in bill;
  }
}
