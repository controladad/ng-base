import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacBase } from '../../configs';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(CacBase.config.states.auth);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
