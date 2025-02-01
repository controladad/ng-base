import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService, RouteHelperService } from '../services';
import { of } from 'rxjs';
import { CacBase } from '../../configs';

export const PermissionGuard: CanActivateFn = (route) => {
  const roleService = inject(RoleService);
  const routeHelper = inject(RouteHelperService);
  const auth = inject(CacBase.config.states.auth);
  const router = inject(Router);

  routeHelper.getRoutePermissions(route);

  const result = roleService.hasActionPermission();

  if (result) return of(true);
  const firstRoute = routeHelper.getFirstAllowedRoute();
  if (firstRoute) return router.navigate([firstRoute]);

  snackbar$.error($localize`:@@base.errors.permissionGuard.userAccessDenied:این کاربر به پنل دسترسی ندارد.`);
  return auth.logout();
};
