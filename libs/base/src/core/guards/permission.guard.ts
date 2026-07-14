import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService, RouteHelperService } from '../services';
import { of } from 'rxjs';
import { AuthBaseStore } from '../states';
import { SnackbarService } from '../../shared';
import { RouteExtended } from '../interfaces';


export const PermissionGuard: CanActivateFn = (route) => {
  // const roleService = inject(RoleService);

  const permission = inject(PermissionService);
  const routeHelper = inject(RouteHelperService);
  const auth = inject(AuthBaseStore);
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  // routeHelper.getRoutePermissions(route);

  // const result = roleService.hasActionPermission();

  const requiredPermissions = (route.routeConfig as RouteExtended)?.permissions;
  if (!requiredPermissions) return of(true);

  const requiredPermissionsArray = typeof requiredPermissions === 'string' ? [requiredPermissions] :
    typeof requiredPermissions.key === 'string' ? [requiredPermissions.key] :
      requiredPermissions.key;

  const result = permission.hasPermissions(requiredPermissionsArray);

  if (result) return of(true);
  const firstRoute = routeHelper.getFirstAllowedRoute();
  if (firstRoute) return router.navigate([firstRoute]);

  snackbar.error($localize`:@@base.errors.permissionGuard.userAccessDenied:User access denied.`);
  return auth.logout();
};
