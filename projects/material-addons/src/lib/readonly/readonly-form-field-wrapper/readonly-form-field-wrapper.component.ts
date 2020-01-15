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

/**
 * Wraps a mat-form-field to replace it by a readOnly representation if necessary
 *
 * @author Stefan Laesser
 */
@Component({
  selector: 'mad-readonly-form-field-wrapper',
  templateUrl: './readonly-form-field-wrapper.component.html',
  styleUrls: ['./readonly-form-field-wrapper.component.css']
})
export class ReadOnlyFormFieldWrapperComponent implements OnInit, AfterViewInit, OnChanges {

  /**
   * If set to "false", the contained mat-form-field is rendered in all it's glory.
   * If set to "true", a readonly representation of the value is shown using the mat-form-fields label.
   */
  @Input()
  readonly = true;

  /**
   * This input *MUST MATCH* the mat-form-field value to ensure correct data
   * binding and formatting of readOnly representation!
   */
  @Input()
  value: any;

  /**
   * Automatically taken from the contained <mat-label>
   */
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
    if (!this.originalContent) {
      return;
    }
    if (!this.readonly) {
      this.correctWidth();
      return;
    }

    this.setLabel();

    // TODO remove. Does not work 100% with data binding when values are changed/deleted after rendering
    // if (!this.value) {
    //   this.tryToExtractValue();
    // }
    this.changeDetector.detectChanges();
  }

  private setLabel() {
    const labelElement = this.originalContent.nativeElement.querySelector('mat-label');
    this.label = labelElement ? labelElement.innerHTML : 'mat-label is missing!';
  }

  private correctWidth() {
    const formField = this.originalContent.nativeElement.querySelector('mat-form-field');
    if (formField) {
      formField.setAttribute('style', 'width:100%');
    }
  }

  // private tryToExtractValue() {
  //   const input = this.originalContent.nativeElement.querySelector('input');
  //   if (input) {
  //     this.value = input.getAttribute('ng-reflect-model');
  //   }
  //   const select = this.originalContent.nativeElement.querySelector('mat-select');
  //   if (select) {
  //     this.value = select.getAttribute('ng-reflect-value');
  //   }
  // }
}
