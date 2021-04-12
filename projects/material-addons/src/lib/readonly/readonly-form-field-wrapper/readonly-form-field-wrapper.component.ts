import {
  AfterViewChecked,
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
  styleUrls: ['./readonly-form-field-wrapper.component.css'],
})
export class ReadOnlyFormFieldWrapperComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
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

  @ViewChild('contentWrapper', {static: false})
  originalContent: ElementRef;
  @ViewChild('readOnlyContentWrapper', {static: false})
  readOnlyContentWrapper: ElementRef;

  @Input('textAlign') textAlign: 'right' | 'left' = 'left';
  @Input('formatNumber') formatNumber = false;
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'left';
  @Input('errorMessage') errorMessage: string | null = null;
  @Input() id: string;

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

  toolTipForInputEnabled = false;
  toolTipText: string;

  constructor(private changeDetector: ChangeDetectorRef, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.doRendering();
  }

  ngAfterViewInit(): void {
    this.setReadonlyFieldStyle();
    this.doRendering();
  }

  ngAfterViewChecked(): void {
    this.setReadonlyFieldStyle();
    this.setTooltipForOverflownField();
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

  private setReadonlyFieldStyle(): void {
    const input = this.readOnlyContentWrapper?.nativeElement?.querySelector('input');

    if (input) {
      let textOverFlowStyleValue = this.getTextOverFlowStyleValue();
      if (textOverFlowStyleValue) {
        input.setAttribute('style', 'text-overflow: ' + textOverFlowStyleValue);
      }
    }
  }

  // Ellipsis is enabled by default as text-overflow behaviour
  private getTextOverFlowStyleValue(): string {
    // it works only if the style is added to the component directly. Should find a way for get it from the calculated
    // style. Than it would be possible to define the text-overflow in css for the whole application
    let textOverflow = this.elementRef?.nativeElement?.style.textOverflow;
    if (!textOverflow) {
      return 'ellipsis';
    }

    return textOverflow;
  }

  private setTooltipForOverflownField() {
    if (this.isEllipsisForTextOverflowEnabled()) {
      const input = this.readOnlyContentWrapper?.nativeElement?.querySelector('input');

      if (input) {
        this.toolTipForInputEnabled = this.isTextOverflown(input);
        if (this.toolTipForInputEnabled) {
          this.toolTipText = this.calculateToolTipText();
        }
        this.changeDetector.detectChanges();
      }
    }
  }

  private isEllipsisForTextOverflowEnabled(): boolean {
    return this.getTextOverFlowStyleValue() === 'ellipsis';
  }

  private isTextOverflown(input: any): boolean {
    if (input) {
      return (input.offsetWidth < input.scrollWidth);
    }
    return false;
  }

  private calculateToolTipText(): string {
    if (!this.unit) {
      return this.value;
    }

    return this.unitPosition === 'left' ? this.unit + ' ' + this.value : this.value + ' ' + this.unit;
  }
}
