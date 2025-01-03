import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);

  const token =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const expiry =
    localStorage.getItem('authTokenExpiry') ||
    sessionStorage.getItem('authTokenExpiry');

  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authTokenExpiry');
    router.navigate(['/']);
    return false;
  }

  const isProtectedRoute = state.url.startsWith('/main');
  const isLoginRoute = state.url === '/';

  if (isProtectedRoute && !token) {
    router.navigate(['/']);
    return false;
  }

  if (isLoginRoute && token) {
    router.navigate(['/main']);
    return false;
  }

  return true;
};