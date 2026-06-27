import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { ToastService } from '../../core/services/toast.service';
import { Notification } from '../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="section-title">Notifications</h1>
          <p class="mt-1 text-sm text-slate-500">{{ nonLues() }} non lue(s)</p>
        </div>
        <button class="btn-outline text-sm" (click)="toutLu()">✓ Tout marquer comme lu</button>
      </div>

      <div class="space-y-3">
        @for (n of items(); track n.id) {
          <div class="card card-hover flex items-start gap-4 p-4" [ngClass]="{ 'ring-1 ring-dgbe-100': !n.lu }">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl" [ngClass]="bg(n.type)">{{ icon(n.type) }}</div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-900">{{ n.titre }}</span>
                @if (!n.lu) { <span class="h-2 w-2 rounded-full bg-dgbe-500"></span> }
              </div>
              <p class="mt-0.5 text-sm text-slate-600">{{ n.contenu }}</p>
              <p class="mt-1 text-xs text-slate-400">{{ n.created_at }}</p>
            </div>
            @if (!n.lu) { <button class="btn-ghost px-2 py-1 text-xs text-dgbe-600" (click)="lu(n)">Marquer lu</button> }
          </div>
        } @empty {
          <div class="card px-4 py-16 text-center">
            <div class="text-4xl">🔔</div>
            <p class="mt-2 font-medium text-slate-500">Aucune notification</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class NotificationsComponent {
  private service = inject(NotificationService);
  private toast = inject(ToastService);
  items = signal<Notification[]>([]);

  constructor() { this.load(); }
  load(): void { this.service.list().subscribe((r) => this.items.set(r.data)); }

  nonLues(): number { return this.items().filter((n) => !n.lu).length; }

  icon(type: string): string {
    return ({ demande_acceptee: '✅', demande_refusee: '❌', paiement: '💳', reclamation: '📨' } as Record<string, string>)[type] ?? '🔔';
  }
  bg(type: string): string {
    return ({
      demande_acceptee: 'bg-dgbe-50', demande_refusee: 'bg-red-50',
      paiement: 'bg-gold-50', reclamation: 'bg-blue-50',
    } as Record<string, string>)[type] ?? 'bg-slate-100';
  }

  lu(n: Notification): void {
    this.service.marquerLu(n.id).subscribe({ next: () => this.load() });
  }

  toutLu(): void {
    this.service.marquerToutLu().subscribe({ next: () => { this.toast.success('Toutes lues.'); this.load(); } });
  }
}
