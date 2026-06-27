import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnneeService } from '../../core/services/referentiel.service';
import { ToastService } from '../../core/services/toast.service';
import { AnneeAcademique } from '../../core/models';

@Component({
  selector: 'app-annees',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-slate-800">Années académiques</h1>

      <form [formGroup]="form" (ngSubmit)="save()" class="card grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
        <input class="input" placeholder="Libellé (2025-2026) *" formControlName="libelle" />
        <input type="date" class="input" formControlName="date_debut" />
        <input type="date" class="input" formControlName="date_fin" />
        <button class="btn-primary" [disabled]="form.invalid">Ajouter</button>
      </form>

      <div class="card divide-y divide-slate-100">
        @for (a of items(); track a.id) {
          <div class="flex items-center justify-between p-4">
            <div>
              <span class="font-medium">{{ a.libelle }}</span>
              <span class="ml-2 text-sm text-slate-400">{{ a.date_debut }} → {{ a.date_fin }}</span>
              @if (a.active) { <span class="badge ml-2 bg-dgbe-100 text-dgbe-700">Active</span> }
            </div>
            <div class="flex gap-2">
              @if (!a.active) { <button class="btn-outline text-sm" (click)="activer(a.id)">Activer</button> }
              <button class="text-xs text-red-600 hover:underline" (click)="remove(a.id)">Supprimer</button>
            </div>
          </div>
        } @empty { <div class="p-8 text-center text-slate-400">Aucune année.</div> }
      </div>
    </div>
  `,
})
export class AnneesComponent {
  private fb = inject(FormBuilder);
  private service = inject(AnneeService);
  private toast = inject(ToastService);
  items = signal<AnneeAcademique[]>([]);

  form = this.fb.nonNullable.group({
    libelle: ['', Validators.required],
    date_debut: ['', Validators.required],
    date_fin: ['', Validators.required],
  });

  constructor() { this.load(); }
  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  save(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue()).subscribe({
      next: () => { this.toast.success('Année ajoutée.'); this.form.reset({ libelle: '', date_debut: '', date_fin: '' }); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  activer(id: number): void {
    this.service.activer(id).subscribe({ next: () => { this.toast.success('Année activée.'); this.load(); } });
  }

  remove(id: number): void {
    if (!confirm('Supprimer ?')) return;
    this.service.remove(id).subscribe({ next: () => { this.toast.info('Supprimée.'); this.load(); }, error: (e) => this.toast.error(e?.error?.message ?? 'Suppression impossible (demandes liées).') });
  }
}
