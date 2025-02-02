import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthBaseStore } from '../states';

export const NonAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthBaseStore);
  return !auth.isAuthenticated() ? true : router.createUrlTree(['/']);
};
