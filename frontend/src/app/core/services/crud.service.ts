import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResource, Paginated } from '../models';

/**
 * Service CRUD générique réutilisable pour toute ressource de l'API REST.
 */
export abstract class CrudService<T> {
  protected http = inject(HttpClient);
  protected base = environment.apiUrl;
  protected abstract resource: string;

  protected get url(): string {
    return `${this.base}/${this.resource}`;
  }

  list(params: Record<string, string | number | undefined> = {}): Observable<Paginated<T>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        httpParams = httpParams.set(k, String(v));
      }
    });
    return this.http.get<Paginated<T>>(this.url, { params: httpParams });
  }

  get(id: number): Observable<ApiResource<T>> {
    return this.http.get<ApiResource<T>>(`${this.url}/${id}`);
  }

  create(payload: unknown): Observable<ApiResource<T>> {
    return this.http.post<ApiResource<T>>(this.url, payload);
  }

  update(id: number, payload: unknown): Observable<ApiResource<T>> {
    return this.http.put<ApiResource<T>>(`${this.url}/${id}`, payload);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
