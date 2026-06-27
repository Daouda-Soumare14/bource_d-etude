import { Component, inject, signal } from '@angular/core';
import { EtudiantService } from '../../core/services/etudiant.service';
import { Etudiant } from '../../core/models';
import { AvatarComponent } from '../../shared/avatar/avatar.component';

@Component({
  selector: 'app-etudiants-list',
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <div class="space-y-5">
      <div>
        <h1 class="section-title">Étudiants</h1>
        <p class="mt-1 text-sm text-slate-500">{{ etudiants().length }} étudiant(s)</p>
      </div>

      <div class="card flex items-center gap-3 p-3">
        <div class="relative flex-1">
          <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input class="input pl-9" placeholder="Rechercher (matricule, région, niveau)…" (input)="onSearch($event)" />
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50/80">
              <tr>
                <th class="table-th">Étudiant</th>
                <th class="table-th">Matricule</th>
                <th class="table-th">Université</th>
                <th class="table-th">Filière</th>
                <th class="table-th">Niveau</th>
                <th class="table-th">Région</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (e of etudiants(); track e.id) {
                <tr class="transition hover:bg-dgbe-50/40">
                  <td class="table-td">
                    <div class="flex items-center gap-3">
                      <app-avatar [nom]="e.utilisateur?.nom_complet ?? '?'" [size]="36" />
                      <div>
                        <div class="font-semibold text-slate-800">{{ e.utilisateur?.nom_complet }}</div>
                        <div class="text-xs text-slate-400">{{ e.utilisateur?.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="table-td font-medium">{{ e.matricule }}</td>
                  <td class="table-td">{{ e.universite?.sigle ?? e.universite?.nom ?? '—' }}</td>
                  <td class="table-td">{{ e.filiere?.nom ?? '—' }}</td>
                  <td class="table-td">@if (e.niveau) { <span class="badge bg-slate-100 text-slate-600">{{ e.niveau }}</span> } @else { — }</td>
                  <td class="table-td">{{ e.region ?? '—' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="px-4 py-16 text-center">
                  <div class="text-4xl">🎓</div>
                  <p class="mt-2 font-medium text-slate-500">Aucun étudiant trouvé</p>
                </td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class EtudiantsListComponent {
  private service = inject(EtudiantService);
  etudiants = signal<Etudiant[]>([]);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() { this.load(); }

  load(search = ''): void {
    this.service.list({ search, per_page: 50 }).subscribe((r) => this.etudiants.set(r.data));
  }

  onSearch(e: Event): void {
    const v = (e.target as HTMLInputElement).value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.load(v), 350);
  }
}
