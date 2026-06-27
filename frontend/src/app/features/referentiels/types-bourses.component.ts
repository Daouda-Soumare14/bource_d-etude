import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeBourseService } from '../../core/services/referentiel.service';
import { ToastService } from '../../core/services/toast.service';
import { TypeBourse } from '../../core/models';

@Component({
  selector: 'app-types-bourses',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-slate-800">Types de bourses</h1>

      <form [formGroup]="form" (ngSubmit)="save()" class="card grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
        <input class="input" placeholder="Nom *" formControlName="nom" />
        <input type="number" class="input" placeholder="Montant *" formControlName="montant" />
        <input class="input md:col-span-1" placeholder="Description" formControlName="description" />
        <button class="btn-primary" [disabled]="form.invalid">{{ editId() ? 'Modifier' : 'Ajouter' }}</button>
      </form>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (t of items(); track t.id) {
          <div class="card p-5">
            <div class="text-lg font-semibold text-slate-800">{{ t.nom }}</div>
            <div class="mt-1 text-2xl font-bold text-dgbe-600">{{ +t.montant | number:'1.0-0' }} F</div>
            <p class="mt-2 text-sm text-slate-500">{{ t.description }}</p>
            <div class="mt-3 flex gap-3">
              <button class="text-xs text-dgbe-600 hover:underline" (click)="edit(t)">Modifier</button>
              <button class="text-xs text-red-600 hover:underline" (click)="remove(t.id)">Supprimer</button>
            </div>
          </div>
        } @empty { <div class="p-8 text-center text-slate-400">Aucun type.</div> }
      </div>
    </div>
  `,
})
export class TypesBoursesComponent {
  private fb = inject(FormBuilder);
  private service = inject(TypeBourseService);
  private toast = inject(ToastService);
  items = signal<TypeBourse[]>([]);
  editId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    montant: [0, Validators.required],
    description: [''],
  });

  constructor() { this.load(); }
  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  save(): void {
    if (this.form.invalid) return;
    const obs = this.editId() ? this.service.update(this.editId()!, this.form.getRawValue()) : this.service.create(this.form.getRawValue());
    obs.subscribe({ next: () => { this.toast.success('Enregistré.'); this.reset(); this.load(); }, error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.') });
  }

  edit(t: TypeBourse): void {
    this.editId.set(t.id);
    this.form.patchValue({ nom: t.nom, montant: +t.montant, description: t.description ?? '' });
  }

  remove(id: number): void {
    if (!confirm('Supprimer ?')) return;
    this.service.remove(id).subscribe({ next: () => { this.toast.info('Supprimé.'); this.load(); } });
  }

  reset(): void { this.editId.set(null); this.form.reset({ nom: '', montant: 0, description: '' }); }
}
