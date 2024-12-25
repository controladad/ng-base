import { computed, Injectable, signal } from '@angular/core';
import { BaseApi } from './_base-api';
import { DynamicRoleCreate, DynamicRoleEntity, DynamicRoleUpdate } from '../../models';
import { of, take, tap } from 'rxjs';
import { ActionTypes, flatten, getAllActions, permissionActionToLabel, permissionNameToKey } from '../../helpers';
import { AtLeast, Singleton } from '../../interfaces';

interface PermissionRaw {
  value: string;
  label: string;
  permissions: (ActionTypes | AtLeast<PermissionItem, 'action'>)[];
}

export interface PermissionFlatten {
  name: string;
  label: string;
  action: ActionTypes;
  actionLabel: string;
  permission: string | null;
}

export interface PermissionItem {
  action: ActionTypes;
  label: string;
  // passing null to the value will remove the key from the permission (it should have children tho)
  value: string | null;
  permissions?: PermissionItem[];
}

export interface Permission {
  value: string;
  label: string;
  permissions: PermissionItem[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleApiService extends BaseApi<DynamicRoleEntity, DynamicRoleCreate, DynamicRoleUpdate> {
  permissionsRaw = signal<PermissionRaw[] | undefined>(undefined);

  public permissions = computed<Permission[] | undefined>(() => {
    const rawList = this.permissionsRaw();
    if (!rawList) return undefined;

    function mergeSubPermissions(entry: PermissionRaw, perm: Singleton<PermissionRaw['permissions']>): PermissionItem {
      if (typeof perm === 'string') {
        return { action: perm, label: permissionActionToLabel(perm), value: permissionNameToKey(entry.value, perm) };
      }
      return {
        action: perm.action,
        label: perm.label ?? permissionActionToLabel(perm.action),
        value: perm.value !== null ? perm.value ?? permissionNameToKey(entry.value, perm.action) : null,
        permissions: perm.permissions,
      };
    }

    return rawList.map((entry) => ({
      label: entry.label,
      value: entry.value,
      permissions: entry.permissions.map((perm) => mergeSubPermissions(entry, perm)),
    }));
  });

  public permissionsFlatten = computed<PermissionFlatten[] | undefined>(() => {
    const list = this.permissions();
    if (!list) return undefined;

    const minifiedList = list?.map((t) => ({
      ...t,
      permissions: flatten(t.permissions.map((perm) => [perm, ...(perm.permissions ?? [])])),
    }));

    return flatten(
      minifiedList.map((entry) =>
        flatten(
          entry.permissions.map((perm) => [
            this.mapPermissionItemToFlatten(entry, perm),
            ...(perm.permissions?.map((innerPerm) => this.mapPermissionItemToFlatten(entry, innerPerm)) ?? []),
          ]),
        ),
      ),
    );
  });

  constructor() {
    super('DynamicRole');
  }

  getItems() {
    return super.getItemRecords('name');
  }

  // initialize permissions state by fetching the list and saving it into the memory
  fetchPermissions() {
    return this.getPermissions().pipe(
      tap((result) => {
        this.permissionsRaw.set(result);
      }),
    );
  }

  // Get permission keys, sorted by actions
  getPermissionKeys(name: string): { [p in ActionTypes]: string[] } | undefined {
    const permissions = this.permissions();
    if (!permissions) {
      console.error('Trying to get permission keys but Permissions are not initialized');
      return undefined;
    }

    const result: any = {};

    for (const action of getAllActions()) {
      result[action] = [];
    }

    function mergePermissions(item: PermissionItem): string[] {
      const subKeys = item.permissions?.length ? flatten(item.permissions.map((t) => mergePermissions(t))) : [];
      const keys = [...subKeys];
      if (item.value && item.value !== '') {
        keys.unshift(item.value);
      }
      return keys;
    }

    for (const permission of permissions.find((t) => t.value === name)?.permissions ?? []) {
      result[permission.action].push(...mergePermissions(permission));
    }

    return result;
  }

  // get permission keys by name and action
  getPermissionKeysByAction(name: string, action: ActionTypes = 'read') {
    const obj = this.getPermissionKeys(name);
    return obj ? obj[action] : [];
  }

  //get permission keys by name and ungrouped, all in a single array
  getPermissionKeysFlatten(name: string): string[] {
    const obj = this.getPermissionKeys(name);
    if (!obj) return [];
    return flatten(Object.values(obj));
  }

  private getPermissions() {
    return of([
      {
        value: 'Dashboard',
        label: 'داشبورد',
        permissions: [
          { action: 'read', value: 'BillDashboard', label: 'داشبورد قبوض اصلی' },
          { action: 'read', value: 'OtherItemBillDashboard', label: 'داشبورد قبوض متفرقه' },
          { action: 'read', value: 'TrafiicDashboard', label: 'داشبورد ترددها' },
        ],
      },
      { value: 'User', label: 'کاربران', permissions: ['read', 'create', 'update', 'print'] },
      { value: 'WeighingStation', label: 'ایستگاه توزین', permissions: ['read', 'create', 'update'] },
      { value: 'Vehicle', label: 'وسیله نقلیه', permissions: ['read', 'create', 'update', 'print'] },
      { value: 'Branch', label: 'شعبه', permissions: ['read', 'create', 'update'] },
      { value: 'Entezamat', label: 'اطلاعات پایه انتظامات', permissions: ['read', 'create', 'update'] },
      {
        value: 'Dispatching',
        label: 'اطلاعات پایه دیسپچینگ',
        permissions: [{ action: 'read', value: 'GetListOfDispatching' }, 'create', 'update'],
      },
      { value: 'Role', label: 'نقش', permissions: ['read', 'create', 'update'] },
      { value: 'Driver', label: 'رانندگان', permissions: ['read', 'create', 'update', 'print'] },
      { value: 'TruckingCompany', label: 'شرکت باربری', permissions: ['read', 'create', 'update'] },
      { value: 'ShipmentOrder', label: 'دستور حمل', permissions: ['read', 'create', 'update'] },
      { value: 'Item', label: 'قلم کالا', permissions: ['read', 'create', 'update'] },
      {
        value: 'Bill',
        label: 'قبوض اصلی',
        permissions: [
          {
            action: 'read',
            value: 'GetAllBill',
            label: 'نمایش همه قبوض',
            permissions: [
              { action: 'read', value: 'GetIssuedBill', label: 'نمایش قبوض صادر شده' },
              { action: 'read', value: 'GetInitialWeighingBill', label: 'نمایش قبوض توزین اولیه' },
              { action: 'read', value: 'GetDeliveredBill', label: 'نمایش قبوض تحویل داده شده' },
              { action: 'read', value: 'GetVoidedBill', label: 'نمایش قبوض باطل شده' },
              { action: 'read', value: 'GetFinalizedBill', label: 'نمایش قبوض نهایی شده' },
            ],
          },
          {
            action: 'update',
            value: 'ConfirmationAllBill',
            label: 'تایید همه قبوض',
            permissions: [
              { action: 'update', value: 'ConfirmationIssuedBillFromBillList', label: 'تایید قبوض صادر شده' },
              { action: 'update', value: 'ConfirmationDeliveredBill', label: 'تایید قبوض تحویل داده شده' },
            ],
          },
          {
            action: 'update',
            value: null,
            label: 'ابطال همه قبوض',
            permissions: [
              { action: 'update', value: 'CancellationOfIssuedBill', label: 'ابطال قبوض صادر شده' },
              { action: 'update', value: 'CancellationOfInitialWeighingBill', label: 'ابطال قبوض توزین اولیه' },
              { action: 'update', value: 'CancellationOfDeliveredBill', label: 'ابطال قبوض تحویل داده شده' },
            ],
          },
          {
            action: 'output',
          },
          {
            action: 'other',
            value: 'PrintABillFromAdminPanel',
            label: 'پرینت یک قبض',
          },
        ],
      },
      {
        value: 'OtherBill',
        label: 'قبوض متفرقه',
        permissions: [
          { action: 'read', value: 'GetListOfOtherItemBill' },
          { action: 'output' },
          { action: 'other', value: 'PrintAOtherBillFromAdminPanel', label: 'پرینت یک قبض' },
        ],
      },
      {
        value: 'DispatchingBill',
        label: 'گزارش تردد',
        permissions: [
          {
            action: 'read',
            value: null,
            label: 'نمایش همه ترددها',
            permissions: [
              { action: 'read', value: 'GetArrivalTraffics', label: 'نمایش ترددهای ورود' },
              { action: 'read', value: 'GetExitTraffics', label: 'نمایش ترددهای خروج' },
            ],
          },
          {
            action: 'update',
            value: 'VerifyArrivalTraffic',
            label: 'تایید خروج تردد',
          },
          {
            action: 'update',
            value: null,
            label: 'ابطال همه ترددها',
            permissions: [
              { action: 'update', value: 'CancellationArrivalTraffics', label: 'ابطال ترددهای ورود' },
              { action: 'update', value: 'CancellationExitTraffics', label: 'ابطال ترددهای خروج' },
            ],
          },
          { action: 'output', value: 'PrintListOfTraffics' },
        ],
      },
      {
        value: 'NavyPlugin',
        label: 'ناوگان',
        permissions: [{ action: 'read', value: 'ViewTransportFleet' }],
      },
      {
        value: 'EntezamatPlugin',
        label: 'انتظامات',
        permissions: [
          { action: 'read', value: 'GetListOfBillFromEntezamatPanel' },
          { action: 'update', value: 'ConfirmationaIssuedBillFromEntezamatPanel', label: 'توزین و تایید یک قبض' },
        ],
      },
      {
        value: 'DispatchingPlugin',
        label: 'دیسپچینگ',
        permissions: [
          { action: 'read', value: 'ViewDispatching' },
          { action: 'create', value: 'AddNewVehicle', label: 'افزودن وسیله نقلیه جدید' },
          { action: 'create', value: 'SmartCheckinAndCheckout', label: 'ثبت ورود و خروج هوشمند' },
          { action: 'create', value: 'ManualCheckinAndCheckout', label: 'ثبت ورود و خروج دستی' },
          { action: 'update', value: 'CancellationArrival', label: 'ابطال ورود' },
        ],
      },
      {
        value: 'ReportPlugin',
        label: 'گزارشات',
        permissions: [
          { action: 'read', label: 'گزارش ساز', value: 'ReportCreator' },
          { action: 'read', label: 'گزارش گیر', value: 'ReportReceiver' },
        ],
      },
      {
        value: 'Setting',
        label: 'تنظیمات',
        permissions: [{ action: 'read' }, { action: 'update', value: 'EditServerIPFromSettingPanel' }],
      },
      {
        value: 'BranchSetting',
        label: 'تنظیمات شعب',
        permissions: [
          { action: 'read', value: 'GetBranch' },
          { action: 'update', value: 'EditTozinSettingFromSettingPanel' },
        ],
      },
      {
        value: 'Application',
        label: 'برنامه توزین',
        permissions: [
          { action: 'other', value: 'TozinHoshmand', label: 'توزین هوشمند' },
          { action: 'other', value: 'TozinDasty', label: 'توزین دستی' },
          { action: 'other', value: 'TozinMotafaregheh', label: 'توزین متفرقه' },
          { action: 'other', value: 'VerifyArrivalAndExistTraffic', label: 'ترافیک' },
        ],
      },
    ] as PermissionRaw[]).pipe(take(1));
  }

  private mapPermissionItemToFlatten(entry: Permission, perm: PermissionItem): PermissionFlatten {
    return {
      name: entry.value,
      label: entry.label,
      actionLabel: perm.label,
      action: perm.action,
      permission: perm.value,
    };
  }
}
