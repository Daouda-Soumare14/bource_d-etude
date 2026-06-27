import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DemandeService } from '../../core/services/demande.service';
import { DecisionService } from '../../core/services/decision.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { DemandeBourse } from '../../core/models';
import { StatutBadgeComponent } from '../../shared/statut-badge/statut-badge.component';

@Component({
  selector: 'app-demande-detail',
  standalone: true,
  imports: [DecimalPipe, FormsModule, RouterLink, StatutBadgeComponent],
  template: `
    @if (demande(); as d) {
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <a routerLink="/app/demandes" class="text-sm text-slate-500 hover:underline">← Retour</a>
          <app-statut-badge [statut]="d.statut" />
        </div>

        <div class="card p-6">
          <h1 class="text-xl font-bold text-slate-800">Demande #{{ d.id }} — {{ d.type_bourse?.nom }}</h1>
          <div class="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div><div class="text-slate-400">Étudiant</div><div class="font-medium">{{ d.etudiant?.utilisateur?.nom_complet }}</div></div>
            <div><div class="text-slate-400">Matricule</div><div class="font-medium">{{ d.etudiant?.matricule }}</div></div>
            <div><div class="text-slate-400">Année</div><div class="font-medium">{{ d.annee?.libelle }}</div></div>
            <div><div class="text-slate-400">Montant demandé</div><div class="font-medium">{{ +d.montant_demande | number:'1.0-0' }} F</div></div>
          </div>
          @if (d.observation) {
            <div class="mt-4 rounded-lg bg-slate-50 p-3 text-sm"><b>Observation :</b> {{ d.observation }}</div>
          }
        </div>

        <!-- Actions workflow -->
        <div class="card p-6">
          <h2 class="mb-3 font-semibold text-slate-700">Actions</h2>
          <div class="flex flex-wrap gap-2">
            @if (estEtudiant() && d.statut === 'Brouillon') {
              <button class="btn-primary" (click)="soumettre()">📤 Soumettre la demande</button>
            }
            @if (peutVerifier() && d.statut === 'Soumise') {
              <button class="btn-primary" (click)="prendreEnCharge()">🔍 Prendre en charge</button>
            }
            @if (peutVerifier() && d.statut === 'En vérification') {
              <button class="btn-danger" (click)="rejeter()">✕ Rejeter le dossier</button>
            }
            @if (peutDecider() && (d.statut === 'En vérification' || d.statut === 'Soumise') && !d.decision) {
              <button class="btn-primary" (click)="showDecision.set(true)">⚖️ Statuer (commission)</button>
            }
            @if (!actionsDisponibles()) {
              <span class="text-sm text-slate-400">Aucune action disponible à ce stade.</span>
            }
          </div>

          @if (showDecision()) {
            <div class="mt-4 space-y-3 rounded-lg border border-slate-200 p-4">
              <h3 class="font-medium">Décision de la commission</h3>
              <select class="input" [(ngModel)]="decisionType">
                <option value="Acceptée">Accepter</option>
                <option value="Refusée">Refuser</option>
              </select>
              @if (decisionType === 'Acceptée') {
                <input type="number" class="input" placeholder="Montant accordé (FCFA)" [(ngModel)]="montantAccorde" />
              }
              <textarea class="input" rows="2" placeholder="Observation" [(ngModel)]="observation"></textarea>
              <div class="flex gap-2">
                <button class="btn-primary" (click)="statuer()">Valider la décision</button>
                <button class="btn-outline" (click)="showDecision.set(false)">Annuler</button>
              </div>
            </div>
          }
        </div>

        <!-- Décision existante -->
        @if (d.decision) {
          <div class="card p-6">
            <h2 class="mb-3 font-semibold text-slate-700">Décision</h2>
            <p class="text-sm"><app-statut-badge [statut]="d.decision.decision" /> — Montant accordé :
              <b>{{ +d.decision.montant_accorde | number:'1.0-0' }} F</b> ({{ d.decision.date_decision }})</p>
            @if (d.decision.observation) { <p class="mt-2 text-sm text-slate-500">{{ d.decision.observation }}</p> }
          </div>
        }

        <!-- Pièces justificatives -->
        <div class="card p-6">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-semibold text-slate-700">Pièces justificatives</h2>
            @if (estEtudiant() && (d.statut === 'Brouillon' || d.statut === 'Soumise')) {
              <label class="btn-outline cursor-pointer text-sm">
                + Ajouter
                <input type="file" class="hidden" (change)="upload($event)" />
              </label>
            }
          </div>
          <div class="space-y-2">
            @for (p of d.pieces ?? []; track p.id) {
              <div class="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <a [href]="p.url" target="_blank" class="font-medium text-dgbe-600 hover:underline">{{ p.nom_document }}</a>
                  @if (p.motif_rejet) { <div class="text-xs text-red-500">Motif : {{ p.motif_rejet }}</div> }
                </div>
                <div class="flex items-center gap-2">
                  <app-statut-badge [statut]="p.statut" />
                  @if (peutVerifier() && p.statut === 'En attente') {
                    <button class="text-xs font-medium text-dgbe-600 hover:underline" (click)="validerPiece(p.id)">Valider</button>
                    <button class="text-xs font-medium text-red-600 hover:underline" (click)="rejeterPiece(p.id)">Rejeter</button>
                  }
                </div>
              </div>
            } @empty {
              <p class="text-sm text-slate-400">Aucune pièce déposée.</p>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="card p-10 text-center text-slate-400">Chargement…</div>
    }
  `,
})
export class DemandeDetailComponent implements OnInit {
  id = input.required<string>();

