import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { ToastService } from '../../core/services/toast.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LogoComponent],
  template: `
    @if (modal.mode(); as mode) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <!-- backdrop -->
        <div class="absolute inset-0 bg-ink-900/60 backdrop-blur-sm animate-fade-in" (click)="close()"></div>

        <!-- dialog -->
        <div class="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-elevate animate-fade-up">
          <!-- en-tête dégradé -->
          <div class="relative overflow-hidden bg-gradient-to-br from-dgbe-600 to-dgbe-800 px-6 py-5 text-white">
            <div class="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>
            <button class="absolute right-4 top-4 rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white" (click)="close()">✕</button>
            <app-logo [light]="true" [size]="36" />
            <h2 class="mt-3 font-display text-xl font-bold">
              {{ mode === 'login' ? 'Connexion à votre espace' : 'Créer un compte étudiant' }}
            </h2>
          </div>

          <!-- onglets -->
          <div class="flex gap-1 border-b border-slate-100 px-6 pt-3">
            <button class="border-b-2 px-3 py-2 text-sm font-semibold transition"
              [class]="mode === 'login' ? 'border-dgbe-600 text-dgbe-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              (click)="modal.open('login')">Connexion</button>
            <button class="border-b-2 px-3 py-2 text-sm font-semibold transition"
              [class]="mode === 'register' ? 'border-dgbe-600 text-dgbe-700' : 'border-transparent text-slate-400 hover:text-slate-600'"
              (click)="modal.open('register')">Inscription</button>
          </div>

          <div class="max-h-[70vh] overflow-y-auto p-6">
            <!-- ===== CONNEXION ===== -->
            @if (mode === 'login') {
              <form [formGroup]="loginForm" (ngSubmit)="login()" class="space-y-4">
                <div>
                  <label class="label">Adresse email</label>
                  <input type="email" formControlName="email" class="input" placeholder="exemple&#64;dgbe.sn" />
                </div>
                <div>
                  <label class="label">Mot de passe</label>
                  <input type="password" formControlName="password" class="input" placeholder="••••••••" />
                </div>
                <button type="submit" class="btn-primary w-full py-3 text-base" [disabled]="loading()">
                  {{ loading() ? 'Connexion…' : 'Se connecter' }}
                </button>
              </form>

              <div class="mt-5 rounded-xl bg-slate-50 p-3">
                <p class="text-[11px] font-semibold text-slate-500">Démo (mot de passe : password)</p>
                <div class="mt-1.5 flex flex-wrap gap-1">
                  @for (c of comptes; track c) {
                    <button type="button" class="chip text-[11px] hover:bg-dgbe-100" (click)="remplir(c)">{{ c }}</button>
                  }
                </div>
              </div>
            }

            <!-- ===== INSCRIPTION ===== -->
            @if (mode === 'register') {
              <form [formGroup]="registerForm" (ngSubmit)="register()" class="grid grid-cols-2 gap-3">
                <div><label class="label">Prénom *</label><input formControlName="prenom" class="input" /></div>
                <div><label class="label">Nom *</label><input formControlName="nom" class="input" /></div>
                <div class="col-span-2"><label class="label">Email *</label><input type="email" formControlName="email" class="input" /></div>
                <div><label class="label">Téléphone</label><input formControlName="telephone" class="input" /></div>
                <div><label class="label">Région</label><input formControlName="region" class="input" /></div>
                <div><label class="label">Mot de passe *</label><input type="password" formControlName="password" class="input" /></div>
                <div><label class="label">Confirmation *</label><input type="password" formControlName="password_confirmation" class="input" /></div>
                @if (registerForm.errors?.['mismatch'] && registerForm.get('password_confirmation')?.touched) {
                  <p class="col-span-2 -mt-1 text-xs text-red-600">Les mots de passe diffèrent.</p>
                }
                <button type="submit" class="btn-primary col-span-2 mt-1 w-full py-3" [disabled]="loading()">
                  {{ loading() ? 'Création…' : 'Créer mon compte' }}
                </button>
              </form>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AuthModalComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  modal = inject(AuthModalService);

  loading = signal(false);
  comptes = ['admin@dgbe.sn', 'agent@dgbe.sn', 'commission@dgbe.sn', 'finance@dgbe.sn', 'etudiant1@dgbe.sn'];

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerForm = this.fb.nonNullable.group(
    {
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      region: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
    },
    { validators: (g) => (g.value.password === g.value.password_confirmation ? null : { mismatch: true }) },
  );

  constructor() {
    // Pré-remplit l'email (ex: après inscription) à l'ouverture.
    effect(() => {
      const email = this.modal.prefillEmail();
      if (email) this.loginForm.patchValue({ email });
    });
  }

  remplir(email: string): void {
    this.loginForm.patchValue({ email, password: 'password' });
  }

  close(): void {
    this.modal.close();
    this.loading.set(false);
  }

  login(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.loading.set(true);
    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        this.auth.refreshProfile().subscribe();
        this.toast.success('Bienvenue sur la plateforme DGBE.');
        this.close();
        this.router.navigate(['/app']);
      },
      error: (err) => { this.loading.set(false); this.toast.error(err?.error?.message ?? 'Identifiants incorrects.'); },
    });
  }

  register(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading.set(true);
    const value = this.registerForm.getRawValue();
    this.auth.register(value).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Compte créé. Connectez-vous.');
        this.modal.prefillEmail.set(value.email);
        this.registerForm.reset();
        this.modal.open('login');
      },
      error: (err) => { this.loading.set(false); this.toast.error(err?.error?.message ?? 'Erreur lors de la création.'); },
    });
  }
}
