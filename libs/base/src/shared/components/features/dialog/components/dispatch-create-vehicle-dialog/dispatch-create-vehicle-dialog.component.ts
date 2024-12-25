import { Component, inject } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import { DialogLayoutComponent } from '../../../../layouts';
import { formBuilder, FormBuilderComponent } from '../../../form-builder';
import { of, switchMap, take } from 'rxjs';
import { Validators } from '@angular/forms';
import {
  BranchApiService,
  DriverApiService,
  DriverCertificateType,
  DriverCreate,
  formControl,
  TruckingCompanyApiService,
  VehicleApiService,
  VehicleCreate,
  VehicleOwnershipType,
  VehiclePlateType,
  VehicleTechnicalApprovalType,
  VehicleType,
} from '../../../../../../core';
import { ButtonClickEvent, ButtonComponent } from '../../../../ui';
import {
  DriverCertificateValues,
  GenderValues,
  VehicleOwnerShipValues,
  VehiclePlateValues,
  VehicleTechnicalApprovalValues,
  VehicleTypeValues,
} from '../../../../../data';
import { ValidatorCodeMelli, ValidatorPhoneNumber } from '../../../../../validators';

export type DispatchCreateVehicleDialogData = {};

export type DispatchCreateVehicleDialogResult = boolean;

@Component({
  selector: 'feature-dispatch-create-vehicle-dialog',
  templateUrl: './dispatch-create-vehicle-dialog.component.html',
  styleUrls: ['./dispatch-create-vehicle-dialog.component.scss'],
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent, ButtonComponent],
})
export class DispatchCreateVehicleDialogComponent extends BaseDialogComponent<
  DispatchCreateVehicleDialogData,
  DispatchCreateVehicleDialogResult
