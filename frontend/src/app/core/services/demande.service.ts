import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { ApiResource, DemandeBourse, PieceJustificative } from '../models';

@Injectable({ providedIn: 'root' })
export class DemandeService extends CrudService<DemandeBourse> {
  protected resource = 'demandes';

  soumettre(id: number): Observable<ApiResource<DemandeBourse>> {
    return this.http.post<ApiResource<DemandeBourse>>(`${this.url}/${id}/soumettre`, {});
  }

  prendreEnCharge(id: number): Observable<ApiResource<DemandeBourse>> {
    return this.http.post<ApiResource<DemandeBourse>>(`${this.url}/${id}/prendre-en-charge`, {});
  }

  rejeter(id: number, motif?: string): Observable<ApiResource<DemandeBourse>> {
    return this.http.post<ApiResource<DemandeBourse>>(`${this.url}/${id}/rejeter`, { motif });
  }

  // --- Pièces justificatives ---
  uploadPiece(demandeId: number, nomDocument: string, fichier: File): Observable<ApiResource<PieceJustificative>> {
    const form = new FormData();
    form.append('demande_id', String(demandeId));
    form.append('nom_document', nomDocument);
    form.append('fichier', fichier);
    return this.http.post<ApiResource<PieceJustificative>>(`${this.base}/pieces`, form);
  }

  validerPiece(id: number): Observable<ApiResource<PieceJustificative>> {
    return this.http.patch<ApiResource<PieceJustificative>>(`${this.base}/pieces/${id}/valider`, {});
  }

  rejeterPiece(id: number, motif?: string): Observable<ApiResource<PieceJustificative>> {
    return this.http.patch<ApiResource<PieceJustificative>>(`${this.base}/pieces/${id}/rejeter`, { motif_rejet: motif });
  }

  supprimerPiece(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/pieces/${id}`);
  }
}
