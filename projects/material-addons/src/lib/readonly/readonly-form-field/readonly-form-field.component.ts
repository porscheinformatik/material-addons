import { Component, Input, ChangeDetectorRef, SimpleChanges, OnChanges, Renderer2, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
import { NumberFormatService } from '../../numeric-field/number-format.service';

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
  @Input('value') value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  @Input('label') label: string;
  @Input('textAlign') textAlign: 'right' | 'left' = 'right';
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'right';
  @ViewChild('inputEl') inputEl: ElementRef;
  private unitSpan: HTMLSpanElement;

  constructor(private changeDetector: ChangeDetectorRef, private renderer: Renderer2, private numberFormatService: NumberFormatService) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!NumberFormatService.valueIsSet(this.value)) {
      this.value = '-';
    } else if (typeof this.value === 'number') {
      this.value = this.numberFormatService.format(this.value, {
        decimalPlaces: this.decimalPlaces,
        finalFormatting: true,
        autofillDecimals: this.autofillDecimals
      });
    }
    this.changeDetector.detectChanges();
  }

  // TODO direct copy from NumericFieldDirective
  ngAfterViewChecked(): void {
    this.injectUnitSymbol();
  }

  private injectUnitSymbol(): void {
    // Need to inject the unit symbol when the input element width is set to its actual value,
    // otherwise the icon wont show in the correct position
    if (!!this.unit && !this.unitSpan && this.inputEl.nativeElement.offsetWidth !== 0) {
      // Get the input wrapper and apply necessary styles
      const inputWrapper = this.inputEl.nativeElement.parentNode.parentNode;
      // this.renderer.addClass(inputWrapper, 'numeric-input-wrapper');

      // Create the span with unit symbol and apply necessary styles
      if (!this.unitSpan) {
        this.unitSpan = this.renderer.createElement('span');
        this.renderer.addClass(this.unitSpan, 'unit');
        const unitSymbol = this.renderer.createText(this.unit);
        this.renderer.appendChild(this.unitSpan, unitSymbol);
        this.renderer.appendChild(inputWrapper, this.unitSpan);
      }

      if (this.unitPosition === 'left') {
        this.renderer.setAttribute(this.unitSpan, 'matPrefix', '');
        this.renderer.setStyle(this.unitSpan, 'padding-right', '5px');
      } else {
        this.renderer.setAttribute(this.unitSpan, 'matSuffix', '');
        this.renderer.setStyle(this.unitSpan, 'padding-left', '5px');
      }
    }
  }
}
