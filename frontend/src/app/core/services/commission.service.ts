import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { ApiResource, Commission } from '../models';

@Injectable({ providedIn: 'root' })
export class CommissionService extends CrudService<Commission> {
  protected resource = 'commissions';

  affecterMembres(id: number, membres: { utilisateur_id: number; role_membre?: string }[]): Observable<ApiResource<Commission>> {
    return this.http.post<ApiResource<Commission>>(`${this.url}/${id}/membres`, { membres });
  }
}
