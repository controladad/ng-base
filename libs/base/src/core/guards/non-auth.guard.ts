import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacGlobalConfig } from '../../configs';

export const NonAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(CacGlobalConfig.config.states.auth);
  return !auth.isAuthenticated() ? true : router.createUrlTree(['/']);
};
