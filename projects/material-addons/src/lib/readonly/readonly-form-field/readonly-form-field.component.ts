import { Component, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';

/**
 * Read-only mat-form-field representation of provided value
 *
 * @author Stefan Laesser
 */

@Component({
  selector: 'mad-readonly-form-field',
  templateUrl: './readonly-form-field.component.html',
  styleUrls: ['./readonly-form-field.component.css'],
})
export class ReadOnlyFormFieldComponent implements OnChanges {
  @Input()
  value: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  @Input()
  label: string;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnChanges(_: SimpleChanges): void {
    if (this.checkForValue()) {
      this.value = '-';
      this.changeDetector.detectChanges();
    }
  }
  checkForValue(): boolean {
    return typeof this.value === 'undefined' || this.value === null || this.value.length === 0;
  }
}
