import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

/** Empêche l'accès aux pages protégées : renvoie à l'accueil et ouvre le modal de connexion. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const modal = inject(AuthModalService);

  if (auth.isAuthenticated()) {
    return true;
  }
  router.navigate(['/']);
  modal.open('login');
  return false;
};

/** Restreint une route à certains rôles (data: { roles: Role[] }). */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = (route.data?.['roles'] ?? []) as string[];

  if (allowed.length === 0 || auth.hasRole(...(allowed as never[]))) {
    return true;
  }
  router.navigate(['/app']);
  return false;
};
