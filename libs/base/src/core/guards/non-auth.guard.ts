import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../states';

export const NonAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthStore);
  return !auth.isAuthenticated() ? true : router.createUrlTree(['/']);
};
