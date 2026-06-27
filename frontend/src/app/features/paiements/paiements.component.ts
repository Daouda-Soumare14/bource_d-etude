import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaiementService } from '../../core/services/paiement.service';
import { DemandeService } from '../../core/services/demande.service';
import { ToastService } from '../../core/services/toast.service';
import { DemandeBourse, Paiement } from '../../core/models';
import { StatutBadgeComponent } from '../../shared/statut-badge/statut-badge.component';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [DecimalPipe, FormsModule, StatutBadgeComponent, AvatarComponent],
  template: `
    <div class="space-y-6">
      <h1 class="section-title">Paiements &amp; versements</h1>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="card p-5">
          <div class="text-sm text-slate-500">Total versé</div>
          <div class="mt-1 font-display text-2xl font-extrabold text-dgbe-600">{{ totalVerse() | number:'1.0-0' }} <span class="text-base">F</span></div>
        </div>
        <div class="card p-5">
          <div class="text-sm text-slate-500">Bénéficiaires retenus</div>
          <div class="mt-1 font-display text-2xl font-extrabold text-slate-800">{{ retenus().length }}</div>
        </div>
        <div class="card p-5">
          <div class="text-sm text-slate-500">Paiements enregistrés</div>
          <div class="mt-1 font-display text-2xl font-extrabold text-slate-800">{{ paiements().length }}</div>
        </div>
      </div>

      <!-- Bénéficiaires -->
      <div class="card overflow-hidden">
        <div class="border-b border-slate-100 p-5"><h2 class="font-semibold text-slate-800">Bénéficiaires retenus</h2></div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/80"><tr>
              <th class="table-th">Étudiant</th><th class="table-th">Type</th><th class="table-th">Montant accordé</th><th class="table-th">Statut</th><th class="table-th"></th>
            </tr></thead>
            <tbody class="divide-y divide-slate-50">
              @for (d of retenus(); track d.id) {
                <tr class="transition hover:bg-dgbe-50/40">
                  <td class="table-td">
                    <div class="flex items-center gap-3">
                      <app-avatar [nom]="d.etudiant?.utilisateur?.nom_complet ?? '?'" [size]="34" />
                      <span class="font-semibold text-slate-800">{{ d.etudiant?.utilisateur?.nom_complet }}</span>
                    </div>
                  </td>
                  <td class="table-td">{{ d.type_bourse?.nom }}</td>
                  <td class="table-td font-semibold">{{ +(d.decision?.montant_accorde ?? 0) | number:'1.0-0' }} F</td>
                  <td class="table-td"><app-statut-badge [statut]="d.statut" /></td>
                  <td class="table-td text-right">
                    @if (d.decision && d.statut !== 'Payée') {
                      <button class="btn-primary px-3 py-1.5 text-xs" (click)="ouvrir(d)">💳 Enregistrer</button>
                    }
                  </td>
                </tr>
              } @empty { <tr><td colspan="5" class="px-4 py-12 text-center text-slate-400">Aucun bénéficiaire.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formulaire paiement -->
      @if (selection(); as d) {
        <div class="card border-dgbe-200 bg-dgbe-50/40 p-5 animate-fade-up">
          <h2 class="flex items-center gap-2 font-semibold text-slate-800">💳 Paiement — {{ d.etudiant?.utilisateur?.nom_complet }}</h2>
          <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div><label class="label">Montant (FCFA)</label><input type="number" class="input" [(ngModel)]="montant" /></div>
            <div><label class="label">Mode</label>
              <select class="input" [(ngModel)]="mode"><option>Virement</option><option>Mobile Money</option><option>Chèque</option><option>Espèces</option></select>
            </div>
            <div><label class="label">Référence</label><input class="input" [(ngModel)]="reference" placeholder="PAY-…" /></div>
            <div class="flex items-end gap-2">
              <button class="btn-primary flex-1" (click)="payer()">Valider</button>
              <button class="btn-outline" (click)="selection.set(null)">✕</button>
            </div>
          </div>
        </div>
      }

      <!-- Historique -->
      <div class="card overflow-hidden">
        <div class="border-b border-slate-100 p-5"><h2 class="font-semibold text-slate-800">Historique des paiements</h2></div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/80"><tr>
              <th class="table-th">Date</th><th class="table-th">Bénéficiaire</th><th class="table-th">Montant</th><th class="table-th">Mode</th><th class="table-th">Référence</th><th class="table-th">Statut</th>
            </tr></thead>
            <tbody class="divide-y divide-slate-50">
              @for (p of paiements(); track p.id) {
                <tr class="transition hover:bg-dgbe-50/40">
                  <td class="table-td text-slate-500">{{ p.date_paiement }}</td>
                  <td class="table-td font-medium">{{ p.decision?.demande?.etudiant?.utilisateur?.nom_complet ?? '—' }}</td>
                  <td class="table-td font-semibold text-dgbe-700">{{ +p.montant | number:'1.0-0' }} F</td>
                  <td class="table-td">{{ p.mode_paiement }}</td>
                  <td class="table-td"><span class="font-mono text-xs text-slate-500">{{ p.reference }}</span></td>
                  <td class="table-td"><app-statut-badge [statut]="p.statut" /></td>
                </tr>
              } @empty { <tr><td colspan="6" class="px-4 py-12 text-center text-slate-400">Aucun paiement.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PaiementsComponent {
  private paiementService = inject(PaiementService);
  private demandeService = inject(DemandeService);
  private toast = inject(ToastService);

  retenus = signal<DemandeBourse[]>([]);
  paiements = signal<Paiement[]>([]);
  selection = signal<DemandeBourse | null>(null);

  totalVerse = computed(() =>
    this.paiements().filter((p) => p.statut === 'payé').reduce((s, p) => s + +p.montant, 0),
  );

  montant = 0;
  mode = 'Virement';
  reference = '';

  constructor() { this.load(); }

  load(): void {
    this.demandeService.list({ statut: 'Acceptée', per_page: 100 }).subscribe((r) => this.retenus.set(r.data));
    this.paiementService.list({ per_page: 100 }).subscribe((r) => this.paiements.set(r.data));
  }

  ouvrir(d: DemandeBourse): void {
    this.selection.set(d);
    this.montant = +(d.decision?.montant_accorde ?? 0);
    this.reference = '';
  }

  payer(): void {
    const d = this.selection();
    if (!d?.decision) return;
    this.paiementService.create({
      decision_id: d.decision.id,
      montant: this.montant,
      mode_paiement: this.mode,
      reference: this.reference,
      statut: 'payé',
    }).subscribe({
      next: () => { this.toast.success('Paiement enregistré.'); this.selection.set(null); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }
}
