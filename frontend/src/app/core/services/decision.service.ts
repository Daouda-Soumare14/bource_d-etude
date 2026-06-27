import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { Decision } from '../models';

@Injectable({ providedIn: 'root' })
export class DecisionService extends CrudService<Decision> {
  protected resource = 'decisions';
}
