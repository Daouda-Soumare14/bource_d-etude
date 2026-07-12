import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dgbe-600 via-dgbe-700 to-dgbe-900 text-white shadow-card">
        <img src="assets/img/campus.jpg" alt="" aria-hidden="true"
             class="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div class="absolute inset-0 bg-gradient-to-r from-dgbe-800/95 via-dgbe-700/85 to-dgbe-900/60"></div>
        <div class="absolute inset-0 bg-grid-dgbe opacity-15 [background-size:32px_32px]"></div>
        <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
        <div class="absolute -bottom-12 right-32 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl"></div>
        <div class="relative p-8">
          <span class="chip bg-white/10 text-dgbe-100 ring-white/15">{{ roleLabel() }}</span>
          <h1 class="mt-4 font-display text-3xl font-extrabold">Bonjour {{ user()?.prenom }} 👋</h1>
          <p class="mt-2 max-w-2xl text-dgbe-100">
            Bienvenue sur votre espace de gestion et de suivi des bourses étudiantes.
            Accédez rapidement à vos actions ci-dessous.
          </p>
        </div>
      </div>

      <!-- Accès rapides -->
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Accès rapides</h2>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (link of liens(); track link.path) {
            <a [routerLink]="link.path" class="card card-hover group flex items-center gap-4 p-5">
              <span class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition group-hover:scale-105"
                    [style.background]="link.bg" [style.color]="link.fg">{{ link.icon }}</span>
              <div class="min-w-0">
                <div class="font-bold text-slate-900">{{ link.label }}</div>
                <div class="truncate text-sm text-slate-500">{{ link.desc }}</div>
              </div>
              <span class="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-dgbe-500">→</span>
            </a>
          }
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  private auth = inject(AuthService);
  user = this.auth.currentUser;

  roleLabel = computed(() => {
    const labels: Record<string, string> = {
      administrateur: 'Administrateur', agent: 'Agent de traitement',
      commission: 'Commission', 'service-financier': 'Service financier', etudiant: 'Espace étudiant',
    };
    return this.auth.roles().map((r) => labels[r] ?? r).join(' · ');
  });

  private all = [
    { label: 'Tableau de bord', desc: 'Statistiques et graphiques', icon: '📊', path: '/app/dashboard', bg: '#eff6ff', fg: '#1d4ed8', roles: ['administrateur', 'agent', 'commission', 'service-financier'] },
    { label: 'Déposer une demande', desc: 'Nouvelle demande de bourse', icon: '➕', path: '/app/demandes/nouvelle', bg: '#eff6ff', fg: '#2563eb', roles: ['etudiant'] },
    { label: 'Mes demandes', desc: 'Suivre mes demandes', icon: '📄', path: '/app/demandes', bg: '#f5f3ff', fg: '#6d28d9', roles: ['etudiant'] },
    { label: 'Demandes', desc: 'Traiter les dossiers', icon: '📄', path: '/app/demandes', bg: '#f5f3ff', fg: '#6d28d9', roles: ['administrateur', 'agent', 'commission'] },
    { label: 'Paiements', desc: 'Versements et états', icon: '💳', path: '/app/paiements', bg: '#fdf8ec', fg: '#bd8420', roles: ['administrateur', 'service-financier'] },
    { label: 'Commissions', desc: "Décisions d'attribution", icon: '⚖️', path: '/app/commissions', bg: '#ecfeff', fg: '#0e7490', roles: ['administrateur', 'commission'] },
    { label: 'Réclamations', desc: 'Gérer les réclamations', icon: '📨', path: '/app/reclamations', bg: '#fef2f2', fg: '#be123c', roles: ['administrateur', 'agent', 'commission', 'service-financier', 'etudiant'] },
    { label: 'Utilisateurs', desc: 'Gérer les comptes', icon: '👥', path: '/app/utilisateurs', bg: '#ecfeff', fg: '#0e7490', roles: ['administrateur'] },
    { label: 'Mon profil', desc: 'Mes informations', icon: '👤', path: '/app/profil', bg: '#f8fafc', fg: '#334155', roles: ['administrateur', 'agent', 'commission', 'service-financier', 'etudiant'] },
  ];

  liens = computed(() => {
    const roles = this.auth.roles();
    return this.all.filter((l) => l.roles.some((r) => roles.includes(r as never)));
  });
}
