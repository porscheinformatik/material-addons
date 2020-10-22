import { Component, Input } from '@angular/core';
import { isObservable } from 'rxjs';

@Component({
  selector: 'app-text-code',
  templateUrl: './text-code.component.html',
  styleUrls: ['./text-code.component.scss'],
})
export class TextCodeComponent {
  objectForHTML = [];
  description = {};
  @Input() set objectToRender(object: any) {
    this.prepareObject(object);
  }
  @Input() set descriptionForObject(descriptionForObject: any) {
    this.description = descriptionForObject;
  }
  getDescription(key: string): string {
    if (this.description[key]) {
      return ` // ${this.description[key].description}${!!this.description[key].optional ? ' (optional)' : ''}`;
    }
    return '';
  }
  private prepareObject(object: any): void {
    for (const key of Object.keys(object)) {
      if (isObservable(object[key])) {
        object[key].subscribe(value => {
          this.objectForHTML.push({ key, type: `Observable<${typeof value}>` });
        });
      } else {
        this.objectForHTML.push({ key, type: typeof object[key] });
      }
    }
  }
}
