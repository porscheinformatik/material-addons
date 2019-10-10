import { Component, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';

/**
 * Read-only mat-form-field representation of provided value
 *
 * @author Stefan Laesser
 */

@Component({
  selector: 'mad-readonly-form-field',
  templateUrl: './readonly-form-field.component.html',
  styleUrls: ['./readonly-form-field.component.css']
})
export class ReadOnlyFormFieldComponent implements OnChanges {

  @Input()
  value: any;

  @Input()
  label: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.value || this.value.length === 0) {
      this.value = '-';
      this.changeDetector.detectChanges();
    }
  }
}
