import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';
import { AnneeAcademique, Faculte, Filiere, TypeBourse, Universite } from '../models';

@Injectable({ providedIn: 'root' })
export class UniversiteService extends CrudService<Universite> {
  protected resource = 'universites';
}

@Injectable({ providedIn: 'root' })
export class FaculteService extends CrudService<Faculte> {
  protected resource = 'facultes';
}

@Injectable({ providedIn: 'root' })
export class FiliereService extends CrudService<Filiere> {
  protected resource = 'filieres';
}

@Injectable({ providedIn: 'root' })
export class AnneeService extends CrudService<AnneeAcademique> {
  protected resource = 'annees';

  activer(id: number) {
    return this.http.patch(`${this.url}/${id}/activer`, {});
  }
}

@Injectable({ providedIn: 'root' })
export class TypeBourseService extends CrudService<TypeBourse> {
  protected resource = 'types-bourses';
}
