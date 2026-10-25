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

interface UnitLayout {
  text: string;
  font: string;
  fontSize: string;
  letterSpacing: string;
  marginTop: string;
  paddingTop: string;
  paddingBottom: string;
  inputWidth: number;
  inputOffset: number;
  paddingLeft: number;
  paddingRight: number;
  outerWidth: number;
  borderLeft: number;
  unitWidth: number;
}

interface UnitPresentation {
  color: string;
  layout?: UnitLayout;
  label?: { element: HTMLElement; width: number; shift: number };
}

interface TextSelection {
  start: number;
  end: number;
}

interface SelectionNormalization {
  rawValue: string;
  normalizedValue: string;
  formattedValue: string;
  groupingSeparator: string;
  decimalSeparator: string;
}

function mapNormalizedSelection(selection: TextSelection, context: SelectionNormalization): TextSelection {
  const { rawValue, normalizedValue, formattedValue, groupingSeparator, decimalSeparator } = context;
  const isExponent = /^[+\-0-9.,]+[eE][+-]?[0-9]+$/.test(rawValue) && normalizedValue !== '';
  const mapPosition = (position: number): number => {
    if (position <= 0) {
      return 0;
    }
    if (position >= rawValue.length) {
      return formattedValue.length;
    }
    if (isExponent) {
      // An exponent is one literal, not independently parseable prefixes. Spread its
      // interior boundaries monotonically across the complete expanded display.
      return Math.ceil((position / rawValue.length) * formattedValue.length);
    }

    let retained = 0;
    for (let index = 0; index < position && retained < normalizedValue.length; index++) {
      if (rawValue.charAt(index) === normalizedValue.charAt(retained)) {
        retained++;
      }
    }

    let formattedPosition = 0;
    let normalizedPosition = 0;
    while (formattedPosition < formattedValue.length && normalizedPosition < retained) {
      if (formattedValue.charAt(formattedPosition) === normalizedValue.charAt(normalizedPosition)) {
        normalizedPosition++;
      }
      formattedPosition++;
    }

    if (
      groupingSeparator !== decimalSeparator &&
      rawValue.charAt(position - 1) === groupingSeparator &&
      formattedValue.charAt(formattedPosition) === groupingSeparator
    ) {
      formattedPosition++;
    }
    return formattedPosition;
  };

  const start = mapPosition(selection.start);
  const end = mapPosition(selection.end);
  return { start: Math.min(start, end), end: Math.max(start, end) };
}

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
  private resizeObserver?: ResizeObserver;
  private labelStyles?: { element: HTMLElement; maxWidth: string; marginLeft: string; shift: number };

  private readonly renderer = inject(Renderer2);
  private readonly inputEl = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly numberFormatService = inject(NumberFormatService);
  private readonly injector = inject(Injector);
  private inputReservation?: { property: string; value: string; priority: string; appliedValue: string; appliedPriority: string }[];
  private changeFn: (value: number | undefined) => void = () => {};
  private touchedFn: () => void = () => {};

  private displayValue = '';
  private acceptedValue: NumericValue;
  private matInput: MatInput | null = null;
  private textSpan?: HTMLSpanElement;
  private unitSpan?: HTMLSpanElement;
  private unitSpanPosition?: UnitPosition;
  private viewInitialized = false;
  private formatOptionsInitialized = false;
  private unitLayoutDirty = true;

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

  private readonly unitEffect = effect(() => {
    this.unit();
    this.unitPosition();
    this.textAlign();
    untracked(() => this.syncUnitSymbol());
  });

  // Keep model writes synchronous; only unit color and layout wait for the rendered input.
  private readonly unitRendering = afterEveryRender({
    earlyRead: () => this.readUnitPresentation(),
    write: (presentation) => this.writeUnitPresentation(presentation),
    mixedReadWrite: (layout) => {
      if (!layout || !this.textSpan || !this.unitSpan) {
        return;
      }

      const textWidth = layout.inputWidth - layout.paddingLeft - layout.paddingRight - layout.unitWidth;
      const width = Math.min(textWidth, Math.ceil(this.textSpan.clientWidth));
      this.unitSpan.style.left = `${layout.inputOffset + layout.borderLeft + layout.paddingLeft + Math.max(width, 0)}px`;
    },
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
    this.viewInitialized = true;
    // Resolve after construction: MatInput also participates in forms injection.
    this.matInput = this.injector.get(MatInput, null, { self: true, optional: true });
    this.syncUnitSymbol();
    this.notifyMatInputStateChanged();
  }

  ngOnDestroy(): void {
    this.removeUnitSpan();
    this.removeTextSpan();
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
    this.syncUnitSymbol();
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
      this.syncUnitSymbol();
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
    this.unitLayoutDirty = true;
    // Assigning even an unchanged native value can disturb a live selection.
    if (this.inputElement.value !== value) {
      this.inputElement.value = value;
    }
    this.notifyMatInputStateChanged();
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
    this.syncUnitSymbol();
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

  private syncUnitSymbol(): void {
    this.unitLayoutDirty = true;
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

    if (this.textAlign() !== 'left' || this.unitPosition() !== 'right' || !NumberFormatService.valueIsSet(this.displayValue)) {
      this.restoreInputReservation();
    }
    this.observeUnitSize();
    this.unitSpan.textContent = this.unit();

    if (this.textAlign() === 'left' && this.unitPosition() === 'right') {
      this.unitSpan.style.display = NumberFormatService.valueIsSet(this.displayValue) ? 'unset' : 'none';
      this.unitSpan.style.position = 'absolute';
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

  private readUnitPresentation(): UnitPresentation | undefined {
    if (!this.unitSpan) {
      return undefined;
    }

    // Measure the consumer's authored width, including responsive CSS, before
    // reserving space. Restoration and reapplication finish in this render, so
    // the observed border box stays unchanged and no intermediate style paints.
    if (this.unitLayoutDirty) {
      this.restoreInputReservation();
    }
    const inputStyles = window.getComputedStyle(this.inputElement);
    const label = this.readRestingLabel();
    const refreshLayout = this.unitLayoutDirty;
    this.unitLayoutDirty = false;

    if (!refreshLayout || this.textAlign() !== 'left' || this.unitPosition() !== 'right' || !this.inputElement.parentElement) {
      return { color: inputStyles.color, label };
    }

    const parentStyles = window.getComputedStyle(this.inputElement.parentElement);
    const offsetParent = this.unitSpan.offsetParent;
    const inputBounds = this.inputElement.getBoundingClientRect();
    const inputOffset =
      offsetParent instanceof HTMLElement ? inputBounds.left - offsetParent.getBoundingClientRect().left - offsetParent.clientLeft : 0;
    return {
      color: inputStyles.color,
      label,
      layout: {
        text: this.displayValue,
        font: inputStyles.font,
        fontSize: inputStyles.fontSize,
        letterSpacing: inputStyles.letterSpacing,
        marginTop: parentStyles.getPropertyValue('border-top-width'),
        paddingTop: parentStyles.getPropertyValue('padding-top'),
        paddingBottom: parentStyles.getPropertyValue('padding-bottom'),
        inputWidth: this.inputElement.clientWidth,
        inputOffset,
        paddingLeft: Number.parseFloat(inputStyles.paddingLeft) || 0,
        paddingRight: Number.parseFloat(inputStyles.paddingRight) || 0,
        outerWidth:
          inputBounds.width ||
          this.inputElement.clientWidth +
            (Number.parseFloat(inputStyles.borderLeftWidth) || 0) +
            (Number.parseFloat(inputStyles.borderRightWidth) || 0),
        borderLeft: Number.parseFloat(inputStyles.borderLeftWidth) || 0,
        unitWidth: this.unitSpan.clientWidth,
      },
    };
  }

  private writeUnitPresentation(presentation: UnitPresentation | undefined): UnitLayout | undefined {
    if (!presentation || !this.unitSpan) {
      return undefined;
    }

    this.writeRestingLabel(presentation.label);

    // Read the actual input color so filled/outlined themes and native disabled bindings agree.
    if (this.unitSpan.style.color !== presentation.color) {
      this.unitSpan.style.color = presentation.color;
    }
    const layout = presentation.layout;
    if (!layout) {
      return undefined;
    }

    if (NumberFormatService.valueIsSet(layout.text)) {
      this.reserveInputSpace(layout);
    }
    this.unitSpan.style.marginTop = layout.marginTop;
    this.unitSpan.style.paddingTop = layout.paddingTop;
    this.unitSpan.style.paddingBottom = layout.paddingBottom;
    this.ensureTextSpan();
    if (this.textSpan) {
      this.textSpan.style.font = layout.font;
      this.textSpan.style.fontSize = layout.fontSize;
      this.textSpan.style.letterSpacing = layout.letterSpacing;
      this.textSpan.textContent = layout.text;
    }
    return layout;
  }

  private observeUnitSize(): void {
    const Observer = this.inputElement.ownerDocument.defaultView?.ResizeObserver;
    if (this.resizeObserver || !Observer || !this.unitSpan) {
      return;
    }
    this.resizeObserver = new Observer(() => {
      this.unitLayoutDirty = true;
      this.changeDetectorRef.markForCheck();
    });
    // Padding changes the content box, not the border box. The parent also
    // detects responsive sizing while the input holds its measured outer width.
    this.resizeObserver.observe(this.inputElement, { box: 'border-box' });
    if (this.inputElement.parentElement) {
      this.resizeObserver.observe(this.inputElement.parentElement);
    }
    this.resizeObserver.observe(this.unitSpan);
  }

  private reserveInputSpace(layout: UnitLayout): void {
    const style = this.inputElement.style;
    this.inputReservation ??= ['width', 'box-sizing', 'padding-right'].map((property) => ({
      property,
      value: style.getPropertyValue(property),
      priority: style.getPropertyPriority(property),
      appliedValue: '',
      appliedPriority: '',
    }));
    style.setProperty('box-sizing', 'border-box');
    style.setProperty('width', `${layout.outerWidth}px`);
    // unitWidth includes the unit span's existing five-pixel leading gap.
    style.setProperty('padding-right', `${layout.paddingRight + layout.unitWidth}px`);
    // Read back CSSOM declarations so ownership compares browser-canonical values.
    for (const reservation of this.inputReservation) {
      reservation.appliedValue = style.getPropertyValue(reservation.property);
      reservation.appliedPriority = style.getPropertyPriority(reservation.property);
    }
  }

  private restoreInputReservation(): void {
    for (const { property, value, priority, appliedValue, appliedPriority } of this.inputReservation ?? []) {
      const style = this.inputElement.style;
      // Consumer writes supersede our snapshot independently for each property.
      // Retain them here so the next natural measurement captures the latest CSS.
      if (style.getPropertyValue(property) !== appliedValue || style.getPropertyPriority(property) !== appliedPriority) {
        continue;
      }
      if (value) {
        this.inputElement.style.setProperty(property, value, priority);
      } else {
        this.inputElement.style.removeProperty(property);
      }
    }
    this.inputReservation = undefined;
  }

  private readRestingLabel(): UnitPresentation['label'] {
    const labelId = this.formField?.getLabelId();
    if (!labelId || this.formField?.floatLabel === 'always' || this.matInput?.shouldLabelFloat) {
      return undefined;
    }
    const element = this.inputElement.ownerDocument.getElementById(labelId);
    if (!element) {
      return undefined;
    }
    return {
      element,
      width: this.inputElement.clientWidth,
      shift:
        this.unitPosition() === 'left'
          ? (this.labelStyles?.shift ?? 0) + this.inputElement.getBoundingClientRect().left - element.getBoundingClientRect().left
          : 0,
    };
  }

  private writeRestingLabel(label: UnitPresentation['label']): void {
    if (this.labelStyles?.element !== label?.element) {
      this.restoreLabelStyles();
    }
    if (!label) {
      return;
    }
    if (!this.labelStyles) {
      this.labelStyles = {
        element: label.element,
        maxWidth: label.element.style.maxWidth,
        marginLeft: label.element.style.marginLeft,
        shift: 0,
      };
    }
    // Material owns truncation and floating transforms. Limit only the resting
    // label to the input's available space, using its public label relationship.
    label.element.style.maxWidth = `${label.width}px`;
    if (this.unitPosition() === 'left') {
      this.labelStyles.shift = label.shift;
      label.element.style.marginLeft = `calc(${this.labelStyles.marginLeft || '0px'} + ${label.shift}px)`;
    } else {
      label.element.style.marginLeft = this.labelStyles.marginLeft;
    }
  }

  private restoreLabelStyles(): void {
    if (this.labelStyles) {
      const { element, maxWidth, marginLeft } = this.labelStyles;
      element.style.maxWidth = maxWidth;
      element.style.marginLeft = marginLeft;
      this.labelStyles = undefined;
    }
  }

  private ensureTextSpan(): void {
    if (this.textSpan) {
      return;
    }

    this.textSpan = document.createElement('span');
    document.body.appendChild(this.textSpan);
    this.textSpan.style.height = 'auto';
    this.textSpan.style.width = 'auto';
    this.textSpan.style.position = 'absolute';
    this.textSpan.style.top = '0';
    this.textSpan.style.whiteSpace = 'nowrap';
    this.textSpan.style.visibility = 'hidden';
  }

  private removeUnitSpan(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.restoreLabelStyles();
    this.restoreInputReservation();
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
}
