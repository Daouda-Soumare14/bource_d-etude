import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

type Accent = 'dgbe' | 'gold' | 'blue' | 'amber' | 'violet' | 'rose';

/** Carte indicateur (KPI) moderne : icône, libellé, valeur, sous-texte. */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="card card-hover relative overflow-hidden p-5">
      <div class="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10" [ngClass]="blob"></div>
      <div class="flex items-start justify-between">
        <div>
          <div class="text-sm font-medium text-slate-500">{{ label }}</div>
          <div class="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">{{ value }}</div>
          @if (hint) { <div class="mt-1 text-xs font-medium" [ngClass]="hintClass">{{ hint }}</div> }
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-soft" [ngClass]="iconBg">
          {{ icon }}
        </div>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '📊';
  @Input() hint = '';
  @Input() accent: Accent = 'dgbe';

  private bgMap: Record<Accent, string> = {
    dgbe: 'bg-dgbe-100 text-dgbe-700',
    gold: 'bg-gold-100 text-gold-600',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    violet: 'bg-violet-100 text-violet-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  private blobMap: Record<Accent, string> = {
    dgbe: 'bg-dgbe-500', gold: 'bg-gold-500', blue: 'bg-blue-500',
    amber: 'bg-amber-500', violet: 'bg-violet-500', rose: 'bg-rose-500',
  };

  get iconBg(): string { return this.bgMap[this.accent]; }
  get blob(): string { return this.blobMap[this.accent]; }
  get hintClass(): string { return 'text-dgbe-600'; }
}
