import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { AuthModalComponent } from './shared/auth-modal/auth-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, AuthModalComponent],
  template: `
    <router-outlet />
    <app-auth-modal />
    <app-toast />
  `,
})
export class AppComponent {}
