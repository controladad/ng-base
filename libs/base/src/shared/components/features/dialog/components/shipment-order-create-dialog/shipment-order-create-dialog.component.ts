import { Component, inject } from '@angular/core';
import { DialogLayoutComponent } from '../../../../layouts';
import { BaseDialogComponent } from '../_base-dialog.component';
import { Validators } from '@angular/forms';
import { ButtonClickEvent, FieldComponent } from '../../../../ui';
import { NgIf } from '@angular/common';
import { merge, of, startWith, switchMap, tap } from 'rxjs';
import {
  BranchApiService,
  EntezamatApiService,
  formControl,
  ItemApiService,
  ShipmentOrderApiService,
  ShipmentOrderContractType,
  ShipmentOrderEntity,
  ShipmentOrderNumberOfWeighingType,
  ShipmentOrderType,
  StatusType,
  TruckingCompanyApiService,
} from '../../../../../../core';
import {
  BooleanValues,
  ShipmentOrderContractTypeValues,
  ShipmentOrderNumberOfWeighingTypeValues,
  ShipmentOrderTypeValues,
  StatusValues,
} from '../../../../../data';
import { formBuilder, FormBuilderComponent } from '../../../form-builder';
import { MfPluginsService } from '@mf';

export interface ShipmentOrderCreateDialogData {
  item?: ShipmentOrderEntity;
  totalweight?: number;
}

export type ShipmentOrderCreateDialogResult = {
  result: boolean;
};

@Component({
  selector: 'feature-shipment-order-create-dialog',
  standalone: true,
  templateUrl: './shipment-order-create-dialog.component.html',
  styleUrls: ['./shipment-order-create-dialog.component.scss'],
  imports: [DialogLayoutComponent, FieldComponent, NgIf, FormBuilderComponent],
})
export class ShipmentOrderCreateDialogComponent extends BaseDialogComponent<
  ShipmentOrderCreateDialogData,
  ShipmentOrderCreateDialogResult
