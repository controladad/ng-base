import { Injectable } from '@angular/core';
import {
  PromptDialogComponent,
  PromptDialogData,
  PromptDialogResult,
} from './components/prompt-dialog/prompt-dialog.component';
import { DialogExtended, DialogInvokerService } from './dialog-invoker.service';
import { InputDialogComponent, InputDialogData } from './components/input-dialog/input-dialog.component';
import { DialogAction, DialogActionEvent } from './components/_base-dialog.component';
import { merge, Observable, take } from 'rxjs';
import {
  BillDetailsDialogComponent,
  BillDetailsDialogData,
  BillDetailsDialogResult,
} from './components/bill-details-dialog/bill-details-dialog.component';
import {
  BillStatusDialogComponent,
  BillStatusDialogData,
  BillStatusDialogResult,
} from './components/bill-status-dialog/bill-status-dialog.component';
import { RoleDialogComponent, RoleDialogData, RoleDialogResult } from './components/role-dialog/role-dialog.component';
import {
  BillDescriptionDialogComponent,
  BillDescriptionDialogData,
  BillDescriptionDialogResult,
} from './components/bill-description-dialog/bill-description-dialog.component';
import {
  DescriptionDialogComponent,
  DescriptionDialogData,
  DescriptionDialogResult,
} from './components/description-dialog/description-dialog.component';
import {
  ShipmentOrderCreateDialogData,
  ShipmentOrderCreateDialogComponent,
  ShipmentOrderCreateDialogResult,
} from './components/shipment-order-create-dialog/shipment-order-create-dialog.component';
import {
  UserCreateDialogComponent,
  UserCreateDialogData,
  UserCreateDialogResult,
} from './components/user-create-dialog/user-create-dialog.component';
import {
  DispatchBillDetailsDialogComponent,
  DispatchBillDetailsDialogData,
  DispatchBillDetailsDialogResult,
} from './components/dispatch-bill-details-dialog/dispatch-bill-details-dialog.component';
import {
  DispatchCreateVehicleDialogComponent,
  DispatchCreateVehicleDialogData,
  DispatchCreateVehicleDialogResult,
} from './components/dispatch-create-vehicle-dialog/dispatch-create-vehicle-dialog.component';
import { MapDialogComponent, MapDialogData, MapDialogResult } from './components/map-dialog/map-dialog.component';
import {
  ChangePasswordDialogComponent,
  ChangePasswordDialogResult,
} from './components/change-password-dialog/change-password-dialog.component';
import {
  ProfileDialogComponent,
  ProfileDialogDialogData,
  ProfileDialogDialogResult,
} from './components/profile-dialog/profile-dialog.component';
import {
  DispatchDetailsDialogComponent,
  DispatchDetailsDialogData,
  DispatchDetailsDialogResult,
} from './components/dispatch-details-dialog/dispatch-details-dialog.component';
import { CalendarDialogComponent, CalendarsDialogResult } from './components/calendar-dialog/calendar-dialog.component';
import { ReportDialogComponent, ReportDialogData } from './components/report-dialog/report-dialog.component';
import {
  DispatchDialogComponent,
  DispatchDialogData,
  DispatchDialogResult,
} from './components/dispatch-dialog/dispatch-dialog.component';
import {
  VehicleInfoDialogComponent,
  VehicleInfoDialogData,
  VehicleInfoDialogResult,
} from './components/vehicle-info-dialog/vehicle-info-dialog.component';

