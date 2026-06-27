import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from './crud.service';
import { Role, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService extends CrudService<User> {
  protected resource = 'users';

  roles(): Observable<{ data: Role[] }> {
    return this.http.get<{ data: Role[] }>(`${this.base}/roles`);
  }
}
