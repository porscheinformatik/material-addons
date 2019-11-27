import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  hasPermission(): Observable<boolean> {
    return of(true);
  }
}
