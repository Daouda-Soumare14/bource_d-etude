import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Paiement } from '../models';

@Injectable({ providedIn: 'root' })
export class PaiementService extends CrudService<Paiement> {
  protected resource = 'paiements';
}
