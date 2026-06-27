import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResource, AuthResponse, Role, User } from '../models';

const TOKEN_KEY = 'dgbe_token';
const USER_KEY = 'dgbe_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // État réactif (signals)
  readonly currentUser = signal<User | null>(this.loadUser());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly roles = computed<Role[]>(() => this.currentUser()?.roles ?? []);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  hasRole(...roles: Role[]): boolean {
    const userRoles = this.roles();
    return roles.some((r) => userRoles.includes(r));
  }

  hasPermission(permission: string): boolean {
    return this.currentUser()?.permissions?.includes(permission) ?? false;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/auth/login`, { email, password }).pipe(
      tap((res) => this.persist(res.token, res.data)),
    );
  }

  register(payload: Record<string, unknown>): Observable<ApiResource<User>> {
    return this.http.post<ApiResource<User>>(`${this.api}/auth/register`, payload);
  }

  /** Rafraîchit le profil + permissions depuis le serveur. */
  refreshProfile(): Observable<ApiResource<User>> {
    return this.http.get<ApiResource<User>>(`${this.api}/auth/me`).pipe(
      tap((res) => {
        this.currentUser.set(res.data);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      }),
    );
  }

  logout(): void {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe({ complete: () => {}, error: () => {} });
    this.clear();
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/auth/forgot-password`, { email });
  }

  private persist(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
