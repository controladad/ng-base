import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { BaseDialogComponent } from '../_base-dialog.component';
import {
  ActionTypes,
  DynamicRoleCreate,
  DynamicRoleEntity,
  flatten,
  formControl,
  FormControlExtended,
  formGroup,
  PermissionItem,
  RoleApiService,
  RoleService,
} from '../../../../../../core';
import { DialogLayoutComponent } from '../../../../layouts';
import { formBuilder, FormBuilderComponent } from '../../../form-builder';
import { FormGroup, Validators } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonClickEvent, CheckboxComponent, FieldComponent } from '../../../../ui';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface RoleDialogData {
  item?: DynamicRoleEntity;
  viewOnly?: boolean;
}

export type RoleDialogResult = boolean;

type PermissionFormControl = FormControlExtended<boolean, { action: ActionTypes; value?: string }>;

interface PermissionItemUI extends Omit<PermissionItem, 'value' | 'permissions'> {
  control: PermissionFormControl;
  value?: string;
  subGroup?: FormGroup;
  permissions: PermissionItemUI[];
  subLevel?: boolean;
}
interface PermissionUI {
  name: string;
  label: string;
  selectAllControl: FormControlExtended<boolean>;
  subGroup?: FormGroup;
  permissions: PermissionItemUI[];
}

const TEMP_KEY_PREFIX = '___';

@Component({
  selector: 'feature-role-dialog',
  standalone: true,
  imports: [DialogLayoutComponent, FormBuilderComponent, NgIf, FieldComponent, NgForOf, CheckboxComponent],
  templateUrl: './role-dialog.component.html',
  styleUrls: ['./role-dialog.component.scss'],
})
export class RoleDialogComponent extends BaseDialogComponent<RoleDialogData, RoleDialogResult> {
  readonly destroyRef = inject(DestroyRef);

  baseForm = formBuilder({
    cols: 1,
    inputs: {
      name: {
        control: formControl('', Validators.required),
        label: 'نام نقش',
      },
      // status: {
      //   control: formControl<StatusType>('Active', Validators.required),
      //   label: 'وضعیت',
      //   items: StatusValues,
      //   type: 'select',
      //   searchable: false,
      // },
      // description: {
      //   control: formControl(''),
      //   label: 'توضیحات',
      //   type: 'textarea',
      //   rows: 7,
      // },
    },
  });

  private _permissionList = signal<PermissionUI[] | undefined>(undefined);
  private _filterTerm = signal('');
  private _currentItemPermissions = signal<string[]>([]);

  searchControl = formControl('');

  flattenPermissionList = computed(() => {
    const list = this._permissionList();
    return list?.map((item) => ({
      ...item,
      permissions: flatten(
        item.permissions.map((t) => [
          t,
          ...t.permissions.map((t) => ({
            ...t,
            subLevel: true,
          })),
        ]),
      ),
    }));
  });

  visiblePermissionList = computed(() => {
    const term = this._filterTerm()?.toLowerCase();
    const list = this.flattenPermissionList()
      ?.filter((item) => (this.data.viewOnly ? item.permissions.some((t) => !!t.control.value) : true))
      .map((item) => ({
        ...item,
        permissions: item.permissions.filter((t) => t.label !== ''),
      }));
    if (!term || !term.length) return list;
    return list?.filter((t) => t.label.toLowerCase().includes(term) || t.name.toLowerCase().includes(term));
  });

