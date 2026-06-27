import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- Page d'accueil publique (vitrine) ---
  { path: '', pathMatch: 'full', loadComponent: () => import('./features/landing/landing.component').then((m) => m.LandingComponent) },

  // --- Authentification gérée par un modal global : on renvoie vers l'accueil ---
  { path: 'auth', pathMatch: 'prefix', redirectTo: '' },

  // --- Espace applicatif (protégé) ---
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'accueil' },
      { path: 'accueil', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },

      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['administrateur', 'agent', 'commission', 'service-financier'] },
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },

      // Demandes (tous rôles, filtré côté API)
      { path: 'demandes', loadComponent: () => import('./features/demandes/demandes-list.component').then((m) => m.DemandesListComponent) },
      { path: 'demandes/nouvelle', canActivate: [roleGuard], data: { roles: ['etudiant'] }, loadComponent: () => import('./features/demandes/demande-form.component').then((m) => m.DemandeFormComponent) },
      { path: 'demandes/:id', loadComponent: () => import('./features/demandes/demande-detail.component').then((m) => m.DemandeDetailComponent) },

      // Étudiants
      { path: 'etudiants', canActivate: [roleGuard], data: { roles: ['administrateur', 'agent'] }, loadComponent: () => import('./features/etudiants/etudiants-list.component').then((m) => m.EtudiantsListComponent) },

      // Référentiels (admin)
      { path: 'universites', canActivate: [roleGuard], data: { roles: ['administrateur'] }, loadComponent: () => import('./features/referentiels/universites.component').then((m) => m.UniversitesComponent) },
      { path: 'annees', canActivate: [roleGuard], data: { roles: ['administrateur'] }, loadComponent: () => import('./features/referentiels/annees.component').then((m) => m.AnneesComponent) },
      { path: 'types-bourses', canActivate: [roleGuard], data: { roles: ['administrateur'] }, loadComponent: () => import('./features/referentiels/types-bourses.component').then((m) => m.TypesBoursesComponent) },

      // Commissions & décisions
      { path: 'commissions', canActivate: [roleGuard], data: { roles: ['administrateur', 'commission'] }, loadComponent: () => import('./features/commissions/commissions.component').then((m) => m.CommissionsComponent) },

      // Paiements (finance)
      { path: 'paiements', canActivate: [roleGuard], data: { roles: ['administrateur', 'service-financier'] }, loadComponent: () => import('./features/paiements/paiements.component').then((m) => m.PaiementsComponent) },

      // Réclamations
      { path: 'reclamations', loadComponent: () => import('./features/reclamations/reclamations.component').then((m) => m.ReclamationsComponent) },

      // Notifications
      { path: 'notifications', loadComponent: () => import('./features/notifications/notifications.component').then((m) => m.NotificationsComponent) },

      // Utilisateurs (admin)
      { path: 'utilisateurs', canActivate: [roleGuard], data: { roles: ['administrateur'] }, loadComponent: () => import('./features/utilisateurs/utilisateurs.component').then((m) => m.UtilisateursComponent) },

      // Profil
      { path: 'profil', loadComponent: () => import('./features/profil/profil.component').then((m) => m.ProfilComponent) },
    ],
  },

  { path: '**', redirectTo: 'app' },
];
