import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RouteHelperService } from '../services';
import { of } from 'rxjs';
import { CacGlobalConfig } from '../../configs';

// TODO: Fix Permissions

export const PermissionGuard: CanActivateFn = (route) => {
  // const roleService = inject(RoleService);
  const routeHelper = inject(RouteHelperService);
  const auth = inject(CacGlobalConfig.config.states.auth);
  const router = inject(Router);

  routeHelper.getRoutePermissions(route);

  // const result = roleService.hasActionPermission();
  const result = true;

  if (result) return of(true);
  const firstRoute = routeHelper.getFirstAllowedRoute();
  if (firstRoute) return router.navigate([firstRoute]);

  snackbar$.error('این کاربر به پنل دسترسی ندارد.');
  return auth.logout();
};
