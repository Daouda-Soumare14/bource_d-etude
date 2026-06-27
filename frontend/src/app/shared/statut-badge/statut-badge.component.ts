import { Component, Input } from '@angular/core';

/** Badge coloré pour un statut (demande, paiement, pièce, réclamation). */
@Component({
  selector: 'app-statut-badge',
  standalone: true,
  template: `<span class="badge" [class]="classes">{{ statut }}</span>`,
})
export class StatutBadgeComponent {
  @Input() statut = '';

  private map: Record<string, string> = {
    // Demandes
    'Brouillon': 'bg-slate-100 text-slate-700',
    'Soumise': 'bg-blue-100 text-blue-700',
    'En vérification': 'bg-amber-100 text-amber-700',
    'Acceptée': 'bg-dgbe-100 text-dgbe-700',
    'Refusée': 'bg-red-100 text-red-700',
    'Payée': 'bg-emerald-100 text-emerald-700',
    // Paiements
    'payé': 'bg-emerald-100 text-emerald-700',
    'en attente': 'bg-amber-100 text-amber-700',
    'annulé': 'bg-red-100 text-red-700',
    // Pièces
    'Validée': 'bg-dgbe-100 text-dgbe-700',
    'Rejetée': 'bg-red-100 text-red-700',
    'En attente': 'bg-amber-100 text-amber-700',
    // Réclamations
    'Ouverte': 'bg-blue-100 text-blue-700',
    'En cours': 'bg-amber-100 text-amber-700',
    'Traitée': 'bg-dgbe-100 text-dgbe-700',
    'Fermée': 'bg-slate-100 text-slate-600',
  };

  get classes(): string {
    return this.map[this.statut] ?? 'bg-slate-100 text-slate-700';
  }
}
