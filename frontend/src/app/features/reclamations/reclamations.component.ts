import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReclamationService } from '../../core/services/reclamation.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Reclamation } from '../../core/models';
import { StatutBadgeComponent } from '../../shared/statut-badge/statut-badge.component';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-reclamations',
  standalone: true,
  imports: [ReactiveFormsModule, StatutBadgeComponent, AvatarComponent],
  template: `
    <div class="space-y-6">
      <h1 class="section-title">Réclamations</h1>

      @if (estEtudiant()) {
        <div class="card p-5">
          <h2 class="mb-4 flex items-center gap-2 font-semibold text-slate-800">✍️ Nouvelle réclamation</h2>
          <form [formGroup]="form" (ngSubmit)="envoyer()" class="space-y-3">
            <input class="input" placeholder="Objet *" formControlName="objet" />
            <textarea class="input" rows="3" placeholder="Décrivez votre réclamation *" formControlName="description"></textarea>
            <button class="btn-primary" [disabled]="form.invalid">Envoyer la réclamation</button>
          </form>
        </div>
      }

      <div class="grid grid-cols-1 gap-4">
        @for (r of items(); track r.id) {
          <div class="card card-hover p-5">
            <div class="flex items-start gap-4">
              @if (!estEtudiant()) { <app-avatar [nom]="r.etudiant?.utilisateur?.nom_complet ?? '?'" [size]="40" /> }
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h3 class="font-bold text-slate-900">{{ r.objet }}</h3>
                  <app-statut-badge [statut]="r.statut" />
                </div>
                @if (!estEtudiant()) { <div class="text-xs text-slate-400">{{ r.etudiant?.utilisateur?.nom_complet }} · {{ r.created_at }}</div> }
                <p class="mt-2 text-sm text-slate-600">{{ r.description }}</p>

                @if (r.reponse) {
                  <div class="mt-3 rounded-xl border border-dgbe-100 bg-dgbe-50 p-3">
                    <div class="text-xs font-semibold text-dgbe-700">Réponse de l'administration</div>
                    <p class="mt-1 text-sm text-dgbe-900">{{ r.reponse }}</p>
                  </div>
                }
                @if (peutRepondre() && r.statut !== 'Traitée' && r.statut !== 'Fermée') {
                  <button class="btn-outline mt-3 px-3 py-1.5 text-xs" (click)="repondre(r)">↩ Répondre</button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="card px-4 py-16 text-center">
            <div class="text-4xl">📨</div>
            <p class="mt-2 font-medium text-slate-500">Aucune réclamation</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ReclamationsComponent {
  private fb = inject(FormBuilder);
  private service = inject(ReclamationService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  items = signal<Reclamation[]>([]);
  estEtudiant = computed(() => this.auth.hasRole('etudiant'));
  peutRepondre = computed(() => this.auth.hasPermission('gerer-reclamations'));

  form = this.fb.nonNullable.group({
    objet: ['', Validators.required],
    description: ['', Validators.required],
  });

  constructor() { this.load(); }
  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  envoyer(): void {
    if (this.form.invalid) return;
    this.service.create(this.form.getRawValue()).subscribe({
      next: () => { this.toast.success('Réclamation envoyée.'); this.form.reset({ objet: '', description: '' }); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  repondre(r: Reclamation): void {
    const reponse = prompt('Votre réponse :');
    if (!reponse) return;
    this.service.repondre(r.id, reponse, 'Traitée').subscribe({
      next: () => { this.toast.success('Réponse envoyée.'); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }
}
