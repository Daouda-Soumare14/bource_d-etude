import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Role } from '../core/models';
import { LogoComponent } from '../shared/logo/logo.component';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, LogoComponent],
  template: `
    <div class="min-h-screen bg-slate-50">
      <!-- ===== Sidebar (fixe) ===== -->
      <aside
        class="fixed inset-y-0 left-0 z-30 flex w-64 transform flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0"
        [ngClass]="sidebarOpen() ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex h-16 items-center border-b border-slate-100 px-5">
          <app-logo [size]="36" />
        </div>
        <nav class="flex-1 space-y-1 overflow-y-auto p-3">
          @for (item of menu(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="!bg-dgbe-50 !text-dgbe-700 font-semibold ring-1 ring-inset ring-dgbe-100"
              class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              (click)="sidebarOpen.set(false)"
            >
              <span class="text-base">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="border-t border-slate-100 p-3">
          <div class="rounded-xl bg-gradient-to-br from-dgbe-600 to-dgbe-800 p-4 text-white">
            <div class="text-xs font-semibold">Plateforme DGBE</div>
            <div class="mt-1 text-[11px] text-dgbe-100">Gestion & suivi des bourses étudiantes</div>
          </div>
        </div>
      </aside>

      @if (sidebarOpen()) {
        <div class="fixed inset-0 z-20 bg-ink-900/40 backdrop-blur-sm lg:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- ===== Contenu ===== -->
      <div class="flex min-h-screen min-w-0 flex-col lg:pl-64">
        <header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-lg lg:px-6">
          <div class="flex items-center gap-3">
            <button class="rounded-lg p-2 hover:bg-slate-100 lg:hidden" (click)="sidebarOpen.set(true)">☰</button>
            <span class="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 lg:block">{{ roleLabel() }}</span>
          </div>

          <div class="flex items-center gap-2">
            <a routerLink="/app/notifications" class="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" title="Notifications">
              🔔
              @if (notif.nonLues() > 0) {
                <span class="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {{ notif.nonLues() }}
                </span>
              }
            </a>

            <div class="relative">
              <button class="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100" (click)="menuOpen.set(!menuOpen())">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-dgbe-500 to-dgbe-700 text-sm font-bold text-white shadow-soft">
                  {{ initiales() }}
                </span>
                <span class="hidden text-sm font-semibold text-slate-700 sm:block">{{ user()?.nom_complet }}</span>
                <span class="hidden text-slate-400 sm:block">▾</span>
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevate">
                  <div class="border-b border-slate-100 px-4 py-2.5">
                    <div class="text-sm font-semibold text-slate-800">{{ user()?.nom_complet }}</div>
                    <div class="truncate text-xs text-slate-400">{{ user()?.email }}</div>
                  </div>
                  <a routerLink="/app/profil" class="block px-4 py-2.5 text-sm hover:bg-slate-50" (click)="menuOpen.set(false)">👤 Mon profil</a>
                  <a routerLink="/" class="block px-4 py-2.5 text-sm hover:bg-slate-50" (click)="menuOpen.set(false)">🌐 Accueil du site</a>
                  <button class="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50" (click)="logout()">↩ Déconnexion</button>
                </div>
              }
            </div>
          </div>
        </header>

        <main class="flex-1 p-4 lg:p-6">
          <div class="animate-fade-in">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AppLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  notif = inject(NotificationService);

  sidebarOpen = signal(false);
  menuOpen = signal(false);
  user = this.auth.currentUser;

  private allItems: MenuItem[] = [
    { label: 'Accueil', path: '/app/accueil', icon: '🏠' },
    { label: 'Tableau de bord', path: '/app/dashboard', icon: '📊', roles: ['administrateur', 'agent', 'commission', 'service-financier'] },
    { label: 'Demandes', path: '/app/demandes', icon: '📄' },
    { label: 'Étudiants', path: '/app/etudiants', icon: '🎓', roles: ['administrateur', 'agent'] },
    { label: 'Commissions', path: '/app/commissions', icon: '⚖️', roles: ['administrateur', 'commission'] },
    { label: 'Paiements', path: '/app/paiements', icon: '💳', roles: ['administrateur', 'service-financier'] },
    { label: 'Réclamations', path: '/app/reclamations', icon: '📨' },
    { label: 'Universités', path: '/app/universites', icon: '🏛️', roles: ['administrateur'] },
    { label: 'Années académiques', path: '/app/annees', icon: '📅', roles: ['administrateur'] },
    { label: 'Types de bourses', path: '/app/types-bourses', icon: '🏷️', roles: ['administrateur'] },
    { label: 'Utilisateurs', path: '/app/utilisateurs', icon: '👥', roles: ['administrateur'] },
  ];

  menu = computed<MenuItem[]>(() => {
    const roles = this.auth.roles();
    return this.allItems.filter((i) => !i.roles || i.roles.some((r) => roles.includes(r)));
  });

  roleLabel = computed(() => {
    const labels: Record<string, string> = {
      administrateur: 'Administrateur', agent: 'Agent de traitement',
      commission: 'Commission', 'service-financier': 'Service financier', etudiant: 'Espace étudiant',
    };
    return this.auth.roles().map((r) => labels[r] ?? r).join(' · ');
  });

  initiales = computed(() => {
    const u = this.user();
    return u ? `${u.prenom?.[0] ?? ''}${u.nom?.[0] ?? ''}`.toUpperCase() : '';
  });

  constructor() {
    this.notif.list().subscribe();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
