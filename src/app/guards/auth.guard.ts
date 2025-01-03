import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem("authToken");

  const isProtectedRoute = state.url.startsWith('/main');
  const isLoginRoute = state.url === '/';

  if (isProtectedRoute && (!token || token === 'undefined')) {
    // Benutzer hat kein gültiges Token, leite zum Login-Bereich um
    router.navigate(['/']);
    return false;
  }

  if (isLoginRoute && token && token !== 'undefined') {
    // Benutzer ist bereits eingeloggt, leite zum Hauptbereich um
    router.navigate(['/main']);
    return false;
  }

  return true; // Zugriff erlaubt
};
