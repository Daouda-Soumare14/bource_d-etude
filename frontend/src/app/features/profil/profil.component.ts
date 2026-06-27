import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    @if (user(); as u) {
      <div class="mx-auto max-w-4xl space-y-6">
        <!-- En-tête profil -->
        <div class="card overflow-hidden">
          <div class="relative h-32 bg-gradient-to-br from-dgbe-600 via-dgbe-700 to-dgbe-900">
            <div class="absolute inset-0 bg-grid-dgbe opacity-20 [background-size:28px_28px]"></div>
            <div class="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-gold-400/20 blur-2xl"></div>
          </div>
          <div class="px-6 pb-6">
            <div class="-mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div class="flex items-end gap-4">
                <div class="rounded-full ring-4 ring-white">
                  <app-avatar [nom]="u.nom_complet" [size]="88" />
                </div>
                <div class="pb-1">
                  <h1 class="font-display text-2xl font-extrabold text-slate-900">{{ u.nom_complet }}</h1>
                  <p class="text-sm text-slate-500">{{ u.email }}</p>
                </div>
              </div>
              <div class="flex flex-wrap gap-1.5 pb-1">
                @for (r of u.roles ?? []; track r) {
                  <span class="badge bg-dgbe-50 text-dgbe-700 ring-dgbe-100">{{ r }}</span>
                }
                <span class="badge" [class]="u.actif ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-red-50 text-red-700 ring-red-100'">
                  <span class="h-1.5 w-1.5 rounded-full" [class]="u.actif ? 'bg-emerald-500' : 'bg-red-500'"></span>
                  {{ u.actif ? 'Compte actif' : 'Inactif' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Coordonnées -->
          <div class="card p-6">
            <h2 class="mb-4 flex items-center gap-2 font-semibold text-slate-800">📇 Coordonnées</h2>
            <dl class="space-y-4 text-sm">
              <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                <dt class="text-slate-400">Nom complet</dt><dd class="font-medium text-slate-800">{{ u.nom_complet }}</dd>
              </div>
              <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                <dt class="text-slate-400">Email</dt><dd class="font-medium text-slate-800">{{ u.email }}</dd>
              </div>
              <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                <dt class="text-slate-400">Téléphone</dt><dd class="font-medium text-slate-800">{{ u.telephone ?? '—' }}</dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-slate-400">Adresse</dt><dd class="font-medium text-slate-800">{{ u.adresse ?? '—' }}</dd>
              </div>
            </dl>
          </div>

          <!-- Infos académiques (étudiant) -->
          @if (u.etudiant; as e) {
            <div class="card p-6">
              <h2 class="mb-4 flex items-center gap-2 font-semibold text-slate-800">🎓 Informations académiques</h2>
              <dl class="space-y-4 text-sm">
                <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                  <dt class="text-slate-400">Matricule</dt><dd class="font-mono font-medium text-dgbe-700">{{ e.matricule }}</dd>
                </div>
                <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                  <dt class="text-slate-400">Université</dt><dd class="font-medium text-slate-800">{{ e.universite?.nom ?? '—' }}</dd>
                </div>
                <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                  <dt class="text-slate-400">Filière</dt><dd class="font-medium text-slate-800">{{ e.filiere?.nom ?? '—' }}</dd>
                </div>
                <div class="flex items-center justify-between border-b border-slate-50 pb-3">
                  <dt class="text-slate-400">Niveau</dt><dd class="font-medium text-slate-800">{{ e.niveau ?? '—' }}</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-slate-400">Région</dt><dd class="font-medium text-slate-800">{{ e.region ?? '—' }}</dd>
                </div>
              </dl>
            </div>
          } @else {
            <div class="card flex flex-col items-center justify-center p-6 text-center">
              <div class="text-4xl">🛡️</div>
              <h2 class="mt-2 font-semibold text-slate-800">Compte personnel</h2>
              <p class="mt-1 text-sm text-slate-500">Vos accès dépendent des rôles qui vous sont attribués.</p>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ProfilComponent {
  private auth = inject(AuthService);
  user = this.auth.currentUser;

  constructor() {
    this.auth.refreshProfile().subscribe();
  }
}
