import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../../core/services/demande.service';
import { AnneeService, TypeBourseService } from '../../core/services/referentiel.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { AnneeAcademique, TypeBourse } from '../../core/models';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <div class="mx-auto max-w-xl space-y-4">
      <h1 class="text-2xl font-bold text-slate-800">Nouvelle demande de bourse</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="card space-y-4 p-6">
        <div>
          <label class="label">Année académique *</label>
          <select formControlName="annee_id" class="input">
            <option value="">— Choisir —</option>
            @for (a of annees(); track a.id) { <option [value]="a.id">{{ a.libelle }}{{ a.active ? ' (active)' : '' }}</option> }
          </select>
        </div>
        <div>
          <label class="label">Type de bourse *</label>
          <select formControlName="type_bourse_id" class="input" (change)="onType($event)">
            <option value="">— Choisir —</option>
            @for (t of types(); track t.id) { <option [value]="t.id">{{ t.nom }} ({{ +t.montant | number:'1.0-0' }} F)</option> }
          </select>
        </div>
        <div>
          <label class="label">Montant demandé (FCFA)</label>
          <input type="number" formControlName="montant_demande" class="input" />
        </div>
        <div>
          <label class="label">Observation</label>
          <textarea formControlName="observation" rows="3" class="input"></textarea>
        </div>

        <div class="flex gap-2">
          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Création…' : 'Créer (brouillon)' }}
          </button>
          <button type="button" class="btn-outline" (click)="router.navigate(['/app/demandes'])">Annuler</button>
        </div>
        <p class="text-xs text-slate-400">La demande est créée en brouillon. Ajoutez vos pièces puis soumettez-la depuis le détail.</p>
      </form>
    </div>
  `,
})
export class DemandeFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(DemandeService);
  private anneeService = inject(AnneeService);
  private typeService = inject(TypeBourseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  router = inject(Router);

  annees = signal<AnneeAcademique[]>([]);
  types = signal<TypeBourse[]>([]);
  loading = signal(false);

  form = this.fb.nonNullable.group({
    annee_id: ['', Validators.required],
    type_bourse_id: ['', Validators.required],
    montant_demande: [0],
    observation: [''],
  });

  constructor() {
    this.anneeService.list({ per_page: 50 }).subscribe((r) => {
      this.annees.set(r.data);
      const active = r.data.find((a) => a.active);
      if (active) this.form.patchValue({ annee_id: String(active.id) });
    });
    this.typeService.list({ per_page: 50 }).subscribe((r) => this.types.set(r.data));
  }

  onType(e: Event): void {
    const id = +(e.target as HTMLSelectElement).value;
    const t = this.types().find((x) => x.id === id);
    if (t) this.form.patchValue({ montant_demande: +t.montant });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const etudiantId = this.auth.currentUser()?.etudiant?.id;
    if (!etudiantId) { this.toast.error('Profil étudiant introuvable.'); return; }

    this.loading.set(true);
    this.service.create({ ...this.form.getRawValue(), etudiant_id: etudiantId }).subscribe({
      next: (res) => { this.toast.success('Demande créée.'); this.router.navigate(['/app/demandes', res.data.id]); },
      error: (e) => { this.loading.set(false); this.toast.error(e?.error?.message ?? 'Erreur.'); },
    });
  }
}
