import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversiteService } from '../../core/services/referentiel.service';
import { ToastService } from '../../core/services/toast.service';
import { Universite } from '../../core/models';

@Component({
  selector: 'app-universites',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-slate-800">Universités &amp; établissements</h1>

      <form [formGroup]="form" (ngSubmit)="save()" class="card grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
        <input class="input" placeholder="Nom *" formControlName="nom" />
        <input class="input" placeholder="Sigle" formControlName="sigle" />
        <input class="input" placeholder="Région" formControlName="region" />
        <button class="btn-primary" [disabled]="form.invalid">{{ editId() ? 'Modifier' : 'Ajouter' }}</button>
      </form>

      <div class="card overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr><th class="table-th">Nom</th><th class="table-th">Sigle</th><th class="table-th">Région</th><th class="table-th">Facultés</th><th class="table-th"></th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (u of items(); track u.id) {
              <tr class="hover:bg-slate-50">
                <td class="table-td font-medium">{{ u.nom }}</td>
                <td class="table-td">{{ u.sigle }}</td>
                <td class="table-td">{{ u.region }}</td>
                <td class="table-td">{{ u.facultes?.length ?? u.facultes_count ?? 0 }}</td>
                <td class="table-td text-right">
                  <button class="text-xs text-dgbe-600 hover:underline" (click)="edit(u)">Modifier</button>
                  <button class="ml-3 text-xs text-red-600 hover:underline" (click)="remove(u.id)">Supprimer</button>
                </td>
              </tr>
            } @empty { <tr><td colspan="5" class="py-8 text-center text-slate-400">Aucune université.</td></tr> }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class UniversitesComponent {
  private fb = inject(FormBuilder);
  private service = inject(UniversiteService);
  private toast = inject(ToastService);

  items = signal<Universite[]>([]);
  editId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    sigle: [''],
    region: [''],
  });

  constructor() { this.load(); }
  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  save(): void {
    if (this.form.invalid) return;
    const obs = this.editId()
      ? this.service.update(this.editId()!, this.form.getRawValue())
      : this.service.create(this.form.getRawValue());
    obs.subscribe({
      next: () => { this.toast.success('Enregistré.'); this.reset(); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  edit(u: Universite): void {
    this.editId.set(u.id);
    this.form.patchValue({ nom: u.nom, sigle: u.sigle ?? '', region: u.region ?? '' });
  }

  remove(id: number): void {
    if (!confirm('Supprimer cette université ?')) return;
    this.service.remove(id).subscribe({ next: () => { this.toast.info('Supprimée.'); this.load(); } });
  }

  reset(): void { this.editId.set(null); this.form.reset({ nom: '', sigle: '', region: '' }); }
}
