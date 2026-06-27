import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { ApiResource, Reclamation } from '../models';

@Injectable({ providedIn: 'root' })
export class ReclamationService extends CrudService<Reclamation> {
  protected resource = 'reclamations';

  creerAvecDocument(payload: { objet: string; description: string; demande_id?: number; document?: File }): Observable<ApiResource<Reclamation>> {
    const form = new FormData();
    form.append('objet', payload.objet);
    form.append('description', payload.description);
    if (payload.demande_id) form.append('demande_id', String(payload.demande_id));
    if (payload.document) form.append('document', payload.document);
    return this.http.post<ApiResource<Reclamation>>(this.url, form);
  }

  repondre(id: number, reponse: string, statut?: string): Observable<ApiResource<Reclamation>> {
    return this.http.post<ApiResource<Reclamation>>(`${this.url}/${id}/repondre`, { reponse, statut });
  }
}
