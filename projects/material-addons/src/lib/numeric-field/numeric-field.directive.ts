/*
 * Copyright (c) 2018-2020 Porsche Informatik. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterEveryRender,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  effect,
  forwardRef,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  Injector,
  OnDestroy,
  output,
  Renderer2,
  untracked,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NumberFormatService } from './number-format.service';
import { normalizeDecimalPlaces, roundOrTruncateNumber } from './numeric-field-format';
import { mapNormalizedSelection } from './numeric-field-selection';
import { NumericFieldUnitPresentation } from './numeric-field-unit-presentation';

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
})
export class NumericFieldDirective implements AfterViewInit, OnDestroy, ControlValueAccessor {
  readonly textAlign = input<UnitPosition>('right');
  readonly decimalPlaces = input(NumberFormatService.DEFAULT_DECIMAL_PLACES, {
    transform: normalizeDecimalPlaces,
  });
  readonly roundValue = input(false, { alias: 'roundDisplayValue', transform: booleanAttribute });
  readonly autofillDecimals = input(false, { transform: booleanAttribute });
  readonly unit: InputSignal<string | null> = input<string | null>(null);
  readonly unitPosition = input<UnitPosition>('right');
  readonly numericValue: InputSignalWithTransform<NumericValueInput, NumericValue> = input<NumericValueInput, NumericValue>(
    UNSET_NUMERIC_VALUE,
    { transform: (value) => value },
  );
  readonly numericValueChanged = output<number>({ alias: 'numericValueChange' });

  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formField = inject(MatFormField, { optional: true });

  private readonly renderer = inject(Renderer2);
  private readonly inputEl = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly numberFormatService = inject(NumberFormatService);
  private readonly injector = inject(Injector);
  private readonly unitPresentation = new NumericFieldUnitPresentation(this.inputElement, this.renderer, () =>
    this.changeDetectorRef.markForCheck(),
  );
  private changeFn: (value: number | undefined) => void = () => {};
  private touchedFn: () => void = () => {};

  private displayValue = '';
  private acceptedValue: NumericValue;
  private matInput: MatInput | null = null;
  private formatOptionsInitialized = false;

  private readonly numericValueEffect = effect(() => {
    const value = this.numericValue();
    // A two-way binding echo must preserve unfinished text and the user's caret.
    if (value !== UNSET_NUMERIC_VALUE && !Object.is(value, this.acceptedValue)) {
      untracked(() => this.applyExternalValue(value));
    }
  });

  private readonly formatOptionsEffect = effect(() => {
    this.decimalPlaces();
    this.autofillDecimals();
    this.roundValue();
    this.numberFormatService.decimalSeparator;
    this.numberFormatService.groupingSeparator;
    this.numberFormatService.allowedKeys;

    if (this.formatOptionsInitialized) {
      untracked(() => this.renderCurrentValue());
    } else {
      this.formatOptionsInitialized = true;
    }
  });

  // Unit layout restores consumer styles before measuring and then measures its
  // updated text. Keep that dependent transaction in one render, without delaying CVA.
  private readonly unitRendering = afterEveryRender({
    mixedReadWrite: () =>
      this.unitPresentation.render(
        {
          unit: this.unit(),
          unitPosition: this.unitPosition(),
          textAlign: this.textAlign(),
          text: this.displayValue,
        },
        {
          id: this.formField?.getLabelId(),
          floating: this.formField?.floatLabel === 'always' || !!this.matInput?.shouldLabelFloat,
        },
      ),
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
    untracked(() => this.applyExternalValue(value));
  }

  ngAfterViewInit(): void {
    // Resolve after construction: MatInput also participates in forms injection.
    this.matInput = this.injector.get(MatInput, null, { self: true, optional: true });
    this.notifyMatInputStateChanged();
  }

  ngOnDestroy(): void {
    this.unitPresentation.destroy();
  }

  handleChangeEvent(): void {
    if (!this.inputElement.readOnly && !this.inputElement.disabled) {
      this.changeFn(this.getValueForFormControl());
    }
  }

  handleInputEvent(): void {
    this.handleChangeEvent();
  }

  handleBlurEvent(): void {
    if (this.inputElement.disabled) {
      return;
    }

    this.formatInput(this.inputElement, true);
    this.touchedFn();
  }

  handleKeyDown(event: KeyboardEvent): boolean {
    const element = this.getEventInput(event);
    const value = element.value;

    if (element.readOnly || element.disabled) {
      return true;
    }

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
    if (element.readOnly || element.disabled) {
      return;
    }

    const acceptValue = this.formatInputValue(element, finalFormatting, this.displayValue !== element.value);
    if (acceptValue) {
      this.changeFn(this.acceptedFormValue());
    }
  }

  updateInput(value: string): void {
    this.writeDisplayValue(value);
    this.updateNumericValue(value);
  }

  getValueForFormControl(): number | undefined {
    this.formatInputValue(this.inputElement, false, true);

    return this.acceptedFormValue();
  }

  private acceptedFormValue(): number | undefined {
    return typeof this.acceptedValue === 'number' && Number.isFinite(this.acceptedValue) ? this.acceptedValue : undefined;
  }

  private formatInputValue(element: HTMLInputElement, finalFormatting: boolean, acceptValue: boolean): boolean {
    const rawValue = element.value;
    const { start, end } = this.getSelection(element);
    const direction = element.selectionDirection;
    const textFormatted = this.numberFormatService.formatNumber(rawValue, {
      decimalPlaces: this.decimalPlaces(),
      finalFormatting,
      autofillDecimals: this.autofillDecimals(),
    });

    // Final formatting can resolve an accepted invalid partial edit (e.g. ".")
    // to zero. Presentation-only changes to finite external values stay silent.
    const resolvesPartialEdit =
      finalFormatting &&
      Number.isNaN(this.acceptedValue) &&
      rawValue !== '' &&
      !Number.isFinite(this.parseNumericValue(rawValue)) &&
      Number.isFinite(this.parseNumericValue(textFormatted));
    const acceptsEdit = acceptValue || resolvesPartialEdit;
    if (acceptsEdit) {
      this.updateInput(textFormatted);
    } else {
      this.writeDisplayValue(textFormatted);
    }

    if (rawValue !== textFormatted) {
      const mapped = mapNormalizedSelection(
        { start, end },
        {
          rawValue,
          normalizedValue: this.numberFormatService.strip(rawValue, {
            decimalPlaces: this.decimalPlaces(),
            removeLeadingZeros: finalFormatting,
          }),
          formattedValue: textFormatted,
          groupingSeparator: this.numberFormatService.groupingSeparator,
          decimalSeparator: this.numberFormatService.decimalSeparator,
        },
      );
      element.setSelectionRange(mapped.start, mapped.end, direction);
    }
    return acceptsEdit;
  }

  private writeDisplayValue(value: string): void {
    this.displayValue = value;
    this.unitPresentation.invalidateLayout();
    if (this.inputElement.value !== value) {
      this.inputElement.value = value;
    }
    this.notifyMatInputStateChanged();
    this.changeDetectorRef.markForCheck();
  }

  private updateNumericValue(value: string): void {
    const previousValue = this.acceptedValue;
    const parsedValue = this.parseNumericValue(value);
    this.acceptedValue = parsedValue;
    if (parsedValue !== previousValue) {
      this.numericValueChanged.emit(parsedValue);
    }
  }

  private renderCurrentValue(): void {
    const value = this.acceptedValue;
    const displayNumber =
      typeof value === 'number' && Number.isFinite(value)
        ? roundOrTruncateNumber(value, this.decimalPlaces(), this.roundValue())
        : undefined;
    this.writeDisplayValue(
      this.numberFormatService.format(displayNumber, {
        decimalPlaces: this.decimalPlaces(),
        finalFormatting: true,
        autofillDecimals: this.autofillDecimals(),
      }),
    );
  }

  private applyExternalValue(value: NumericValue): void {
    this.acceptedValue = value;
    this.renderCurrentValue();
  }

  private handleControlKeyDown(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== 'Backspace' && event.key !== 'Delete') {
      return true;
    }

    const { start: cursorStart, end: cursorEnd } = this.getSelection(element);

    if (cursorStart !== cursorEnd) {
      return true;
    }

    if (event.key === 'Backspace' && value.charAt(cursorStart - 1) === this.numberFormatService.groupingSeparator) {
      element.value = value.substring(0, Math.max(cursorStart - 2, 0)) + value.substring(cursorStart - 1, value.length);
      this.updateInput(element.value);
      this.changeFn(this.acceptedFormValue());
      this.setCursorPosition(element, Math.max(cursorStart - 1, 0));
      return this.preventDefault(event);
    }

    if (event.key === 'Delete' && value.charAt(cursorStart) === this.numberFormatService.groupingSeparator) {
      element.value = value.substring(0, cursorStart + 1) + value.substring(cursorStart + 2, value.length);
      this.updateInput(element.value);
      this.changeFn(this.acceptedFormValue());
      this.setCursorPosition(element, cursorStart + 1);
      return this.preventDefault(event);
    }

    return true;
  }

  private isValidNegativeSign(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== NumberFormatService.NEGATIVE) {
      return true;
    }

    const { start: selectionStart, end: selectionEnd } = this.getSelection(element);
    const indexNegativeSign = value.indexOf(NumberFormatService.NEGATIVE);

    return (
      selectionStart === 0 &&
      (indexNegativeSign === -1 ||
        (selectionStart !== selectionEnd && indexNegativeSign >= selectionStart && indexNegativeSign < selectionEnd))
    );
  }

  private isValidDecimalSeparator(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (event.key !== this.numberFormatService.decimalSeparator) {
      return true;
    }

    const { start: selectionStart, end: selectionEnd } = this.getSelection(element);
    const indexDecimalSep = value.indexOf(this.numberFormatService.decimalSeparator);

    if (this.decimalPlaces() === 0) {
      return false;
    }

    return (
      indexDecimalSep === -1 ||
      (this.decimalPlaces() > 0 && selectionStart !== selectionEnd && indexDecimalSep >= selectionStart && indexDecimalSep < selectionEnd)
    );
  }

  private isValidDecimalPlace(event: KeyboardEvent, element: HTMLInputElement, value: string): boolean {
    if (!NumberFormatService.NUMBERS.includes(event.key)) {
      return true;
    }

    const { start: selectionStart, end: selectionEnd } = this.getSelection(element);
    const indexDecimalSep = value.indexOf(this.numberFormatService.decimalSeparator);

    return (
      indexDecimalSep === -1 ||
      indexDecimalSep >= selectionStart ||
      selectionStart !== selectionEnd ||
      value.length <= indexDecimalSep + this.decimalPlaces()
    );
  }

  private getSelection(element: HTMLInputElement): { start: number; end: number } {
    const start = element.selectionStart ?? 0;
    return { start, end: element.selectionEnd ?? start };
  }

  private getEventInput(event: Event): HTMLInputElement {
    return event.target instanceof HTMLInputElement ? event.target : this.inputElement;
  }

  private preventDefault(event: Event): false {
    event.preventDefault();
    return false;
  }

  private notifyMatInputStateChanged(): void {
    this.matInput?.stateChanges.next();
  }

  private parseNumericValue(value: string): number {
    const parsedValue = Number.parseFloat(
      this.numberFormatService
        .strip(value, { decimalPlaces: this.decimalPlaces() })
        .replace(this.numberFormatService.decimalSeparator, '.'),
    );
    return Number.isFinite(parsedValue) ? parsedValue : NaN;
  }

  private setCursorPosition(element: HTMLInputElement, position: number): void {
    element.setSelectionRange(position, position);
  }
}
