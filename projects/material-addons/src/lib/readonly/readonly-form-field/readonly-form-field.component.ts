import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {NumberFormatService} from '../../numeric-field/number-format.service';

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
export class ReadOnlyFormFieldComponent implements OnChanges, AfterViewChecked {
  @ViewChild('contentWrapper', { static: false })
  originalContent: ElementRef;
  @Input('useProjectedContent') useProjectedContent: boolean = false;
  @Input('value') value?: any;
  @Input('label') label: string;
  @Input('textAlign') textAlign: 'right' | 'left' = 'left';
  @Input('formatNumber') formatNumber = false;
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'left';
  @Input('errorMessage') errorMessage: string | null = null;
  @Input() multiline = false;
  @Input() rows: number;
  @Input() id: string;
  /*
   * If shrinkIfEmpty is set to "false", nothing changes
   * If set to "true" and multiline is also "true", the textarea will
   * shrink to one row, if value is empty/null/undefined.
   * Otherwise, the defined rows-value will be used
   */
  @Input() shrinkIfEmpty = false;
  /**
   * suffix iocon
   */
  @Input() suffix: string;
  /**
   * prefix iocon
   */
  @Input() prefix: string;
  /**
   * if cdkTextareaAutosize is active for textareas
   */
  @Input() multilineAutoSize = false;
  @Output() suffixClickedEmitter = new EventEmitter();
  @Output() prefixClickedEmitter = new EventEmitter();
  @ViewChild('inputEl') inputEl: ElementRef;
  errorMatcher: ErrorStateMatcher = {
    isErrorState: () => !!this.errorMessage,
  };

  private unitSpan: HTMLSpanElement;
  private textSpan: HTMLSpanElement;

  toolTipForInputEnabled = false;
  toolTipText: string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    private numberFormatService: NumberFormatService,
    private elementRef: ElementRef,
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!NumberFormatService.valueIsSet(this.value)) {
      this.value = '-';
      if (this.shrinkIfEmpty) {
        this.rows = 1;
      }
    } else if (this.formatNumber && typeof this.value === 'number') {
      this.value = this.numberFormatService.format(this.value, {
        decimalPlaces: this.decimalPlaces,
        finalFormatting: true,
        autofillDecimals: this.autofillDecimals,
      });
    }
    this.changeDetector.detectChanges();
  }

  // TODO direct copy from NumericFieldDirective
  ngAfterViewChecked(): void {
    this.injectUnitSymbol();
    this.setReadonlyFieldStyle();
    this.setTooltipForOverflownField();
  }

  suffixClicked() {
    this.suffixClickedEmitter.emit(null);
  }

  prefixClicked() {
    this.prefixClickedEmitter.emit(null);
  }

  private injectUnitSymbol(): void {
    // Need to inject the unit symbol when the input element width is set to its actual value,
    // otherwise the icon wont show in the correct position
    if (!!this.unit && !this.unitSpan && this.inputEl.nativeElement.offsetWidth !== 0) {
      // Get the input wrapper and apply necessary styles
      const inputWrapper = this.inputEl.nativeElement.parentNode.parentNode;

      // Create the span with unit symbol and apply necessary styles
      this.unitSpan = this.renderer.createElement('span');

      if (this.unitPosition === 'left') {
        this.renderer.setAttribute(this.unitSpan, 'matPrefix', '');
        this.renderer.setStyle(this.unitSpan, 'padding-right', '5px');
        this.renderer.insertBefore(inputWrapper, this.unitSpan, inputWrapper.children[0]);
      } else {
        this.renderer.setAttribute(this.unitSpan, 'matSuffix', '');
        this.renderer.setStyle(this.unitSpan, 'padding-left', '25px');
        this.renderer.appendChild(inputWrapper, this.unitSpan);
      }
    }

    // special handling to move unit symbol along with display value
    if (!!this.unitSpan && this.textAlign === 'left' && this.unitPosition === 'right') {
      const inputStyles = window.getComputedStyle(this.inputEl.nativeElement.parentElement, null);
      this.unitSpan.style.position = 'absolute';
      this.unitSpan.style.marginTop = inputStyles.getPropertyValue('border-top-width');
      this.unitSpan.style.paddingTop = inputStyles.getPropertyValue('padding-top');
      this.unitSpan.style.paddingBottom = inputStyles.getPropertyValue('padding-bottom');

      if (!this.textSpan) {
        this.textSpan = document.createElement('span');
        document.body.appendChild(this.textSpan);
        this.textSpan.style.font = inputStyles.getPropertyValue('font');
        this.textSpan.style.fontSize = inputStyles.getPropertyValue('font-size');
        this.textSpan.style.height = 'auto';
        this.textSpan.style.width = 'auto';
        this.textSpan.style.position = 'absolute';
        this.textSpan.style.top = '0';
        this.textSpan.style.whiteSpace = 'no-wrap';
        this.textSpan.style.visibility = 'hidden';
      }
      this.textSpan.innerHTML = this.value;
      const width = Math.min(this.inputEl.nativeElement.clientWidth - this.unitSpan.clientWidth, Math.ceil(this.textSpan.clientWidth));
      this.unitSpan.style.left = width + 'px';
    }
    // always reset unit symbol
    if (!!this.unitSpan) {
      this.unitSpan.textContent = this.unit;
    }
  }

  private setReadonlyFieldStyle(): void {
    if (this.inputEl?.nativeElement) {
      const textOverFlowStyleValue = this.getTextOverFlowStyleValue();
      if (textOverFlowStyleValue) {
        this.inputEl.nativeElement.setAttribute('style', 'text-overflow: ' + textOverFlowStyleValue);
      }
    }
  }

  // Ellipsis is enabled by default as text-overflow behaviour
  private getTextOverFlowStyleValue(): string {
    // it works only if the style is added to the component directly. Should find a way for get it from the calculated
    // style. Than it would be possible to define the text-overflow in css for the whole application
    const textOverflow = this.elementRef?.nativeElement?.style.textOverflow;
    if (!textOverflow) {
      return 'ellipsis';
    }

    return textOverflow;
  }

  private setTooltipForOverflownField(): void {
    if (this.isEllipsisForTextOverflowEnabled()) {

      if (this.inputEl) {
        this.toolTipForInputEnabled = this.isTextOverflown(this.inputEl.nativeElement);
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
      return input.offsetWidth < input.scrollWidth;
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
