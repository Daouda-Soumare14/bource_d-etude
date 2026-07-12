import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthModalService } from '../../core/services/auth-modal.service';
import { LogoComponent } from '../../shared/logo/logo.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <div class="min-h-screen bg-white">
      <!-- ===== NAVBAR ===== -->
      <header class="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a routerLink="/"><app-logo [size]="38" /></a>
          <div class="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#fonctionnalites" class="hover:text-dgbe-700">Fonctionnalités</a>
            <a href="#processus" class="hover:text-dgbe-700">Processus</a>
            <a href="#acteurs" class="hover:text-dgbe-700">Acteurs</a>
          </div>
          <div class="flex items-center gap-2">
            @if (connecte()) {
              <a routerLink="/app" class="btn-primary text-sm">Mon espace →</a>
              <button class="btn-ghost text-sm" (click)="logout()">Déconnexion</button>
            } @else {
              <button class="btn-ghost text-sm" (click)="modal.open('login')">Connexion</button>
              <button class="btn-primary text-sm" (click)="modal.open('register')">Créer un compte</button>
            }
          </div>
        </nav>
      </header>

      <!-- ===== HERO ===== -->
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 bg-radial-fade"></div>
        <div class="absolute inset-0 bg-grid-dgbe [background-size:40px_40px] [mask-image:radial-gradient(60%_50%_at_50%_0%,#000,transparent)]"></div>
        <div class="absolute -left-24 top-20 h-72 w-72 rounded-full bg-dgbe-200/50 blur-3xl"></div>
        <div class="absolute -right-24 top-40 h-72 w-72 rounded-full bg-dgbe-300/30 blur-3xl"></div>

        <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <!-- Texte -->
          <div class="text-center md:text-left">
            <span class="chip animate-fade-in">🇸🇳 République du Sénégal · DGBE</span>
            <h1 class="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 animate-fade-up md:text-6xl">
              La gestion des <span class="bg-gradient-to-r from-dgbe-600 to-dgbe-400 bg-clip-text text-transparent">bourses étudiantes</span>,
              simplifiée et transparente.
            </h1>
            <p class="mt-6 max-w-xl text-lg text-slate-600 animate-fade-up md:mx-0 mx-auto" style="animation-delay:.1s">
              Dépôt des demandes, vérification des dossiers, attribution, paiements et suivi —
              une plateforme unique, sécurisée et 100% numérique pour tous les acteurs.
            </p>
            <div class="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up md:justify-start" style="animation-delay:.2s">
              <button (click)="commencer()" class="btn-primary px-6 py-3 text-base">Déposer une demande →</button>
              <button (click)="espace()" class="btn-outline px-6 py-3 text-base">Espace administration</button>
            </div>
          </div>

          <!-- Visuel -->
          <div class="relative animate-fade-up" style="animation-delay:.15s">
            <div class="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-dgbe-500/20 to-dgbe-200/10 blur-2xl"></div>
            <div class="relative overflow-hidden rounded-[2rem] border border-white/60 shadow-elevate ring-1 ring-black/5">
              <img src="assets/img/toques.jpg" alt="Étudiant diplômé DGBE"
                   class="h-[420px] w-full object-cover md:h-[480px]" loading="eager" />
              <div class="absolute inset-0 bg-gradient-to-t from-dgbe-900/50 via-transparent to-transparent"></div>
            </div>
            <!-- Badge flottant -->
            <div class="absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-elevate backdrop-blur animate-float">
              <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-dgbe-600 text-xl text-white shadow-glow">🎓</span>
              <div>
                <div class="font-display text-lg font-extrabold leading-none text-slate-900">15 000+</div>
                <div class="text-xs text-slate-500">boursiers accompagnés</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="relative mx-auto -mt-2 grid max-w-6xl grid-cols-2 gap-4 px-5 pb-16 md:grid-cols-4">
          @for (s of stats; track s.label) {
            <div class="card card-hover p-5 text-center animate-fade-up">
              <div class="font-display text-3xl font-extrabold text-dgbe-600">{{ s.value }}</div>
              <div class="mt-1 text-sm text-slate-500">{{ s.label }}</div>
            </div>
          }
        </div>
      </section>

      <!-- ===== FONCTIONNALITÉS ===== -->
      <section id="fonctionnalites" class="mx-auto max-w-7xl px-5 py-20">
        <div class="text-center">
          <span class="chip">Fonctionnalités</span>
          <h2 class="mt-4 font-display text-3xl font-bold text-slate-900 md:text-4xl">Tout le cycle de la bourse, au même endroit</h2>
          <p class="mx-auto mt-3 max-w-2xl text-slate-600">De la demande de l'étudiant jusqu'au versement, avec traçabilité complète.</p>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          @for (f of features; track f.titre) {
            <div class="card card-hover p-6">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-dgbe-500 to-dgbe-700 text-2xl text-white shadow-glow">{{ f.icon }}</div>
              <h3 class="mt-4 text-lg font-bold text-slate-900">{{ f.titre }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ f.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- ===== EXPÉRIENCE / SHOWCASE ===== -->
      <section class="relative overflow-hidden bg-slate-50 py-20">
        <div class="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
          <div class="relative order-2 md:order-1">
            <div class="absolute -inset-3 -z-10 rounded-[2rem] bg-dgbe-200/40 blur-2xl"></div>
            <div class="grid grid-cols-2 gap-4">
              <img src="assets/img/etude-groupe.jpg" alt="Étudiants collaborant en ligne"
                   class="h-56 w-full rounded-2xl object-cover shadow-card ring-1 ring-black/5" loading="lazy" />
              <img src="assets/img/en-ligne.jpg" alt="Démarches 100% en ligne"
                   class="mt-8 h-56 w-full rounded-2xl object-cover shadow-card ring-1 ring-black/5" loading="lazy" />
              <img src="assets/img/etudiante.jpg" alt="Étudiante boursière"
                   class="-mt-4 h-56 w-full rounded-2xl object-cover shadow-card ring-1 ring-black/5" loading="lazy" />
              <img src="assets/img/bibliotheque.jpg" alt="Espace universitaire"
                   class="mt-4 h-56 w-full rounded-2xl object-cover shadow-card ring-1 ring-black/5" loading="lazy" />
            </div>
          </div>
          <div class="order-1 md:order-2">
            <span class="chip">Une expérience 100% numérique</span>
            <h2 class="mt-4 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Des démarches simples, où que vous soyez
            </h2>
            <p class="mt-4 text-slate-600">
              Fini les files d'attente et les dossiers papier. Depuis un ordinateur ou un simple
              téléphone, l'étudiant dépose sa demande, joint ses pièces et suit chaque étape en
              temps réel — de la vérification jusqu'au versement de sa bourse.
            </p>
            <ul class="mt-6 space-y-3">
              @for (p of avantages; track p) {
                <li class="flex items-start gap-3 text-slate-700">
                  <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dgbe-100 text-xs font-bold text-dgbe-700">✓</span>
                  {{ p }}
                </li>
              }
            </ul>
            <button (click)="commencer()" class="btn-primary mt-8 px-6 py-3 text-base">Créer mon compte étudiant →</button>
          </div>
        </div>
      </section>

      <!-- ===== PROCESSUS ===== -->
      <section id="processus" class="relative overflow-hidden bg-ink-900 py-20 text-white">
        <img src="assets/img/campus.jpg" alt="" aria-hidden="true"
             class="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div class="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-900/95 to-dgbe-900/85"></div>
        <div class="absolute inset-0 bg-grid-dgbe opacity-20 [background-size:38px_38px]"></div>
        <div class="relative mx-auto max-w-7xl px-5">
          <div class="text-center">
            <span class="chip bg-white/10 text-dgbe-200 ring-white/10">Processus</span>
            <h2 class="mt-4 font-display text-3xl font-bold md:text-4xl">5 étapes claires</h2>
          </div>
          <div class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-5">
            @for (e of etapes; track e.n) {
              <div class="relative">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400 font-display text-lg font-extrabold text-ink-900">{{ e.n }}</div>
                <h3 class="mt-4 font-semibold">{{ e.titre }}</h3>
                <p class="mt-1 text-sm text-slate-400">{{ e.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ===== ACTEURS ===== -->
      <section id="acteurs" class="mx-auto max-w-7xl px-5 py-20">
        <div class="text-center">
          <span class="chip">Acteurs</span>
          <h2 class="mt-4 font-display text-3xl font-bold text-slate-900 md:text-4xl">Une interface pensée pour chaque rôle</h2>
        </div>
        <div class="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          @for (a of acteurs; track a.nom) {
            <div class="card card-hover p-5 text-center">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dgbe-50 text-3xl">{{ a.icon }}</div>
              <h3 class="mt-3 font-bold text-slate-900">{{ a.nom }}</h3>
              <p class="mt-1 text-xs text-slate-500">{{ a.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- ===== CTA ===== -->
      <section class="mx-auto max-w-7xl px-5 pb-20">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dgbe-600 to-dgbe-800 p-10 text-center text-white md:p-16">
          <img src="assets/img/bibliotheque.jpg" alt="" aria-hidden="true"
               class="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity" />
          <div class="absolute inset-0 bg-gradient-to-br from-dgbe-700/80 to-dgbe-900/85"></div>
          <div class="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-gold-400/20 blur-2xl"></div>
          <h2 class="relative font-display text-3xl font-bold md:text-4xl">Prêt à déposer votre demande de bourse ?</h2>
          <p class="relative mx-auto mt-3 max-w-xl text-dgbe-100">Créez votre compte étudiant en quelques minutes et suivez votre dossier en temps réel.</p>
          <div class="relative mt-8 flex flex-wrap justify-center gap-3">
            <button (click)="commencer()" class="btn-gold px-6 py-3 text-base">Commencer maintenant</button>
            <button (click)="modal.open('login')" class="btn px-6 py-3 text-base text-white ring-1 ring-inset ring-white/40 hover:bg-white/10">Se connecter</button>
          </div>
        </div>
      </section>

      <!-- ===== FOOTER ===== -->
      <footer class="border-t border-slate-100 bg-slate-50">
        <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row">
          <app-logo [size]="34" />
          <p class="text-sm text-slate-500">© {{ year }} DGBE — Direction de la Gestion des Bourses Étudiantes. Tous droits réservés.</p>
          <div class="flex gap-4 text-sm text-slate-500">
            <button class="hover:text-dgbe-700" (click)="modal.open('login')">Connexion</button>
            <button class="hover:text-dgbe-700" (click)="modal.open('register')">Inscription</button>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LandingComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  modal = inject(AuthModalService);

  year = new Date().getFullYear();
  connecte = computed(() => this.auth.isAuthenticated());

  commencer(): void {
    if (this.connecte()) this.router.navigate(['/app']);
    else this.modal.open('register');
  }

  espace(): void {
    if (this.connecte()) this.router.navigate(['/app']);
    else this.modal.open('login');
  }

  logout(): void {
    this.auth.logout();
  }

  avantages = [
    'Dépôt et suivi de la demande en ligne, 24h/24',
    'Notifications à chaque étape du dossier',
    'Transparence totale sur les décisions et les paiements',
    'Réclamations traitées directement sur la plateforme',
  ];

  stats = [
    { value: '15 000+', label: 'Étudiants accompagnés' },
    { value: '40+', label: 'Établissements' },
    { value: '14', label: 'Régions couvertes' },
    { value: '100%', label: 'Numérique' },
  ];

  features = [
    { icon: '📝', titre: 'Demandes en ligne', desc: 'Les étudiants déposent et suivent leur demande, joignent leurs pièces justificatives en quelques clics.' },
    { icon: '🔍', titre: 'Vérification des dossiers', desc: "Les agents contrôlent les pièces, valident ou demandent des corrections en toute traçabilité." },
    { icon: '⚖️', titre: 'Attribution par commission', desc: 'La commission statue, ajuste les montants et motive chaque décision.' },
    { icon: '💳', titre: 'Paiements & versements', desc: 'Le service financier enregistre les paiements et suit les cumuls et restes à payer.' },
    { icon: '📊', titre: 'Tableaux de bord', desc: 'Statistiques et graphiques en temps réel : par statut, région, université, évolution annuelle.' },
    { icon: '🔔', titre: 'Notifications & réclamations', desc: 'Chaque acteur est notifié des évènements clés ; les étudiants peuvent réclamer en ligne.' },
  ];

  etapes = [
    { n: 1, titre: 'Dépôt', desc: "L'étudiant soumet sa demande et ses pièces." },
    { n: 2, titre: 'Vérification', desc: "L'agent contrôle le dossier." },
    { n: 3, titre: 'Décision', desc: 'La commission attribue ou refuse.' },
    { n: 4, titre: 'Paiement', desc: 'Le service financier verse la bourse.' },
    { n: 5, titre: 'Suivi', desc: "L'étudiant suit ses versements." },
  ];

  acteurs = [
    { icon: '🛡️', nom: 'Administrateur', desc: 'Supervision & référentiels' },
    { icon: '🧑‍💼', nom: 'Agent', desc: 'Vérification des dossiers' },
    { icon: '⚖️', nom: 'Commission', desc: "Décisions d'attribution" },
    { icon: '💰', nom: 'Service financier', desc: 'Paiements & états' },
    { icon: '🎓', nom: 'Étudiant', desc: 'Demandes & suivi' },
  ];
}