export interface InputDialogExtended<T, U> extends DialogExtended<InputDialogComponent<T, U>, U> {
  deleteAction: <ACTION>(action: DialogAction<null, ACTION>) => InputDialogExtended<T, U>;
  onDelete: () => Observable<DialogActionEvent<any, any>>;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: DialogInvokerService) {}

  prompt(data: PromptDialogData) {
    return this.dialog.open<PromptDialogComponent, PromptDialogData, PromptDialogResult>(PromptDialogComponent, data, {
      width: '85vw',
      maxWidth: '46rem',
    });
  }

  deletePrompt(multiple?: boolean) {
    const itemName = multiple ? 'موارد' : 'مورد';

    return this.prompt({
      title: `آیا از حذف ${itemName} انتخاب شده مطمئن هستید؟`,
      message: `با حذف ${itemName} انتخاب شده دیگر قادر به بازگردانی آن‌ها نخواهید بود. آیا حذف اطلاعات را تایید مکنید؟`,
      yesButtonText: 'بله، تایید می‌کنم.',
      noButtonText: 'خیر، لغو گردد.',
    }).setActionType('delete');
  }

  input<T, U>(data: InputDialogData<T, U>, width?: string) {
    const dialog = this.dialog.open<InputDialogComponent<T, U>, InputDialogData<T, U>, U>(InputDialogComponent, data, {
      width: width,
      minHeight: '17rem',
      maxWidth: '90vw',
      maxHeight: '90vh',
    }) as InputDialogExtended<T, U>;

    dialog.deleteAction = (a1) => {
      dialog.ref.componentInstance.bindActionToDelete(a1);
      return dialog;
    };
    dialog.onDelete = () => {
      return dialog.ref.componentInstance.onDeleteAction.asObservable().pipe(take(1));
    };
    dialog.action = (action) => {
      dialog.ref.componentInstance.bindActionToSubmit(action);
      return merge(
        dialog.ref.componentInstance.onAction.pipe(take(1)),
        dialog.ref.componentInstance.onDeleteAction.pipe(take(1)),
      ).pipe(take(1));
    };

    return dialog;
  }

  billDetails(data: BillDetailsDialogData) {
    return this.dialog.open<BillDetailsDialogComponent, BillDetailsDialogData, BillDetailsDialogResult>(
      BillDetailsDialogComponent,
      data,
      {
        maxWidth: '95vw',
        maxHeight: '97vh',
      },
    );
  }

  dispatchBillDetails(data: DispatchBillDetailsDialogData) {
    return this.dialog.open<
      DispatchBillDetailsDialogComponent,
      DispatchBillDetailsDialogData,
      DispatchBillDetailsDialogResult
    >(DispatchBillDetailsDialogComponent, data, {
      maxWidth: '95vw',
      maxHeight: '97vh',
    });
  }

  dispatchCreateVehicle(data: DispatchCreateVehicleDialogData) {
    return this.dialog.open<
      DispatchCreateVehicleDialogComponent,
      DispatchCreateVehicleDialogData,
      DispatchCreateVehicleDialogResult
    >(DispatchCreateVehicleDialogComponent, data, {
      maxWidth: '95vw',
      maxHeight: '97vh',
    });
  }

  dispatchDetails(data: DispatchDetailsDialogData) {
    return this.dialog.open<DispatchDetailsDialogComponent, DispatchDetailsDialogData, DispatchDetailsDialogResult>(
      DispatchDetailsDialogComponent,
      data,
      {
        width: '90%',
        maxWidth: '91vw',
        maxHeight: '90vh',
      },
    );
  }

  dispatch(data: DispatchDialogData) {
    return this.dialog.open<DispatchDialogComponent, DispatchDialogData, DispatchDialogResult>(
      DispatchDialogComponent,
      data,
      {
        width: '60%',
        maxWidth: '91vw',
        maxHeight: '90vh',
      },
    );
  }

  billStatus(data: BillStatusDialogData) {
    return this.dialog
      .open<BillStatusDialogComponent, BillStatusDialogData, BillStatusDialogResult>(BillStatusDialogComponent, data, {
        minWidth: '40rem',
      })
      .setActionType('update');
  }

  billDescription(data: BillDescriptionDialogData) {
    return this.dialog.open<BillDescriptionDialogComponent, BillDescriptionDialogData, BillDescriptionDialogResult>(
      BillDescriptionDialogComponent,
      data,
      {
        minWidth: '40rem',
      },
    );
  }

  description(data: DescriptionDialogData) {
    return this.dialog.open<DescriptionDialogComponent, DescriptionDialogData, DescriptionDialogResult>(
      DescriptionDialogComponent,
      data,
      {
        minWidth: '40rem',
      },
    );
  }

  role(data: RoleDialogData) {
    return this.dialog.open<RoleDialogComponent, RoleDialogData, RoleDialogResult>(RoleDialogComponent, data, {
      maxWidth: '91vw',
      minWidth: data.viewOnly ? '50vw' : '80vw',
      maxHeight: data.viewOnly ? '75vh' : '93vh',
      height: '100vh',
    });
  }

  shipmentOrder(data?: ShipmentOrderCreateDialogData) {
    return this.dialog.open<
      ShipmentOrderCreateDialogComponent,
      ShipmentOrderCreateDialogData,
      ShipmentOrderCreateDialogResult
    >(ShipmentOrderCreateDialogComponent, data, {
      minWidth: '92vw',
      maxHeight: '90vh',
    });
  }

  user(data?: UserCreateDialogData) {
    return this.dialog.open<UserCreateDialogComponent, UserCreateDialogData, UserCreateDialogResult>(
      UserCreateDialogComponent,
      data ?? {},
      {
        maxHeight: '95vh',
      },
    );
  }

  map(data: MapDialogData) {
    return this.dialog.open<MapDialogComponent, MapDialogData, MapDialogResult>(MapDialogComponent, data ?? undefined, {
      height: '50vh',
      minHeight: '570px',
      width: '90vw',
      minWidth: '720px',
    });
  }

  profile(data: ProfileDialogDialogData) {
    return this.dialog.open<ProfileDialogComponent, ProfileDialogDialogData, ProfileDialogDialogResult>(
      ProfileDialogComponent,
      data ?? {},
      {
        width: '25rem',
        maxWidth: '90vw',
      },
    );
  }

  changePassword() {
    return this.dialog.open<ChangePasswordDialogComponent, null, ChangePasswordDialogResult>(
      ChangePasswordDialogComponent,
    );
  }

  calendar() {
    return this.dialog.open<CalendarDialogComponent, null, CalendarsDialogResult>(CalendarDialogComponent, null, {
      width: '25rem',
      maxWidth: '90vw',
    });
  }

  reportPreview(data: ReportDialogData) {
    return this.dialog.open<ReportDialogComponent, ReportDialogData, null>(ReportDialogComponent, data, {
      width: '90vw',
      maxHeight: '90vh',
    });
  }

  vehicleInfo(data: VehicleInfoDialogData) {
    return this.dialog.open<VehicleInfoDialogComponent, VehicleInfoDialogData, VehicleInfoDialogResult>(
      VehicleInfoDialogComponent,
      data,
      {
        width: '50rem',
        maxWidth: '90vw',
        maxHeight: '90vh',
      },
    );
  }
}
