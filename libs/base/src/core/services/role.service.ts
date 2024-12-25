import { computed, inject, Injectable } from '@angular/core';
import { AuthStore } from '../states';
import { ActionTypes, dedupe, flatten, getAllActions, subset } from '../helpers';
import { RouteHelperService } from './route-helper.service';
import { ItemRecord } from '../interfaces';
import { PermissionFlatten, RoleApiService } from './api';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleApi = inject(RoleApiService);

  public permissions = this.roleApi.permissions;

  public currentUserPermissions = computed<PermissionFlatten[] | undefined>(() => {
    const permissionsKeys = this.auth.permissionKeysSignal()?.map((t) => t.toLowerCase());
    const permissions = this.roleApi.permissionsFlatten();
    if (this.auth.isSuper() && permissions) return permissions;
    if (!permissionsKeys || !permissions) return undefined;
    return permissions!.filter((t) => t.permission && permissionsKeys.includes(t.permission.toLowerCase()));
  });
  public currentUserAllowedActions = computed<ActionTypes[] | undefined>(() => {
    const tree = this.routeHelper.currentRoutePermissionTree();
    const permissionsFlatten = this.roleApi.permissionsFlatten();

    if (tree && tree.length === 0) return getAllActions() as never as ActionTypes[];
    const treeRequiredKeys = tree?.map((t) => t.keys) ?? [];
    const treeRequiredKeysFlatten = flatten(treeRequiredKeys);
    let treeKeys: string[] = [];
    const treeLastName = tree?.at(-1)?.name;
    if (treeLastName) {
      treeKeys.push(...this.roleApi.getPermissionKeysFlatten(treeLastName));
    }
    treeKeys = dedupe([...treeKeys, ...treeRequiredKeysFlatten]);

    const currentUserPermissions = this.currentUserPermissions()?.filter(
      (t) => t.permission && treeKeys.includes(t.permission),
    );

    const requiredActions: ActionTypes[] = [];
    const treeActions: ActionTypes[] = [];
    for (const perm of permissionsFlatten ?? []) {
      if (perm.permission && treeKeys.includes(perm.permission) && !treeActions.includes(perm.action)) {
        treeActions.push(perm.action);
      }
      if (
        perm.permission &&
        treeRequiredKeysFlatten.includes(perm.permission) &&
        !requiredActions.includes(perm.action)
      ) {
        requiredActions.push(perm.action);
      }
    }

    let allowedAction: ActionTypes[];
    if (treeRequiredKeys.every((t) => currentUserPermissions?.some((y) => y.permission && t.includes(y.permission)))) {
      const actionsWithNoDefinedPermission = getAllActions().filter((t) => !treeActions.includes(t));
      if (treeActions.includes('output')) {
        actionsWithNoDefinedPermission.splice(actionsWithNoDefinedPermission.indexOf('print'));
        actionsWithNoDefinedPermission.splice(actionsWithNoDefinedPermission.indexOf('export'));
      }
      allowedAction = [
        ...dedupe(currentUserPermissions?.map((t) => t.action) ?? []),
        ...actionsWithNoDefinedPermission,
      ];
      if (allowedAction.includes('output')) {
        allowedAction.push('export', 'print');
      }
      allowedAction = dedupe(allowedAction);
    } else {
      allowedAction = [];
    }

    console.log('Current user permissions', currentUserPermissions);
    console.log(
      'Route required keys:',
      treeRequiredKeys,
      '\n',
      'Required actions to have:',
      requiredActions,
      '\n',
      'Route all keys:',
      treeKeys,
      '\n',
      'Route permissioned actions:',
      treeActions,
      '\n',
      'User allowed actions:',
      allowedAction,
      '\n',
      'User all permissions:',
      this.currentUserPermissions(),
    );

    return requiredActions.length > 0 ? (subset(allowedAction, requiredActions) ? allowedAction : []) : allowedAction;
  });

  constructor(
    private auth: AuthStore,
    private routeHelper: RouteHelperService,
  ) {}

  hasPermission(permission: string) {
    if (this.auth.isSuper()) return true;
    const currentPermissions = this.currentUserPermissions() ?? [];
    return currentPermissions.some((t) => t.permission === permission);
  }

  // check permissions with 'OR' logic
  hasPermissionSome(...permissions: string[]) {
    if (this.auth.isSuper()) return true;
    const currentPermissions = this.currentUserPermissions() ?? [];
    return currentPermissions.some((t) => t.permission && permissions.includes(t.permission));
  }

  hasActionPermission(action: ActionTypes | ActionTypes[] = 'read') {
    const actionsToCheck = action instanceof Array ? action : [action ?? 'read'];
    const allowedActions = this.currentUserAllowedActions();
    if (!allowedActions) return false;
    return actionsToCheck.every((t) => allowedActions.includes(t));
  }

  filterItemRecords<T>(items: ItemRecord<T>[]) {
    return items.filter((t) => (t.permission ? this.hasPermission(t.permission) : true));
  }
}