> {
  private vehicleApi = inject(VehicleApiService);
  private driverApi = inject(DriverApiService);
  private branchApi = inject(BranchApiService);
  private truckingCompanyApi = inject(TruckingCompanyApiService);

  driverForm = formBuilder({
    cols: 6,
    defaults: {
      colspan: 6,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      firstName: {
        control: formControl<string>(undefined, Validators.required),
        label: 'نام',
        colspan: 3,
        suffixIcon: 'user',
      },
      lastName: {
        control: formControl<string>(undefined, Validators.required),
        colspan: 3,
        label: 'نام خانوادگی',
        suffixIcon: 'user',
      },
      certificateType: {
        control: formControl<DriverCertificateType>(undefined, Validators.required),
        type: 'select',
        items: DriverCertificateValues,
        label: 'نوع گواهینامه',
        suffixIcon: 'certificate',
        searchable: false,
      },
      licenseNumber: {
        control: formControl<string>(undefined, Validators.required),
        inputType: 'number-nobtn',
        label: 'شماره گواهینامه',
        suffixIcon: 'code',
      },
      phoneNumber: {
        control: formControl<string>(undefined, [Validators.required, ValidatorPhoneNumber()]),
        label: 'شماره ثابت',
        suffixIcon: 'landline-phone',
      },
    },
  });

  driverSecondForm = formBuilder({
    cols: 6,
    defaults: {
      colspan: 3,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      nationalCode: {
        control: formControl<string>(undefined, [Validators.required, ValidatorCodeMelli()]),
        inputType: 'number-nobtn',
        label: 'کد ملی',
        suffixIcon: 'sort-indicator',
      },
      gender: {
        control: formControl<string>(undefined, Validators.required),
        type: 'select',
        items: GenderValues,
        label: 'جنسیت',
        searchable: false,
      },

      mobileNumber: {
        control: formControl<string>(undefined, [Validators.required, ValidatorPhoneNumber()]),
        inputType: 'number-nobtn',
        colspan: 6,
        label: 'شماره همراه',
        suffixIcon: 'phone',
      },
      address: {
        control: formControl<string>(undefined, Validators.required),
        label: 'آدرس',
        colspan: 6,
        suffixIcon: 'location',
        type: 'textarea',
        rows: 5,
      },
    },
  });

  vehicleForm = formBuilder({
    cols: 12,
    defaults: {
      colspan: 3,
      clearable: false,
      floatLabel: 'always',
    },
    inputs: {
      vehicleName: {
        control: formControl<string>(undefined, Validators.required),
        label: 'نام وسیله نقلیه',
        suffixIcon: 'truck',
      },
      vehicleType: {
        control: formControl<VehicleType>(undefined, Validators.required),
        label: 'نوع وسیله نقلیه',
        type: 'select',
        items: VehicleTypeValues,
        suffixIcon: 'vehicle',
      },
      vehicleCode: {
        control: formControl<string>(undefined),
        label: 'کد وسیله نقلیه',
        suffixIcon: 'sort-indicator',
      },
      carRoomType: {
        control: formControl<string>(undefined, Validators.required),
        label: 'نوع کابین',
        suffixIcon: 'transport',
      },
      vehicleWeigh: {
        control: formControl<number>(undefined, Validators.required),
        inputType: 'number-nobtn',
        label: 'وزن خودرو',
        suffixIcon: 'weight',
        suffix: 'kg',
      },
      vehicleCapacity: {
        control: formControl<number>(undefined, Validators.required),
        inputType: 'number-nobtn',
        label: 'ظرفیت خودرو',
        suffixIcon: 'weight',
        suffix: 'kg',
      },
      maximumWeightAllowed: {
        control: formControl<number>(undefined, Validators.required),
        inputType: 'number-nobtn',
        label: 'حداکثر ظرفیت مجاز',
        suffixIcon: 'weight',
        suffix: 'kg',
      },
      ownershipStatus: {
        control: formControl<VehicleOwnershipType>(undefined, Validators.required),
        label: 'وضعیت مالکیت',
        type: 'select',
        items: VehicleOwnerShipValues,
        suffixIcon: 'ownership',
      },
      plateType: {
        control: formControl<VehiclePlateType>(undefined, Validators.required),
        label: 'نوع پلاک',
        type: 'select',
        items: VehiclePlateValues,
      },
      branchList: {
        control: formControl<number[]>(undefined, Validators.required),
        label: ' شعبه',
        type: 'select',
        items: this.branchApi.getItems(),
        multiple: true,
        suffixIcon: 'branch',
      },
      technicalApproval: {
        control: formControl<VehicleTechnicalApprovalType>(undefined, Validators.required),
        label: 'تاییدیه فنی',
        type: 'select',
        items: VehicleTechnicalApprovalValues,
      },
      expirationDate: {
        control: formControl<string>(undefined, Validators.required),
        label: 'تاریخ انقضا',
        type: 'date',
      },
      truckingCompanyId: {
        control: formControl<number>(undefined, Validators.required),
        label: 'شرکت باربر',
        type: 'select',
        items: [],
        colspan: 5,
        suffixIcon: 'company',
      },
      rfidCode: {
        control: formControl<string>(undefined, Validators.required),
        label: 'کد RFID',
        colspan: 4,
        suffixIcon: 'rfid-tag',
      },
      plateNumber: {
        control: formControl<string>(undefined, Validators.required),
        label: 'شماره پلاک',
        type: 'plate',
        colspan: 3,
        suffixIcon: 'plate',
      },
    },
    onInit: (controls) => {
      this.vehicleForm.updateInput('truckingCompanyId', {
        items: controls.branchList.value$.pipe(
          switchMap((value) => (value ? this.truckingCompanyApi.getItems(value) : of([]))),
        ),
      });
    },
  });

  constructor() {
    super();
  }

  validateForms() {
    return this.driverForm.validate() && this.driverSecondForm.validate() && this.vehicleForm.validate();
  }

  onSubmit(e: ButtonClickEvent) {
    if (!this.validateForms()) return;
    const driverModel = {
      ...this.driverForm.getValue()!,
      ...this.driverSecondForm.getValue()!,
    } as DriverCreate;

    e.setLoading(true);
    this.driverApi
      .create(driverModel)
      .pipe(take(1))
      .subscribe((res) => {
        const driverId = (res as { id: number }).id;
        if (driverId) {
          const vehicleModel = this.vehicleForm.getValue()! as VehicleCreate;
          this.vehicleApi
            .create({ ...vehicleModel, driverId })
            .pipe(take(1))
            .subscribe(() => {
              e.setLoading(false);
              snackbar$.show('خودرو جدید با موفقیت اضافه شد.');
              this.close(true);
            });
        }
      });
  }
}
