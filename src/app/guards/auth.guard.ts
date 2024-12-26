import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { session } from '../utils/session'

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem("authToken");

  // console.log('token', token);

  const protectedRoutes: string[] = ['/main'];
  return protectedRoutes.includes(state.url) && token === 'undefined'
  ? router.navigate(['/'])
  : true;
};
