import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'readonly-form-field-wrapper',
  templateUrl: './readonly-form-field-wrapper.component.html',
  styleUrls: ['./readonly-form-field-wrapper.component.scss']
})
export class ReadOnlyFormFieldWrapperComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  readonly = true;

  @Input()
  value: any;

  label: string;

  @ViewChild('contentWrapper', {static: false})
  originalContent: ElementRef;


  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.doRendering();
  }

  ngAfterViewInit(): void {
    this.doRendering();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.doRendering();
  }

  private doRendering() {
    if (this.originalContent && this.readonly) {
      const labelElement = this.originalContent.nativeElement.querySelector('mat-label');
      this.label = labelElement ? labelElement.innerHTML : 'mat-label is missing!';
      this.changeDetector.detectChanges();
    } else if (this.originalContent && !this.readonly) {
      const formField = this.originalContent.nativeElement.querySelector('mat-form-field');
      if (formField) {
        formField.setAttribute('style', 'width:inherit');
      }
    }
  }
}
