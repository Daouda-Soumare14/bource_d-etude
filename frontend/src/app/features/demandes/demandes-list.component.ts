import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemandeService } from '../../core/services/demande.service';
import { AuthService } from '../../core/services/auth.service';
import { DemandeBourse, StatutDemande } from '../../core/models';
import { StatutBadgeComponent } from '../../shared/statut-badge/statut-badge.component';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-demandes-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, StatutBadgeComponent, AvatarComponent],
  template: `
    <div class="space-y-5">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="section-title">Demandes de bourse</h1>
          <p class="mt-1 text-sm text-slate-500">{{ demandes().length }} demande(s) affichée(s)</p>
        </div>
        @if (estEtudiant()) {
          <a routerLink="/app/demandes/nouvelle" class="btn-primary">➕ Nouvelle demande</a>
        }
      </div>

      <!-- Toolbar -->
      <div class="card flex flex-wrap items-center gap-3 p-3">
        <div class="relative flex-1 min-w-[220px]">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input class="input pl-9" placeholder="Rechercher un étudiant (matricule, nom)…" (input)="onSearch($event)" />
        </div>
        <select class="input max-w-[200px]" (change)="onStatut($event)">
          <option value="">Tous les statuts</option>
          @for (s of statuts; track s) { <option [value]="s">{{ s }}</option> }
        </select>
      </div>

      <!-- Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/80">
              <tr>
                <th class="table-th">Étudiant</th>
                <th class="table-th">Type de bourse</th>
                <th class="table-th">Année</th>
                <th class="table-th">Montant</th>
                <th class="table-th">Statut</th>
                <th class="table-th">Date</th>
                <th class="table-th"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (d of demandes(); track d.id) {
                <tr class="transition hover:bg-dgbe-50/40">
                  <td class="table-td">
                    <div class="flex items-center gap-3">
                      <app-avatar [nom]="d.etudiant?.utilisateur?.nom_complet ?? '?'" [size]="36" />
                      <div>
                        <div class="font-semibold text-slate-800">{{ d.etudiant?.utilisateur?.nom_complet ?? '—' }}</div>
                        <div class="text-xs text-slate-400">{{ d.etudiant?.matricule }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="table-td">{{ d.type_bourse?.nom }}</td>
                  <td class="table-td">{{ d.annee?.libelle }}</td>
                  <td class="table-td font-semibold text-slate-800">{{ +d.montant_demande | number:'1.0-0' }} <span class="text-xs font-normal text-slate-400">F</span></td>
                  <td class="table-td"><app-statut-badge [statut]="d.statut" /></td>
                  <td class="table-td text-slate-500">{{ d.date_demande }}</td>
                  <td class="table-td text-right">
                    <a [routerLink]="['/app/demandes', d.id]" class="btn-outline px-3 py-1.5 text-xs">Détails →</a>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-4 py-16 text-center">
                    <div class="text-4xl">📭</div>
                    <p class="mt-2 font-medium text-slate-500">Aucune demande trouvée</p>
                    <p class="text-sm text-slate-400">Ajustez votre recherche ou vos filtres.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DemandesListComponent {
  private service = inject(DemandeService);
  private auth = inject(AuthService);

  demandes = signal<DemandeBourse[]>([]);
  statuts: StatutDemande[] = ['Brouillon', 'Soumise', 'En vérification', 'Acceptée', 'Refusée', 'Payée'];
  estEtudiant = computed(() => this.auth.hasRole('etudiant'));

  private filters: Record<string, string> = {};
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.load();
  }

  load(): void {
    this.service.list({ ...this.filters, per_page: 50 }).subscribe((res) => this.demandes.set(res.data));
  }

  onSearch(e: Event): void {
    this.filters['search'] = (e.target as HTMLInputElement).value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.load(), 350);
  }

  onStatut(e: Event): void {
    this.filters['statut'] = (e.target as HTMLSelectElement).value;
    this.load();
  }
}