  constructor(
    private role: RoleService,
    private roleApi: RoleApiService,
  ) {
    super();

    this.searchControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(80)).subscribe((value) => {
      this._filterTerm.set(value);
    });
    this.baseForm.patchValue({
      name: this.data.item?.name,
    });
    this._currentItemPermissions.set(this.data.item?.permissions?.map((t) => t.toLowerCase()) ?? []);
    this.initPermissionList();
  }

  onSubmit(e: ButtonClickEvent) {
    const baseModel = this.baseForm.getValue()!;
    const permissionKeys = flatten(this.flattenPermissionList()?.map((t) => t.permissions) ?? [])
      .filter((t) => t.control.value && !!t.value && !t.value.startsWith(TEMP_KEY_PREFIX))
      .map((t) => t.value!);
    if (!permissionKeys.length) {
      snackbar$.error('حداقل یک دسترسی باید انتخاب شود.');
      return;
    }
    const model: DynamicRoleCreate = {
      ...baseModel,
      permissions: permissionKeys,
    };

    return (this.data.item ? this.roleApi.update(this.data.item.id, model) : this.roleApi.create(model))
      .pipe(e.pipe())
      .subscribe(() => {
        this.close(true);
      });
  }

  private initPermissionList() {
    const permissions = this.role.permissions()?.filter((t) => !!t.label && t.label !== '');
    if (!permissions) {
      console.error('Permissions are not loaded yet!!', 'This should never happen!!');
      return;
    }

    this._permissionList.set(
      permissions.map((item) => {
        const selectAllControl = formControl(false);
        if (this.data.viewOnly) {
          selectAllControl.setReadonly(true);
        }
        const mappedPerms = this.permissionsArrayToItemUIs(item.permissions);
        return {
          label: item.label,
          name: item.value,
          selectAllControl: selectAllControl,
          subGroup: mappedPerms.group,
          permissions: mappedPerms.items,
        };
      }),
    );

    this.initControls();
  }

  private initControls() {
    const perms = this._permissionList();
    for (const perm of perms ?? []) {
      for (const item of perm.permissions) {
        if (item.permissions.length && item.subGroup) {
          this.registerToAutoController(item.subGroup);
          item.control.setValue(item.permissions.every((t) => t.control.value));
          this.registerSelectAllControl(item.control, item.subGroup);
        }
      }
      if (perm.subGroup) {
        this.registerToAutoController(perm.subGroup);
        perm.selectAllControl.setValue(perm.permissions.every((t) => t.control.value));
        this.registerSelectAllControl(perm.selectAllControl, perm.subGroup);
      }
    }
  }

  private registerToAutoController(group: FormGroup) {
    const controlsList = Object.values(group.controls) as PermissionFormControl[];
    for (const control of controlsList) {
      if (!control.data?.action) continue;

      control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
        if (control.data?.action === 'read' && !value) {
          controlsList.forEach((c) => c.data?.action !== 'read' && c.setValue(false));
        } else if ((control.data?.action === 'create' || control.data?.action === 'update') && value) {
          controlsList.find((c) => c.data?.action === 'read')?.setValue(true);
        } else if (
          (control.data?.action === 'print' ||
            control.data?.action === 'export' ||
            control.data?.action === 'output') &&
          value
        ) {
          controlsList.find((c) => c.data?.action === 'read')?.setValue(true);
        }
      });
    }
  }

  private registerSelectAllControl(control: FormControlExtended, group: FormGroup) {
    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      Object.values(group.controls).forEach((t) => t.setValue(value, { emitEvent: true }));
    });
    group.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((values) => {
      if (Object.values(values).every((t) => t === true)) {
        control.setValue(true, { emitEvent: false });
      } else {
        control.setValue(false, { emitEvent: false });
      }
    });
  }

  private permissionsArrayToItemUIs(perms: PermissionItem[]) {
    const items = perms.map((t) => this.mapPermissionToItemUI(t));
    const group = formGroup<any>({});
    items.forEach((t) => t.value && group.addControl(t.value, t.control));
    return {
      items,
      group,
    };
  }

  private mapPermissionToItemUI(perm: PermissionItem): PermissionItemUI {
    const value = perm.value ?? this.generateTempKey();
    const control = formControl(
      perm.value ? this._currentItemPermissions()?.includes(perm.value.toLowerCase()) : false,
    ) as PermissionFormControl;
    control.setData({
      action: perm.action,
      value: value,
    });
    if (this.data.viewOnly) {
      control.setReadonly(true);
    }

    let group;
    const subPerms: PermissionItemUI[] = [];

    if (perm.permissions) {
      group = formGroup<any>({});
    }
    for (const subPerm of perm.permissions ?? []) {
      const item = this.mapPermissionToItemUI(subPerm);
      subPerms.push(item);
      group!.addControl(subPerm.value!, item.control);
    }

    return {
      ...perm,
      value,
      control,
      subGroup: group,
      permissions: subPerms,
    };
  }

  private generateTempKey() {
    return `${TEMP_KEY_PREFIX}${new Date().getTime()}_${Math.round(Math.random() * 10000)}`;
  }
}
