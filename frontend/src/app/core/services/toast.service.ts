import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  success(message: string) { this.push('success', message); }
  error(message: string) { this.push('error', message); }
  info(message: string) { this.push('info', message); }

  private push(type: Toast['type'], message: string) {
    const id = ++this.seq;
    this.toasts.update((t) => [...t, { id, type, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