> {
  private itemService = inject(ItemApiService);
  private branchApiService = inject(BranchApiService);
  private entezamatApiService = inject(EntezamatApiService);
  private truckingCompanyApi = inject(TruckingCompanyApiService);
  private shipmentOrderApi = inject(ShipmentOrderApiService);
  protected plugins = inject(MfPluginsService);

  contractForm = formBuilder({
    cols: 4,
    inputs: {
      contractType: {
        control: formControl<ShipmentOrderContractType>('Tonnage', Validators.required),
        label: 'نوع قرارداد',
        type: 'select',
        items: ShipmentOrderContractTypeValues,
        clearable: false,
        searchable: false,
      },
    },
    onInit: () => {
      this.contractForm.setDisabled(!!this.data.item, 'contractType');
    },
    onAfterInit: (controls) => {
      return controls.contractType.value$.pipe(
        tap((value) => {
          this.weighingForm.setDisabled(value === 'Volume');
          this.entezamatForm.controls.needsEntezamatConfirmation.setDisabled(value === 'Volume');
          if (value === 'Volume') this.entezamatForm.reset();
        }),
      );
    },
  });

  baseForm = formBuilder({
    cols: 4,
    inputs: {
      shipmentOrderTitle: { control: formControl<string>(undefined, Validators.required), label: 'عنوان دستور حمل' },
      shipmentOrderNumber: { control: formControl<string>(undefined, Validators.required), label: 'شماره دستور حمل' },
      itemId: {
        control: formControl<number>(undefined, Validators.required),
        label: 'قلم کالا',
        type: 'select',
        items: this.itemService.getItems(),
      },
      expirationDate: {
        control: formControl<string>(),
        label: 'تاریخ انقضا (اختیاری)',
        type: 'date',
      },
      totalWeight: {
        control: formControl<number | undefined>(),
        label: 'بار حمل شده (کیلوگرم)',
      },
      contractNumber: {
        control: formControl<string>(undefined, Validators.required),
        label: 'شماره قرارداد',
      },
      branchID: {
        control: formControl<number>(undefined, Validators.required),
        label: 'شعبه',
        type: 'select',
        items: this.branchApiService.getItems(),
      },
      truckingCompanyId: {
        control: formControl<number>(undefined, Validators.required),
        label: ' شرکت حمل',
        type: 'select',
        items: [],
      },
      status: {
        control: formControl<StatusType>('Active', Validators.required),
        type: 'select',
        label: 'وضعیت',
        searchable: false,
        clearable: false,
        items: StatusValues,
      },
    },
    onInit: (controls) => {
      this.baseForm.updateInput('truckingCompanyId', {
        items: controls.branchID.value$.pipe(
          switchMap((id) => (id ? this.truckingCompanyApi.getItems(id).pipe(startWith(undefined)) : of([]))),
        ),
      });
    },
    onAfterInit: () => {
      this.baseForm.setDisabled(!!this.data.item, 'truckingCompanyId', 'branchID');
      this.baseForm.setDisabled(true, 'totalWeight');
      this.baseForm.setHidden(!this.data.item, 'totalWeight');
    },
  });

  entezamatForm = formBuilder({
    cols: 5,
    inputs: {
      needsEntezamatConfirmation: {
        control: formControl<boolean>(false, Validators.required),
        label: 'نیاز به تایید انتظامات',
        type: 'select',
        items: BooleanValues,
        searchable: false,
      },
      maximumShipmentTime: {
        control: formControl<number>(undefined, Validators.required),
        label: 'زمان مجاز حمل',
        suffixIcon: 'time',
        mask: 'time',
      },
      entezamatIDs: {
        control: formControl<number[]>(undefined, Validators.required),
        label: 'انتظامات',
        type: 'select',
        items: [],
        multiple: true,
      },
      defaultEntezamatID: {
        control: formControl<number>(undefined, []),
        label: 'انتظامات پیش فرض (اختیاری)',
        type: 'select',
        items: [],
      },
      neetToWeighingAtDestination: {
        control: formControl<boolean>(false),
        label: 'نیاز به توزین در مقصد',
        type: 'select',
        items: BooleanValues,
      },
      permissibleRangeOfWeightDifference: {
        control: formControl<number>(undefined, [Validators.required, Validators.min(0)]),
        label: 'محدوده مجاز اختلاف وزن',
        inputType: 'number-nobtn',
      },
    },
    onInit: (controls) => {
      this.entezamatForm.updateInput('entezamatIDs', {
        items: this.baseForm.controls.branchID.value$.pipe(
          switchMap((id) => (id ? this.entezamatApiService.getItems(id).pipe(startWith(undefined)) : of([]))),
        ),
      });
      this.entezamatForm.updateInput('defaultEntezamatID', {
        items: controls.entezamatIDs.selectedItems$.pipe(),
      });
    },
    onAfterInit: (controls) => {
      return merge(
        controls.needsEntezamatConfirmation.value$.pipe(
          tap((value) => {
            this.entezamatForm.setDisabled(
              !value,
              'entezamatIDs',
              'defaultEntezamatID',
              'maximumShipmentTime',
              'neetToWeighingAtDestination',
            );
          }),
        ),
        controls.neetToWeighingAtDestination.value$.pipe(
          tap((value) => {
            controls.permissibleRangeOfWeightDifference.setDisabled(!value);
          }),
        ),
      );
    },
  });

  weighingForm = formBuilder({
    cols: 5,
    inputs: {
      numberOfWeighing: {
        control: formControl<ShipmentOrderNumberOfWeighingType>(undefined, Validators.required),
        label: 'نوع توزین',
        type: 'select',
        items: ShipmentOrderNumberOfWeighingTypeValues,
        searchable: false,
      },
      shipmentOrderType: {
        control: formControl<ShipmentOrderType>(undefined, Validators.required),
        label: 'نوع حمل',
        type: 'select',
        items: ShipmentOrderTypeValues,
        searchable: false,
      },
      initialWeighingValidityPeriod: {
        control: formControl<number>(undefined, Validators.required),
        mask: 'time',
        label: 'مقدار زمان مجاز یکبار-توزین',
        suffixIcon: 'time',
      },
      carriedSumPermissibleLoad: {
        control: formControl<number | null>(undefined),
        label: 'مجموع بار مجاز قابل حمل',
        inputType: 'number-nobtn',
        suffix: 'کیلوگرم',
        floatLabel: 'always',
      },
      excessOfCarriedSumPermissibleLoad: {
        control: formControl<number | null>(undefined),
        label: 'مازاد مجموع بار مجاز قابل حمل',
        inputType: 'number-nobtn',
        suffix: 'کیلوگرم',
        floatLabel: 'always',
      },
    },
    onAfterInit: (controls) => {
      return merge(
        controls.numberOfWeighing.value$.pipe(
          tap((value) => {
            const contractType = this.contractForm.controls.contractType.value;
            if (contractType === 'Volume') return;
            console.log(contractType);
            const isOnceWeighed = value === 'OnceWeighed';

            controls.initialWeighingValidityPeriod.setDisabled(!isOnceWeighed);
            if (!isOnceWeighed) {
              controls.initialWeighingValidityPeriod.reset();
            }
            controls.initialWeighingValidityPeriod.updateValueAndValidity();
          }),
        ),
        controls.carriedSumPermissibleLoad.value$.pipe(
          tap((value) => {
            controls.excessOfCarriedSumPermissibleLoad.setDisabled((value ?? 0) <= 0);
            if (value) {
              controls.excessOfCarriedSumPermissibleLoad.setValidators([Validators.required]);
            } else {
              controls.excessOfCarriedSumPermissibleLoad.reset();
              controls.excessOfCarriedSumPermissibleLoad.clearValidators();
            }
            controls.excessOfCarriedSumPermissibleLoad.updateValueAndValidity();
          }),
        ),
      );
    },
  });

  constructor() {
    super();

    const values = this.data.item;

    this.contractForm.patchValue({
      contractType: values?.contractType ?? 'Tonnage',
    });
    this.baseForm.patchValue({
      ...values,
      itemId: values?.item.id,
      branchID: values?.branch.id,
      truckingCompanyId: values?.truckingCompany.id,
      totalWeight: this.data.totalweight,
    });
    this.weighingForm.patchValue({
      ...values,
    });
    this.entezamatForm.patchValue({
      ...values,
      entezamatIDs: values?.entezamats?.map((t) => t.id),
      defaultEntezamatID: values?.defaultEntezamat?.id,
    });
  }

  onSubmit(e: ButtonClickEvent) {
    const contractValues = this.contractForm.getValue();
    const baseValues = this.baseForm.getValue();
    const weightValues = this.weighingForm.getValue();
    const entezamatValues = this.plugins.isEntezamatAvailable() ? this.entezamatForm.getValue() : {};

    if (!contractValues || !baseValues || !this.weighingForm.validate()) return;
    if (contractValues.contractType === 'Volume' ? !baseValues || !weightValues || !entezamatValues : false) return;

    const data = {
      ...contractValues,
      ...baseValues,
      ...weightValues,
      ...entezamatValues,
    };

    delete data.totalWeight;

    if (!data.carriedSumPermissibleLoad) {
      data.carriedSumPermissibleLoad = null;
    }

    (this.data.item ? this.shipmentOrderApi.update(this.data.item.id, data) : this.shipmentOrderApi.create(data))
      .pipe(e.pipe())
      .subscribe(() => {
        this.submit({ result: true });
      });
  }
}
