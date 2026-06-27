import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { Role, User } from '../../core/models';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [ReactiveFormsModule, AvatarComponent],
  template: `
    <div class="space-y-5">
      <div>
        <h1 class="section-title">Utilisateurs</h1>
        <p class="mt-1 text-sm text-slate-500">{{ items().length }} compte(s)</p>
      </div>

      <!-- Formulaire de création -->
      <div class="card p-5">
        <h2 class="mb-4 flex items-center gap-2 font-semibold text-slate-800">➕ Nouvel utilisateur</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input class="input" placeholder="Prénom *" formControlName="prenom" />
          <input class="input" placeholder="Nom *" formControlName="nom" />
          <input class="input" type="email" placeholder="Email *" formControlName="email" />
          <input class="input" placeholder="Téléphone" formControlName="telephone" />
          <select class="input" formControlName="role">
            <option value="">— Rôle —</option>
            @for (r of roles(); track r) { <option [value]="r">{{ r }}</option> }
          </select>
          <div></div>
          <input class="input" type="password" placeholder="Mot de passe *" formControlName="password" />
          <input class="input" type="password" placeholder="Confirmation *" formControlName="password_confirmation" />
          <button class="btn-primary" [disabled]="form.invalid">Créer l'utilisateur</button>
        </form>
      </div>

      <!-- Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/80"><tr>
              <th class="table-th">Utilisateur</th><th class="table-th">Téléphone</th><th class="table-th">Rôles</th><th class="table-th">Statut</th><th class="table-th"></th>
            </tr></thead>
            <tbody class="divide-y divide-slate-50">
              @for (u of items(); track u.id) {
                <tr class="transition hover:bg-dgbe-50/40">
                  <td class="table-td">
                    <div class="flex items-center gap-3">
                      <app-avatar [nom]="u.nom_complet" [size]="36" />
                      <div>
                        <div class="font-semibold text-slate-800">{{ u.nom_complet }}</div>
                        <div class="text-xs text-slate-400">{{ u.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="table-td">{{ u.telephone ?? '—' }}</td>
                  <td class="table-td">
                    @for (r of u.roles ?? []; track r) { <span class="badge bg-dgbe-50 text-dgbe-700 ring-dgbe-100">{{ r }}</span> }
                  </td>
                  <td class="table-td">
                    <span class="badge" [class]="u.actif ? 'bg-dgbe-50 text-dgbe-700 ring-dgbe-100' : 'bg-red-50 text-red-700 ring-red-100'">
                      <span class="h-1.5 w-1.5 rounded-full" [class]="u.actif ? 'bg-dgbe-500' : 'bg-red-500'"></span>
                      {{ u.actif ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="table-td text-right">
                    <button class="btn-ghost px-2 py-1 text-xs text-red-600 hover:bg-red-50" (click)="remove(u.id)">Supprimer</button>
                  </td>
                </tr>
              } @empty { <tr><td colspan="5" class="px-4 py-16 text-center text-slate-400">Aucun utilisateur.</td></tr> }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class UtilisateursComponent {
  private fb = inject(FormBuilder);
  private service = inject(UserService);
  private toast = inject(ToastService);

  items = signal<User[]>([]);
  roles = signal<Role[]>([]);

  form = this.fb.nonNullable.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    role: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  });

  constructor() {
    this.load();
    this.service.roles().subscribe((r) => this.roles.set(r.data));
  }

  load(): void { this.service.list({ per_page: 100 }).subscribe((r) => this.items.set(r.data)); }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const payload = { ...v, roles: v.role ? [v.role] : [] };
    this.service.create(payload).subscribe({
      next: () => { this.toast.success('Utilisateur créé.'); this.form.reset(); this.load(); },
      error: (e) => this.toast.error(e?.error?.message ?? 'Erreur.'),
    });
  }

  remove(id: number): void {
    if (!confirm('Supprimer cet utilisateur ?')) return;
    this.service.remove(id).subscribe({ next: () => { this.toast.info('Supprimé.'); this.load(); } });
  }
}
