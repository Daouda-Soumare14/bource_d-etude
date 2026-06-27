# DGBE — Frontend Angular

Interface web de la plateforme de gestion des bourses étudiantes (DGBE), construite avec **Angular 17** (composants standalone), **Tailwind CSS** et **Chart.js**.

## Caractéristiques

- **Standalone components** + **lazy loading** (chaque page est un chunk séparé).
- **Reactive Forms** pour tous les formulaires (login, inscription, demandes, CRUD…).
- **Route Guards** : `authGuard` (connexion requise) et `roleGuard` (accès par rôle).
- **Intercepteur HTTP** : ajoute le token Bearer et gère la déconnexion sur 401.
- **Signals** pour l'état (utilisateur courant, notifications, toasts).
- **Responsive / Mobile First** (sidebar repliable, grilles adaptatives).
- Identité visuelle **DGBE** (logo SVG, palette verte/or).

## Architecture

```
src/app/
├── core/
│   ├── models/            # Interfaces TypeScript (User, DemandeBourse, …)
│   ├── interceptors/      # auth.interceptor (token Bearer + 401)
│   ├── guards/            # authGuard, roleGuard
│   └── services/          # AuthService, CrudService<T> + services par module
├── shared/                # LogoComponent, StatutBadgeComponent, ToastComponent
├── layout/                # AppLayoutComponent (sidebar par rôle + topbar)
├── features/              # Pages (lazy-loaded)
│   ├── auth/ · dashboard/ · demandes/ · etudiants/ · referentiels/
│   ├── commissions/ · paiements/ · reclamations/ · notifications/
│   └── utilisateurs/ · profil/ · home/
├── app.routes.ts          # Routing + guards
└── app.config.ts          # provideHttpClient + provideRouter
```

## Installation & lancement

```bash
cd frontend
npm install
npm start            # http://localhost:4200
```

> L'URL de l'API est définie dans `src/environments/environment.ts`
> (`http://127.0.0.1:8001/api`). Le backend Laravel doit tourner sur le port **8001**.

## Comptes de démonstration (mot de passe : `password`)

`admin@dgbe.sn` · `agent@dgbe.sn` · `commission@dgbe.sn` · `finance@dgbe.sn` · `etudiant1@dgbe.sn`

## Interfaces par rôle

| Rôle | Accès |
|------|-------|
| Administrateur | Tout : dashboard, référentiels, commissions, paiements, utilisateurs |
| Agent | Demandes (vérification), étudiants, dashboard |
| Commission | Demandes (décisions), commissions, dashboard |
| Service financier | Paiements / versements, dashboard |
| Étudiant | Déposer/suivre ses demandes, pièces, réclamations, notifications |

## Build de production

```bash
npm run build        # dist/frontend
```
