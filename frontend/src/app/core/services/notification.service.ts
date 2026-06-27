import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResource, Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/notifications`;

  readonly nonLues = signal(0);

  list(): Observable<{ data: Notification[] }> {
    return this.http.get<{ data: Notification[] }>(this.url).pipe(
      tap((res) => this.nonLues.set(res.data.filter((n) => !n.lu).length)),
    );
  }

  marquerLu(id: number): Observable<ApiResource<Notification>> {
    return this.http.patch<ApiResource<Notification>>(`${this.url}/${id}/lu`, {});
  }

  marquerToutLu(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.url}/tout-lu`, {}).pipe(
      tap(() => this.nonLues.set(0)),
    );
  }
}
