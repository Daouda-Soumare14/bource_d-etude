import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthModalService } from '../services/auth-modal.service';

/**
 * Ajoute le token Bearer aux requêtes et gère la déconnexion sur 401 :
 * retour à l'accueil + ouverture du modal de connexion.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const modal = inject(AuthModalService);
  const token = auth.token;

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    : req.clone({ setHeaders: { Accept: 'application/json' } });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Ne déclenche pas la redirection pour un simple échec de login.
      if (error.status === 401 && auth.isAuthenticated()) {
        auth.clear();
        router.navigate(['/']);
        modal.open('login');
      }
      return throwError(() => error);
    }),
  );
};
