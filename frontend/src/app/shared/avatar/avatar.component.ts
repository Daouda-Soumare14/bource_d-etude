import { Component, Input, computed, signal } from '@angular/core';

/** Avatar à initiales avec dégradé déterministe (selon le nom). */
@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center justify-center rounded-full font-bold text-white shadow-soft ring-2 ring-white"
      [style.width.px]="size"
      [style.height.px]="size"
      [style.fontSize.px]="size * 0.4"
      [style.background]="gradient()"
    >{{ initiales() }}</span>
  `,
})
export class AvatarComponent {
  @Input() set nom(v: string) { this._nom.set(v ?? ''); }
  @Input() size = 36;

  private _nom = signal('');

  private palettes = [
    ['#1ab35f', '#0d723f'], ['#e0a82e', '#bd8420'], ['#3b82f6', '#1d4ed8'],
    ['#8b5cf6', '#6d28d9'], ['#f43f5e', '#be123c'], ['#06b6d4', '#0e7490'],
  ];

  initiales = computed(() => {
    const parts = this._nom().trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
  });

  gradient = computed(() => {
    const n = this._nom();
    let h = 0;
    for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) >>> 0;
    const [a, b] = this.palettes[h % this.palettes.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  });
}
