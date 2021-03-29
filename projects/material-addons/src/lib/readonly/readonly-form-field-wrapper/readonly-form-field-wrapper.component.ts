import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

/**
 * Wraps a mat-form-field to replace it by a readOnly representation if necessary
 *
 * @author Stefan Laesser
 */
@Component({
  selector: 'mad-readonly-form-field-wrapper',
  templateUrl: './readonly-form-field-wrapper.component.html',
  styleUrls: ['./readonly-form-field-wrapper.component.css'],
})
export class ReadOnlyFormFieldWrapperComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * If set to "false", the contained mat-form-field is rendered in all it's glory.
   * If set to "true", a readonly representation of the value is shown using the mat-form-fields label.
   */
  @Input() readonly = true;

  /**
   * This input *MUST MATCH* the mat-form-field value to ensure correct data
   * binding and formatting of readOnly representation!
   */
  @Input('value') value: any;

  /**
   * Automatically taken from the contained <mat-label>
   */
  label: string;

  @ViewChild('contentWrapper', { static: false })
  originalContent: ElementRef;

  @Input('textAlign') textAlign: 'right' | 'left' = 'left';
  @Input('formatNumber') formatNumber = false;
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'left';
  @Input('errorMessage') errorMessage: string | null = null;

  /**
   * If set to "false", a readonly input will be rendered.
   * If set to "true", a readonly textarea will be rendered instead.
   */
  @Input() multiline = false;

  /**
   * Defines the rows for the readonly textarea.
   */
  @Input() rows = 3;

  /**
   * If shrinkIfEmpty is set to "false", nothing changes
   * If set to "true" and multiline is also "true", the textarea will
   * shrink to one row, if value is empty/null/undefined.
   * Otherwise, the defined rows-value will be used
   */
  @Input() shrinkIfEmpty: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.doRendering();
  }

  ngAfterViewInit(): void {
    this.doRendering();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.doRendering();
  }

  getLabel(): string {
    if (!this.label) {
      this.extractLabel();
    }
    return this.label;
  }

  private doRendering(): void {
    if (!this.originalContent) {
      return;
    }
    if (!this.readonly) {
      this.correctWidth();
      return;
    }

    this.changeDetector.detectChanges();
  }

  private extractLabel(): void {
    if (!this.originalContent || !this.originalContent.nativeElement) {
      return null;
    }
    const labelElement = this.originalContent.nativeElement.querySelector('mat-label');
    this.label = labelElement ? labelElement.innerHTML : 'mat-label is missing!';
  }

  private correctWidth(): void {
    const formField = this.originalContent.nativeElement.querySelector('mat-form-field');
    if (formField) {
      formField.setAttribute('style', 'width:100%');
    }
  }
}
