import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommissionService } from '../../core/services/commission.service';
import { ToastService } from '../../core/services/toast.service';
import { Commission } from '../../core/models';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-slate-800">Commissions de validation</h1>

      <form [formGroup]="form" (ngSubmit)="save()" class="card grid grid-cols-1 gap-3 p-4 md:grid-cols-3">
        <input class="input" placeholder="Nom de la commission *" formControlName="nom" />
        <input type="date" class="input" formControlName="date_reunion" />
        <button class="btn-primary" [disabled]="form.invalid">Créer</button>
      </form>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (c of items(); track c.id) {
          <div class="card p-5">
            <div class="font-semibold text-slate-800">{{ c.nom }}</div>
            <div class="mt-1 text-sm text-slate-400">Réunion : {{ c.date_reunion ?? '—' }}</div>
            <div class="mt-2 text-sm text-slate-500">Membres : {{ c.membres?.length ?? 0 }} · Décisions : {{ c.decisions_count ?? 0 }}</div>
            @if (c.membres?.length) {
              <div class="mt-2 flex flex-wrap gap-1">
                @for (m of c.membres!; track m.id) { <span class="badge bg-slate-100 text-slate-600">{{ m.nom_complet }}</span> }
              </div>
            }
            <button class="mt-3 text-xs text-red-600 hover:underline" (click)="remove(c.id)">Supprimer</button>
          </div>
        } @empty { <div class="p-8 text-center text-slate-400">Aucune commission.</div> }
      </div>
    </div>
  `,
})
export class CommissionsComponent {
  private fb = inject(FormBuilder);
  private service = inject(CommissionService);
  private toast = inject(ToastService);
  items = signal<Commission[]>([]);

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    date_reunion: [''],
  });

  constructor() { this.load(); }
  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  save(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue()).subscribe({
      next: () => { this.toast.success('Commission créée.'); this.form.reset({ nom: '', date_reunion: '' }); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Supprimer ?')) return;
    this.service.remove(id).subscribe({ next: () => { this.toast.info('Supprimée.'); this.load(); } });
  }
}
