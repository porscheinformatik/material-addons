import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavEntryService {
  getMarginLeft(subLevel: number, size: number): Object {
    let calcSize = subLevel * size;
    return { 'margin-left': calcSize + 'px' };
  }
}
