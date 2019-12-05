import {Component, Input} from '@angular/core';
import {isObservable} from "rxjs";

@Component({
  selector: 'app-text-code',
  templateUrl: './text-code.component.html',
  styleUrls: ['./text-code.component.scss']
})
export class TextCodeComponent {
  objectForHTML = [];
  _descriptionForObject = {};
  @Input() set objectToRender(object: any) {
    this.prepareObject(object);
  };
  @Input() set descriptionForObject(descriptionForObject: any) {
    this._descriptionForObject = descriptionForObject;
  };
  constructor() { }

  private prepareObject(object: any) {
    for (let key of Object.keys(object)) {
      if(isObservable(object[key])) {
        object[key].subscribe((value) => {
          this.objectForHTML.push({key, type: `Observable<${typeof value}>`});
        });
      } else {
        this.objectForHTML.push({key, type: typeof(object[key])});
      }
    }
  }

  getDescription(key) {
    if(this._descriptionForObject[key]) {
      return ` // ${this._descriptionForObject[key].description}${!!(this._descriptionForObject[key].optional) ? ' (optional)' : ''}`;
    }
    return '';
  }
}
