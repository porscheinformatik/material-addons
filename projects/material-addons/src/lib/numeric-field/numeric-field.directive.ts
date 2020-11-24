/*
 * Copyright (c) 2018-2020 Porsche Informatik. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewChecked,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberFormatService } from './number-format.service';

const BACK_KEYCODE = 8;
const SPACE_KEYCODE = 32;
const DEL_KEYCODE = 46;
const CONTROL_KEYCODES_UPPER_BORDER = 46;
const OTHER_CONTROL_KEYS = new Set([224, 91, 93]);

@Directive({
  selector: '[madNumericField]',
  host: {
    '[class.text-right]': 'textAlign === "right"',
    '(change)': 'onChange(getValueForFormControl())',
    '(input)': 'onChange(getValueForFormControl())',
    '(blur)': 'onTouched()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericFieldDirective), // eslint-disable-line
      multi: true,
    },
  ],
})
export class NumericFieldDirective implements OnInit, OnDestroy, AfterViewChecked, ControlValueAccessor {
  @Input('textAlign') textAlign: 'right' | 'left' = 'right';
  @Input('decimalPlaces') decimalPlaces = 2;
  @Input('roundDisplayValue') roundValue = false;
  @Input('autofillDecimals') autofillDecimals = false;
  @Input('unit') unit: string | null = null;
  @Input('unitPosition') unitPosition: 'right' | 'left' = 'right';
  @Output('numericValueChange') numericValueChanged = new EventEmitter<number>();

  private displayValue = '';
  private originalValue = NaN;
  private _numericValue: number;
  private inputChangeListener: () => void;
  private keyupListener: () => void;
  private keydownListener: () => void;

  @Input('numericValue')
  set numericValue(value: number) {
    if (this._numericValue !== value && !(isNaN(this._numericValue) && (isNaN(value) || value === null))) {
      this.originalValue = value;
      this._numericValue = this.roundOrTruncate(value);
      this.handleInputChanged();
    }
  }

  private unitSpan: HTMLSpanElement;
  private textSpan: HTMLSpanElement;

  constructor(private renderer: Renderer2, private inputEl: ElementRef, private numberFormatService: NumberFormatService) {}

  /* Control Values Accessor Stuff below */
  // eslint-disable-next-line
  onChange: any = () => {};
  // eslint-disable-next-line
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // Dont need to implement since its just a directive
  }

  writeValue(value: number): void {
    this.numericValue = value;
  }

  ngOnInit(): void {
    /* needs to be parsed as number explicitly as it comes as string from user input */
    this.decimalPlaces = parseInt(this.decimalPlaces.toString(), 10);

    this.inputChangeListener = this.renderer.listen(this.inputEl.nativeElement, 'blur', event => {
      this.formatInput(event.target, true);
    });

    this.keyupListener = this.renderer.listen(this.inputEl.nativeElement, 'keyup', event => {
      if (event.keyCode === BACK_KEYCODE || (event.keyCode >= CONTROL_KEYCODES_UPPER_BORDER && !OTHER_CONTROL_KEYS.has(event.keyCode))) {
        this.formatInput(event.target, false);
      }
    });

    this.keydownListener = this.renderer.listen(this.inputEl.nativeElement, 'keydown', event => {
      const value: string = event.target.value;
      if (
        this.numberFormatService.allowedKeys.includes(event.key) ||
        (event.keyCode <= CONTROL_KEYCODES_UPPER_BORDER && event.keyCode > 0 && event.keyCode !== SPACE_KEYCODE) ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        /* allow negative sign only as first character and none exists outside of text selection */
        const indexNegativeSign = value.indexOf(NumberFormatService.NEGATIVE);
        if (
          event.key === NumberFormatService.NEGATIVE &&
          (event.target.selectionStart > 0 || indexNegativeSign > -1) &&
          (event.target.selectionStart === event.target.selectionEnd ||
            !(indexNegativeSign >= event.target.selectionStart && indexNegativeSign <= event.target.selectionEnd))
        ) {
          return false;
        }

        /* no duplicate decimal separators */
        const indexDecimalSep = value.indexOf(this.numberFormatService.decimalSeparator);
        if (
          event.key === this.numberFormatService.decimalSeparator &&
          (indexDecimalSep > -1 || this.decimalPlaces === 0) &&
          (event.target.selectionStart === event.target.selectionEnd ||
            !(indexDecimalSep >= event.target.selectionStart && indexDecimalSep <= event.target.selectionEnd))
        ) {
          return false;
        }

        /* prevent too many decimal places */
        if (
          NumberFormatService.NUMBERS.includes(event.key) &&
          indexDecimalSep > -1 &&
          indexDecimalSep < event.target.selectionStart &&
          event.target.selectionStart === event.target.selectionEnd &&
          value.length > indexDecimalSep + this.decimalPlaces
        ) {
          return false;
        }

        /* when deleting thousand separator, remove the digit before or after it */
        const cursorStart = event.target.selectionStart;

        if (cursorStart === event.target.selectionEnd) {
          if (event.keyCode === BACK_KEYCODE && value.substr(cursorStart - 1, 1) === this.numberFormatService.groupingSeparator) {
            event.target.value = value.substring(0, cursorStart - 2) + value.substring(cursorStart - 1, value.length);
            event.target.selectionStart = event.target.selectionEnd = cursorStart - 1;
            return false;
          } else if (event.keyCode === DEL_KEYCODE && value.substr(cursorStart, 1) === this.numberFormatService.groupingSeparator) {
            event.target.value = value.substring(0, cursorStart + 1) + value.substring(cursorStart + 2, value.length);
            event.target.selectionStart = event.target.selectionEnd = cursorStart + 1;
            return false;
          }
        }
        this.originalValue = NaN;
      } else {
        return false;
      }
      return true;
    });
  }

  ngOnDestroy(): void {
    this.detachListener();
  }

  ngAfterViewChecked(): void {
    this.injectUnitSymbol();
  }

  handleInputChanged(): void {
    // Call in set timeout to avoid Expression has changed after it has been checked error.
    // Sometimes the value changes because we cut off decimal places
    setTimeout(() => {
      this.updateInput(
        this.numberFormatService.format(this._numericValue, {
          decimalPlaces: this.decimalPlaces,
          finalFormatting: false,
          autofillDecimals: this.autofillDecimals,
        }),
      );
    }, 1);
  }

  formatInput(element: HTMLInputElement, finalFormatting: boolean): void {
    const cursorPos = element.selectionStart;
    const length = element.value.length;
    const setCursor = this.displayValue !== element.value;
    const textFormatted = this.numberFormatService.formatNumber(element.value, {
      decimalPlaces: this.decimalPlaces,
      finalFormatting,
      autofillDecimals: this.autofillDecimals,
    });

    // special handling to move unit symbol along with display value
    if (this.textAlign === 'left' && this.unitPosition === 'right') {
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
      this.textSpan.innerHTML = textFormatted;
      const width = Math.min(this.inputEl.nativeElement.clientWidth - this.unitSpan.clientWidth, Math.ceil(this.textSpan.clientWidth));
      this.unitSpan.style.left = width + 'px';
    }

    this.updateInput(textFormatted);
    if (setCursor) {
      element.selectionStart = element.selectionEnd = Math.max(cursorPos + element.value.length - length, 0);
    }
  }

  updateInput(value: string): void {
    this.displayValue = value;
    this.inputEl.nativeElement.value = value;
    this._numericValue = parseFloat(
      this.numberFormatService.strip(value, { decimalPlaces: this.decimalPlaces }).replace(this.numberFormatService.decimalSeparator, '.'),
    );
    if (this._numericValue !== this.roundOrTruncate(this.originalValue)) {
      this.originalValue = this._numericValue;
      this.numericValueChanged.emit(this._numericValue);
    }
  }

  getValueForFormControl(): number | undefined {
    if (isNaN(this._numericValue)) {
      // Return undefined instead of NaN to support the default required validator.
      return undefined; // eslint-disable-line
    }
    return this._numericValue;
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
        this.renderer.setStyle(this.unitSpan, 'padding-left', '5px');
        this.renderer.appendChild(inputWrapper, this.unitSpan);
      }
    }

    // do not display unit symbol if the unit should move along display value
    if (!!this.unitSpan && this.textAlign === 'left' && this.unitPosition === 'right') {
      if (NumberFormatService.valueIsSet(this.displayValue)) {
        this.unitSpan.style.display = 'unset';
      } else {
        this.unitSpan.style.display = 'none';
      }
    }
    // always reset unit symbol
    if (!!this.unitSpan) {
      this.unitSpan.textContent = this.unit;
    }
  }

  private detachListener(): void {
    if (this.inputChangeListener) {
      this.inputChangeListener();
      delete this.inputChangeListener;
    }
    if (this.keydownListener) {
      this.keydownListener();
      delete this.keydownListener;
    }
    if (this.keyupListener) {
      this.keyupListener();
      delete this.keyupListener;
    }
  }

  private roundOrTruncate(value: number): number {
    const method = this.roundValue ? 'round' : value < 0 ? 'ceil' : 'floor';
    return Math[method](value * Math.pow(10, this.decimalPlaces)) / Math.pow(10, this.decimalPlaces);
  }
}
