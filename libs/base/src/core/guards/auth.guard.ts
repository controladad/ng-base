import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacGlobalConfig } from '../../configs';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(CacGlobalConfig.config.states.auth);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
