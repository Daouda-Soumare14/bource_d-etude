import { Injectable, signal } from '@angular/core';

export type AuthMode = 'login' | 'register' | null;

/** Pilote l'ouverture du modal d'authentification (connexion / inscription). */
@Injectable({ providedIn: 'root' })
export class AuthModalService {
  readonly mode = signal<AuthMode>(null);
  /** Email pré-rempli (ex: après inscription). */
  readonly prefillEmail = signal<string>('');

  open(mode: Exclude<AuthMode, null> = 'login'): void {
    this.mode.set(mode);
  }

  close(): void {
    this.mode.set(null);
  }
}