  private service = inject(DemandeService);
  private decisions = inject(DecisionService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  demande = signal<DemandeBourse | null>(null);
  showDecision = signal(false);
  decisionType = 'Acceptée';
  montantAccorde: number | null = null;
  observation = '';

  estEtudiant = computed(() => this.auth.hasRole('etudiant'));
  peutVerifier = computed(() => this.auth.hasRole('agent', 'administrateur'));
  peutDecider = computed(() => this.auth.hasRole('commission', 'administrateur'));

  actionsDisponibles = computed(() => {
    const d = this.demande();
    if (!d) return false;
    return (
      (this.estEtudiant() && d.statut === 'Brouillon') ||
      (this.peutVerifier() && (d.statut === 'Soumise' || d.statut === 'En vérification')) ||
      (this.peutDecider() && !d.decision && (d.statut === 'En vérification' || d.statut === 'Soumise'))
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.service.get(+this.id()).subscribe((res) => this.demande.set(res.data));
  }

  soumettre(): void {
    this.service.soumettre(this.demande()!.id).subscribe({
      next: (res) => { this.demande.set(res.data); this.toast.success('Demande soumise.'); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  prendreEnCharge(): void {
    this.service.prendreEnCharge(this.demande()!.id).subscribe({
      next: (res) => { this.demande.set(res.data); this.toast.success('Dossier en vérification.'); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  rejeter(): void {
    const motif = prompt('Motif du rejet ?') ?? undefined;
    this.service.rejeter(this.demande()!.id, motif).subscribe({
      next: (res) => { this.demande.set(res.data); this.toast.success('Dossier rejeté.'); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  statuer(): void {
    const d = this.demande()!;
    this.decisions.create({
      commission_id: 1,
      demande_id: d.id,
      decision: this.decisionType,
      montant_accorde: this.decisionType === 'Acceptée' ? (this.montantAccorde ?? d.montant_demande) : 0,
      observation: this.observation,
    }).subscribe({
      next: () => { this.toast.success('Décision enregistrée.'); this.showDecision.set(false); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur. Une commission (id=1) doit exister.'),
    });
  }

  upload(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const nom = prompt('Nom du document', file.name) ?? file.name;
    this.service.uploadPiece(this.demande()!.id, nom, file).subscribe({
      next: () => { this.toast.success('Pièce ajoutée.'); this.load(); },
      error: (err) => this.toast.error(err?.error?.message ?? 'Erreur upload.'),
    });
  }

  validerPiece(id: number): void {
    this.service.validerPiece(id).subscribe({ next: () => { this.toast.success('Pièce validée.'); this.load(); } });
  }

  rejeterPiece(id: number): void {
    const motif = prompt('Motif du rejet ?') ?? undefined;
    this.service.rejeterPiece(id, motif).subscribe({ next: () => { this.toast.info('Pièce rejetée.'); this.load(); } });
  }
}
