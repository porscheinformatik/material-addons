import { ChangeDetectorRef, Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { isObservable } from 'rxjs';

@Component({
  selector: 'app-text-code',
  imports: [],
  templateUrl: './text-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./text-code.component.scss'],
})
export class TextCodeComponent {
  objectForHTML = [];
  description = {};

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

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
        object[key].subscribe((value) => {
          this.objectForHTML.push({ key, type: `Observable<${typeof value}>` });
          this.changeDetectorRef.markForCheck();
        });
      } else {
        this.objectForHTML.push({ key, type: typeof object[key] });
      }
    }
  }
}
