import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteHelperService } from '../services';
import { of } from 'rxjs';
import { AuthBaseStore } from '../states';
import { SnackbarService } from '../../shared';

// TODO: Fix Permissions

export const PermissionGuard: CanActivateFn = (route) => {
  // const roleService = inject(RoleService);
  const routeHelper = inject(RouteHelperService);
  const auth = inject(AuthBaseStore);
  const router = inject(Router);
  const snackbar = inject(SnackbarService);

  routeHelper.getRoutePermissions(route);

  // const result = roleService.hasActionPermission();
  const result = true;

  if (result) return of(true);
  const firstRoute = routeHelper.getFirstAllowedRoute();
  if (firstRoute) return router.navigate([firstRoute]);

  snackbar.error($localize`:@@base.errors.permissionGuard.userAccessDenied:User access denied.`);
  return auth.logout();
};
