/*
 * Copyright (c) 2018-2020 Porsche Informatik. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  effect,
  forwardRef,
  inject,
  input,
  numberAttribute,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberFormatService } from './number-format.service';

const CONTROL_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'Home',
  'End',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
]);

type UnitPosition = 'right' | 'left';
type NumericValue = number | null | undefined;

const UNSET_NUMERIC_VALUE = Symbol('unset numeric value input');
type NumericValueInput = NumericValue | typeof UNSET_NUMERIC_VALUE;

@Directive({
  selector: '[madNumericField]',
  host: {
    '[class.text-right]': 'textAlign() === "right"',
    '(change)': 'handleChangeEvent()',
    '(input)': 'handleInputEvent()',
    '(blur)': 'handleBlurEvent()',
    '(keydown)': 'handleKeyDown($event)',
    '(keyup)': 'handleKeyUp($event)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericFieldDirective),
      multi: true,
    },
  ],
  standalone: true,
})
export class NumericFieldDirective implements AfterViewInit, OnDestroy, ControlValueAccessor {
  readonly textAlign = input<UnitPosition>('right', { alias: 'textAlign' });
  readonly decimalPlaces = input(NumberFormatService.DEFAULT_DECIMAL_PLACES, {
    alias: 'decimalPlaces',
    transform: (value: unknown) => numberAttribute(value, NumberFormatService.DEFAULT_DECIMAL_PLACES),
  });
  readonly roundValue = input(false, { alias: 'roundDisplayValue', transform: booleanAttribute });
  readonly autofillDecimals = input(false, { alias: 'autofillDecimals', transform: booleanAttribute });
  readonly unit = input<string | null>(null, { alias: 'unit' });
  readonly unitPosition = input<UnitPosition>('right', { alias: 'unitPosition' });
  readonly numericValue = input<NumericValueInput, NumericValue>(UNSET_NUMERIC_VALUE, {
    alias: 'numericValue',
    transform: (value) => value,
  });
  readonly numericValueChanged = output<number>({ alias: 'numericValueChange' });

  private readonly renderer = inject(Renderer2);
  private readonly inputEl = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly numberFormatService = inject(NumberFormatService);

  private displayValue = '';
  private originalValue: NumericValue = NaN;
  private numericValueInternal: NumericValue;
  private textSpan?: HTMLSpanElement;
  private unitSpan?: HTMLSpanElement;
  private unitSpanPosition?: UnitPosition;
  private viewInitialized = false;
  private formatOptionsInitialized = false;
  private changeFn?: (value: number | undefined) => void;
  private touchedFn?: () => void;
  private readonly numericValueEffect = effect(() => {
    const value = this.numericValue();

    if (value !== UNSET_NUMERIC_VALUE) {
      this.applyExternalValue(value);
    }
  });
  private readonly formatOptionsEffect = effect(() => {
    this.decimalPlaces();
    this.autofillDecimals();
    this.roundValue();

    if (this.formatOptionsInitialized) {
      this.handleInputChanged();
    } else {
      this.formatOptionsInitialized = true;
    }
  });
  private readonly unitEffect = effect(() => {
    this.unit();
    this.unitPosition();
    this.textAlign();

    this.syncUnitSymbol();
  });

  private get inputElement(): HTMLInputElement {
    return this.inputEl.nativeElement;
  }

  registerOnChange(fn: (value: number | undefined) => void): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.inputElement, 'disabled', isDisabled);
  }

  writeValue(value: NumericValue): void {
    this.applyExternalValue(value);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.syncUnitSymbol();
  }

  ngOnDestroy(): void {
    this.removeUnitSpan();
    this.removeTextSpan();
  }

  handleChangeEvent(): void {
    this.changeFn?.(this.getValueForFormControl());
  }

  handleInputEvent(): void {
    this.changeFn?.(this.getValueForFormControl());
  }

  handleBlurEvent(): void {
    this.formatInput(this.inputElement, true);
    this.touchedFn?.();
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    const element = this.getEventInput(event);
    const value = element.value;

    if (event.metaKey || event.ctrlKey || event.altKey || CONTROL_KEYS.has(event.key)) {
      return this.handleControlKeyDown(event, element, value);
    }

    if (!this.numberFormatService.allowedKeys.includes(event.key)) {
      return this.preventDefault(event);
    }

    if (!this.isValidNegativeSign(event, element, value)) {
      return this.preventDefault(event);
    }

    if (!this.isValidDecimalSeparator(event, element, value)) {
      return this.preventDefault(event);
    }

    if (!this.isValidDecimalPlace(event, element, value)) {
      return this.preventDefault(event);
    }

    this.originalValue = NaN;
    return true;
  }

  handleKeyUp(event: KeyboardEvent): void {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete' || this.numberFormatService.allowedKeys.includes(event.key)) {
      this.formatInput(this.getEventInput(event), false);
    }
  }

  formatInput(element: HTMLInputElement, finalFormatting: boolean): void {
    const cursorPos = element.selectionStart ?? element.value.length;
    const length = element.value.length;
    const setCursor = this.displayValue !== element.value;
    const textFormatted = this.numberFormatService.formatNumber(element.value, {
      decimalPlaces: this.decimalPlaces(),
      finalFormatting,
      autofillDecimals: this.autofillDecimals(),
    });

    this.updateInput(textFormatted);
    this.updateTrailingUnitPosition(textFormatted);

    if (setCursor) {
      this.setCursorPosition(element, Math.max(cursorPos + element.value.length - length, 0));
    }
  }

  updateInput(value: string): void {
    this.displayValue = value;
    this.inputElement.value = value;
    this.numericValueInternal = this.parseNumericValue(value);

    if (this.numericValueInternal !== this.getComparableOriginalValue()) {
      this.originalValue = this.numericValueInternal;
      this.numericValueChanged.emit(this.numericValueInternal);
    }

    this.syncUnitSymbol();
  }

  getValueForFormControl(): number | undefined {
    this.formatInput(this.inputElement, false);

    if (typeof this.numericValueInternal !== 'number' || Number.isNaN(this.numericValueInternal)) {
      return undefined;
    }

    return this.numericValueInternal;
  }
  private handleInputChanged(): void {
    this.updateInput(
      this.numberFormatService.format(this.numericValueInternal, {
        decimalPlaces: this.decimalPlaces(),
        finalFormatting: true,
        autofillDecimals: this.autofillDecimals(),
      }),
    );
  }

  private applyExternalValue(value: NumericValue): void {
    if (
      this.numericValueInternal === value ||
      (this.isEmptyNumericValue(this.numericValueInternal) && (this.isEmptyNumericValue(value) || value === null))
    ) {
      return;
    }

    this.originalValue = value;
    this.numericValueInternal = value === null || value === undefined ? value : this.roundOrTruncate(value);
    this.handleInputChanged();
  }

  private handleControlKeyDown(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== 'Backspace' && event.key !== 'Delete') {
      return true;
    }

    const cursorStart = element.selectionStart ?? 0;
    const cursorEnd = element.selectionEnd ?? cursorStart;

    if (cursorStart !== cursorEnd) {
      return true;
    }

    if (event.key === 'Backspace' && value.charAt(cursorStart - 1) === this.numberFormatService.groupingSeparator) {
      element.value = value.substring(0, Math.max(cursorStart - 2, 0)) + value.substring(cursorStart - 1, value.length);
      this.setCursorPosition(element, Math.max(cursorStart - 1, 0));
      this.updateInput(element.value);
      return this.preventDefault(event);
    }

    if (event.key === 'Delete' && value.charAt(cursorStart) === this.numberFormatService.groupingSeparator) {
      element.value = value.substring(0, cursorStart + 1) + value.substring(cursorStart + 2, value.length);
      this.setCursorPosition(element, cursorStart + 1);
      this.updateInput(element.value);
      return this.preventDefault(event);
    }

    return true;
  }

  private isValidNegativeSign(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== NumberFormatService.NEGATIVE) {
      return true;
    }

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? selectionStart;
    const indexNegativeSign = value.indexOf(NumberFormatService.NEGATIVE);

    return (
      selectionStart === 0 &&
      (indexNegativeSign === -1 ||
        (selectionStart !== selectionEnd && indexNegativeSign >= selectionStart && indexNegativeSign <= selectionEnd))
    );
  }

  private isValidDecimalSeparator(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== this.numberFormatService.decimalSeparator) {
      return true;
    }

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? selectionStart;
    const indexDecimalSep = value.indexOf(this.numberFormatService.decimalSeparator);

    if (this.decimalPlaces() === 0) {
      return false;
    }

    return (
      indexDecimalSep === -1 ||
      (this.decimalPlaces() > 0 && selectionStart !== selectionEnd && indexDecimalSep >= selectionStart && indexDecimalSep <= selectionEnd)
    );
  }

  private isValidDecimalPlace(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (!NumberFormatService.NUMBERS.includes(event.key)) {
      return true;
    }

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? selectionStart;
    const indexDecimalSep = value.indexOf(this.numberFormatService.decimalSeparator);

    return (
      indexDecimalSep === -1 ||
      indexDecimalSep >= selectionStart ||
      selectionStart !== selectionEnd ||
      value.length <= indexDecimalSep + this.decimalPlaces()
    );
  }

  private getEventInput(event: Event): HTMLInputElement {
    return event.target instanceof HTMLInputElement ? event.target : this.inputElement;
  }

  private preventDefault(event: Event): false {
    event.preventDefault();
    return false;
  }

  private parseNumericValue(value: string): number {
    return Number.parseFloat(
      this.numberFormatService
        .strip(value, { decimalPlaces: this.decimalPlaces() })
        .replace(this.numberFormatService.decimalSeparator, '.'),
    );
  }

  private getComparableOriginalValue(): number {
    return typeof this.originalValue === 'number' ? this.roundOrTruncate(this.originalValue) : NaN;
  }

  private syncUnitSymbol(): void {
    if (!this.viewInitialized) {
      return;
    }

    if (!this.unit()) {
      this.removeUnitSpan();
      return;
    }

    if (!this.unitSpan || this.unitSpanPosition !== this.unitPosition()) {
      this.createUnitSpan();
    }

    if (!this.unitSpan) {
      return;
    }

    this.unitSpan.textContent = this.unit();

    if (this.textAlign() === 'left' && this.unitPosition() === 'right') {
      this.unitSpan.style.display = NumberFormatService.valueIsSet(this.displayValue) ? 'unset' : 'none';
    } else {
      this.unitSpan.style.display = '';
      this.unitSpan.style.left = '';
      this.unitSpan.style.position = '';
    }
  }

  private createUnitSpan(): void {
    const unitContainer = this.getUnitContainer();

    if (!unitContainer) {
      return;
    }

    this.removeUnitSpan();
    this.unitSpan = this.renderer.createElement('span') as HTMLSpanElement;
    this.unitSpanPosition = this.unitPosition();
    this.renderer.addClass(this.unitSpan, 'mad-numeric-field-unit');

    if (this.unitPosition() === 'left') {
      this.renderer.setAttribute(this.unitSpan, 'matPrefix', '');
      this.renderer.setAttribute(this.unitSpan, 'matTextPrefix', '');
      this.renderer.setStyle(this.unitSpan, 'padding-right', '5px');
      this.renderer.insertBefore(unitContainer, this.unitSpan, this.getUnitInsertReference(unitContainer));
    } else {
      this.renderer.setAttribute(this.unitSpan, 'matSuffix', '');
      this.renderer.setAttribute(this.unitSpan, 'matTextSuffix', '');
      this.renderer.setStyle(this.unitSpan, 'padding-left', '5px');
      this.renderer.appendChild(unitContainer, this.unitSpan);
    }
  }

  private getUnitContainer(): HTMLElement | null {
    const materialFormFieldFlex = this.inputElement.closest('.mat-mdc-form-field-flex');

    if (materialFormFieldFlex instanceof HTMLElement) {
      return materialFormFieldFlex;
    }

    return this.inputElement.parentElement;
  }

  private getUnitInsertReference(unitContainer: HTMLElement): HTMLElement | null {
    if (this.inputElement.parentElement?.parentElement === unitContainer) {
      return this.inputElement.parentElement;
    }

    if (this.inputElement.parentElement === unitContainer) {
      return this.inputElement;
    }

    return null;
  }

  private updateTrailingUnitPosition(textFormatted: string): void {
    if (this.textAlign() !== 'left' || this.unitPosition() !== 'right' || !this.unitSpan || !this.inputElement.parentElement) {
      return;
    }

    const inputStyles = window.getComputedStyle(this.inputElement.parentElement);
    this.unitSpan.style.position = 'absolute';
    this.unitSpan.style.marginTop = inputStyles.getPropertyValue('border-top-width');
    this.unitSpan.style.paddingTop = inputStyles.getPropertyValue('padding-top');
    this.unitSpan.style.paddingBottom = inputStyles.getPropertyValue('padding-bottom');

    this.ensureTextSpan(inputStyles);

    if (!this.textSpan) {
      return;
    }

    this.textSpan.textContent = textFormatted;

    const width = Math.min(this.inputElement.clientWidth - this.unitSpan.clientWidth, Math.ceil(this.textSpan.clientWidth));
    this.unitSpan.style.left = `${Math.max(width, 0)}px`;
  }

  private ensureTextSpan(inputStyles: CSSStyleDeclaration): void {
    if (this.textSpan) {
      return;
    }

    this.textSpan = document.createElement('span');
    document.body.appendChild(this.textSpan);
    this.textSpan.style.font = inputStyles.getPropertyValue('font');
    this.textSpan.style.fontSize = inputStyles.getPropertyValue('font-size');
    this.textSpan.style.height = 'auto';
    this.textSpan.style.width = 'auto';
    this.textSpan.style.position = 'absolute';
    this.textSpan.style.top = '0';
    this.textSpan.style.whiteSpace = 'nowrap';
    this.textSpan.style.visibility = 'hidden';
  }

  private removeUnitSpan(): void {
    if (!this.unitSpan) {
      return;
    }

    this.unitSpan.remove();
    this.unitSpan = undefined;
    this.unitSpanPosition = undefined;
  }

  private removeTextSpan(): void {
    if (!this.textSpan) {
      return;
    }

    this.textSpan.remove();
    this.textSpan = undefined;
  }

  private setCursorPosition(element: HTMLInputElement, position: number): void {
    element.setSelectionRange(position, position);
  }

  private isEmptyNumericValue(value: NumericValue): boolean {
    return value === undefined || (typeof value === 'number' && Number.isNaN(value));
  }

  private roundOrTruncate(value: number): number {
    if (this.roundValue()) {
      return Math.round(value * Math.pow(10, this.decimalPlaces())) / Math.pow(10, this.decimalPlaces());
    }

    const method = value < 0 ? 'ceil' : 'floor';
    return Math[method](+(value * Math.pow(10, this.decimalPlaces())).toFixed(this.decimalPlaces())) / Math.pow(10, this.decimalPlaces());
  }
}
