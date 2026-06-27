import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (t of toast.toasts(); track t.id) {
        <div
          class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg"
          [class]="bg(t.type)"
          (click)="toast.dismiss(t.id)"
        >
          <span>{{ icon(t.type) }}</span>
          <span>{{ t.message }}</span>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toast = inject(ToastService);

  bg(type: string): string {
    return { success: 'bg-dgbe-600', error: 'bg-red-600', info: 'bg-slate-800' }[type] ?? 'bg-slate-800';
  }
  icon(type: string): string {
    return { success: '✓', error: '✕', info: 'ℹ' }[type] ?? 'ℹ';
  }
}
