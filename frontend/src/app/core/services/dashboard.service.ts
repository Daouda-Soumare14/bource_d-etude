import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResource, DashboardData } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  get(): Observable<ApiResource<DashboardData>> {
    return this.http.get<ApiResource<DashboardData>>(`${environment.apiUrl}/dashboard`);
  }
}
