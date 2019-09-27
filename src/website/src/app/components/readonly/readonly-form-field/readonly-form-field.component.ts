import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'readonly-form-field',
  templateUrl: './readonly-form-field.component.html',
  styleUrls: ['./readonly-form-field.component.scss']
})
export class ReadOnlyFormFieldComponent implements OnChanges {

  @Input()
  value: any;

  @Input()
  label: string;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.value || this.value.length === 0) {
      this.value = '-';
      this.changeDetector.detectChanges();
    }
  }

}
