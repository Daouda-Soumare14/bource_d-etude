# DGBE — API de Gestion et de Suivi des Bourses Étudiantes

Backend **Laravel 12** (PHP 8.2+) / **PostgreSQL** pour la *Direction de la Gestion des Bourses Étudiantes* (DGBE) du Sénégal.

API REST sécurisée par **Laravel Sanctum** (tokens) et **Spatie Laravel Permission** (rôles & permissions), construite selon une architecture **MVC + Repository Pattern + Service Layer + Form Request Validation + API Resources**.

---

## 1. Architecture

```
app/
├── Models/                 # Eloquent (User, Etudiant, DemandeBourse, Decision, Paiement…)
├── Repositories/           # Repository Pattern
│   ├── Contracts/RepositoryInterface.php
│   ├── BaseRepository.php  # CRUD générique + filtres/recherche
│   └── *Repository.php     # un par entité
├── Services/               # Couche métier (workflow, règles, transactions)
│   ├── BaseService.php
│   ├── AuthService.php · DemandeBourseService.php · DecisionService.php
│   ├── PaiementService.php · NotificationService.php · StatistiqueService.php …
├── Http/
│   ├── Controllers/Api/    # Contrôleurs fins → délèguent aux Services
│   ├── Requests/           # Form Request Validation
│   └── Resources/          # API Resources (sérialisation JSON)
database/
├── migrations/             # Schéma PostgreSQL
├── seeders/                # Rôles, référentiels (Sénégal), comptes, démo
└── factories/
routes/api.php              # Toutes les routes API (préfixe /api)
```

**Flux d'une requête :** `Route → Middleware (Sanctum + permission) → Controller → Service → Repository → Eloquent → Resource (JSON)`

---

## 2. Installation

```bash
cd backend
composer install
cp .env.example .env        # configurer PostgreSQL : base "dgbe_bourses"
php artisan key:generate

# Base de données
createdb dgbe_bourses
php artisan migrate:fresh --seed
php artisan storage:link    # accès public aux pièces jointes

php artisan serve --port=8001   # http://127.0.0.1:8001
```

> ⚠️ Le port **8000** est utilisé par un autre projet sur cette machine : on utilise **8001**.

---

## 3. Comptes de démonstration

Tous les mots de passe : **`password`**

| Rôle | Email | Permissions clés |
|------|-------|------------------|
| Administrateur | `admin@dgbe.sn` | tout |
| Agent de traitement | `agent@dgbe.sn` | vérifier dossiers, étudiants, stats |
| Commission | `commission@dgbe.sn` | décider des demandes, stats |
| Service financier | `finance@dgbe.sn` | paiements, stats |
| Étudiant | `etudiant1@dgbe.sn` … `etudiant24@dgbe.sn` | ses demandes / réclamations |

---

## 4. Authentification

```http
POST /api/auth/login
{ "email": "admin@dgbe.sn", "password": "password" }
→ { "token": "1|xxxx", "token_type": "Bearer", "data": { …user… } }
```

Ajouter ensuite les en-têtes : `Authorization: Bearer <token>` et `Accept: application/json`.

| Méthode | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Inscription d'un étudiant (crée compte + profil) |
| POST | `/api/auth/login` | Connexion (retourne un token) |
| GET  | `/api/auth/me` | Profil de l'utilisateur connecté |
| POST | `/api/auth/logout` | Déconnexion (révoque le token) |
| POST | `/api/auth/forgot-password` | Lien de réinitialisation |
| POST | `/api/auth/reset-password` | Réinitialisation effective |

---

## 5. Principaux endpoints (préfixe `/api`)

| Module | Endpoints | Permission |
|--------|-----------|-----------|
| Tableau de bord | `GET /dashboard` | `voir-statistiques` |
| Universités / Facultés / Filières | `apiResource /universites · /facultes · /filieres` | lecture : tous · écriture : `gerer-etablissements` |
| Années académiques | `apiResource /annees` + `PATCH /annees/{id}/activer` | `gerer-annees` |
| Types de bourses | `apiResource /types-bourses` | `gerer-types-bourses` |
| Étudiants | `apiResource /etudiants` | `gerer-etudiants` |
| Demandes | `apiResource /demandes` + `/{id}/soumettre` `/prendre-en-charge` `/rejeter` | étudiant/agent |
| Pièces justificatives | `POST /pieces` (upload) · `PATCH /pieces/{id}/valider` `/rejeter` | étudiant/agent |
| Commissions | `apiResource /commissions` + `POST /commissions/{id}/membres` | `gerer-commissions` |
| Décisions | `GET/POST /decisions` | `decider-demandes` |
| Paiements | `apiResource /paiements` | `gerer-paiements` |
| Réclamations | `apiResource /reclamations` + `/{id}/repondre` | étudiant + `gerer-reclamations` |
| Notifications | `GET /notifications` · `PATCH /{id}/lu` · `POST /tout-lu` | tous |
| Utilisateurs | `apiResource /users` + `GET /roles` | `gerer-utilisateurs` |

Les listes (`index`) supportent : `?search=`, filtres (`?statut=`, `?annee_id=`…), `?per_page=`.

---

## 6. Workflow d'une demande de bourse

```
Brouillon ──soumettre(étudiant)──▶ Soumise ──prendre-en-charge(agent)──▶ En vérification
   │                                                                          │
   │                                              décision(commission) ───────┤
   │                                                   ├── Acceptée ──paiement(finance)──▶ Payée
   └── (rejeter / refusée) ◀───────────────────────────┴── Refusée
```

Chaque transition acceptée/refusée/payée génère automatiquement une **notification** à l'étudiant.

---

## 7. Sécurité

- Authentification par token **Sanctum** ; mots de passe hachés **bcrypt**.
- **Spatie Permission** : 5 rôles, 11 permissions, contrôle au niveau des routes.
- **Validation serveur** systématique via les Form Requests.
- **Rate limiting** : 60 req/min par utilisateur (`throttleApi`).
- Protections natives Laravel : XSS (échappement), injections SQL (requêtes paramétrées Eloquent), validation des uploads (type/taille).
- Réponses d'erreur JSON normalisées (401/403/422).

---

## 8. Reste à faire (phases suivantes)

- Frontend **Angular** (interfaces par rôle, tableaux de bord, graphiques).
- Export des rapports **PDF/Excel**.
- Diagrammes **UML** (contexte, cas d'utilisation, classes) + logo **DGBE**.
