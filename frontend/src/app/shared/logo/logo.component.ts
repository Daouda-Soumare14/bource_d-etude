import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Logo officiel DGBE — emblème (toque de diplômé sur écu) + signature textuelle.
 * @Input size : taille de l'emblème en px ; showText : affiche la signature.
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex items-center gap-3" [ngClass]="{ 'flex-col': vertical }">
      <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
        <defs>
          <linearGradient id="dgbeGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1ab35f" />
            <stop offset="1" stop-color="#0d4a2e" />
          </linearGradient>
        </defs>
        <!-- Écu -->
        <path d="M32 2 L58 11 V32 C58 48 47 57 32 62 C17 57 6 48 6 32 V11 Z" fill="url(#dgbeGrad)" />
        <path d="M32 2 L58 11 V32 C58 48 47 57 32 62 C17 57 6 48 6 32 V11 Z" stroke="#f5c542" stroke-width="1.5" />
        <!-- Toque de diplômé -->
        <path d="M32 18 L48 25 L32 32 L16 25 Z" fill="#fff" />
        <path d="M22 28 V37 C22 40 42 40 42 37 V28" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" />
        <!-- Gland -->
        <path d="M48 25 V36" stroke="#f5c542" stroke-width="2" stroke-linecap="round" />
        <circle cx="48" cy="38" r="2.4" fill="#f5c542" />
      </svg>

      @if (showText) {
        <div [ngClass]="{ 'text-center': vertical }">
          <div class="text-xl font-extrabold leading-none tracking-tight" [ngClass]="light ? 'text-white' : 'text-dgbe-800'">
            DGBE
          </div>
          <div class="text-[10px] font-medium uppercase tracking-wider" [ngClass]="light ? 'text-dgbe-100' : 'text-slate-500'">
            Bourses Étudiantes
          </div>
        </div>
      }
    </div>
  `,
})
export class LogoComponent {
  @Input() size = 40;
  @Input() showText = true;
  @Input() light = false;
  @Input() vertical = false;
}
