import { ChangeDetectionStrategy, Component, input, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { describe, expect, it, jest } from '@jest/globals';
import { NumericFieldDirective } from './numeric-field.directive';

@Component({
  template: `
    <mat-form-field [appearance]="appearance()" [floatLabel]="floatLabel()">
      <mat-label>A long label that must leave room for the unit</mat-label>
      <input
        matInput
        madNumericField
        [formControl]="control"
        [unit]="unit()"
        [unitPosition]="unitPosition()"
        [textAlign]="textAlign()"
        [decimalPlaces]="decimalPlaces()"
        [autofillDecimals]="autofillDecimals()"
      />
    </mat-form-field>
  `,
  imports: [NumericFieldDirective, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
class UnitPresentationTestComponent {
  readonly appearance = input<'fill' | 'outline'>('fill');
  readonly floatLabel = input<'auto' | 'always'>('auto');
  readonly textAlign = input<'left' | 'right'>('left');
  readonly unitPosition = input<'left' | 'right'>('right');
  readonly unit = input<string | null>('kg');
  readonly decimalPlaces = input(2);
  readonly autofillDecimals = input(false);
  readonly control = new FormControl<number | null | undefined>(1234.567);
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NumericFieldDirective, ReactiveFormsModule],
  template: `<div><input madNumericField unit="kg" textAlign="left" [formControl]="control" /></div>`,
})
class PlainUnitTestComponent {
  readonly control = new FormControl<number | null | undefined>(12);
}

describe('NumericFieldDirective unit presentation', () => {
  describe.each([
    ['plain input', PlainUnitTestComponent],
    ['Material input', UnitPresentationTestComponent],
  ] as const)('zoneless programmatic writes to a %s', (_name, host) => {
    it.each(['setValue', 'reset'] as const)('refreshes the unit after silent %s without forcing detection', async (method) => {
      TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
      const fixture = TestBed.createComponent(host);
      await fixture.whenStable();
      const control = fixture.componentInstance.control;
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      const unit: HTMLSpanElement = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
      const output = jest.fn();
      const changes = jest.fn();
      fixture.debugElement
        .query(By.directive(NumericFieldDirective))
        .injector.get(NumericFieldDirective)
        .numericValueChanged.subscribe(output);
      control.valueChanges.subscribe(changes);

      for (const [value, display] of [
        [null, ''],
        [123456, '123,456'],
        [null, ''],
        [0, '0'],
      ] as const) {
        control[method](value, { emitEvent: false });
        expect(input.value).toBe(display);
        await fixture.whenStable();
        expect(unit.style.display).toBe(value === null ? 'none' : 'unset');
        if (value === null) {
          expect(input.style.paddingRight).toBe('');
        }
      }

      expect(output).not.toHaveBeenCalled();
      expect(changes).not.toHaveBeenCalled();
      expect(control.pristine).toBe(true);
      expect(control.untouched).toBe(true);
    });
  });

  describe.each(['left', 'right'] as const)('consumer label styles with a %s unit', (position) => {
    it('restores original declaration priorities and preserves a newer priority-only update', () => {
      const fixture = TestBed.createComponent(UnitPresentationTestComponent);
      fixture.componentRef.setInput('unitPosition', position);
      fixture.componentRef.setInput('unit', null);
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
      label.style.setProperty('max-width', '90%', 'important');
      label.style.setProperty('margin-left', '3px', 'important');
      fixture.componentRef.setInput('unit', 'kg');
      fixture.detectChanges();
      fixture.componentRef.setInput('unit', null);
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('90%');
      expect(label.style.marginLeft).toBe('3px');
      expect(label.style.getPropertyPriority('max-width')).toBe('important');
      expect(label.style.getPropertyPriority('margin-left')).toBe('important');

      fixture.componentRef.setInput('unit', 'kg');
      fixture.detectChanges();
      const appliedWidth = label.style.maxWidth;
      label.style.setProperty('max-width', appliedWidth, 'important');
      fixture.detectChanges();
      fixture.destroy();
      expect(label.style.maxWidth).toBe(appliedWidth);
      expect(label.style.getPropertyPriority('max-width')).toBe('important');
    });

    it.each(['remove', 'focus', 'remeasure', 'destroy'] as const)('preserves newer declarations on %s', (action) => {
      const fixture = TestBed.createComponent(UnitPresentationTestComponent);
      fixture.componentRef.setInput('unitPosition', position);
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      label.style.setProperty('max-width', '95%', 'important');
      label.style.setProperty('margin-left', '7px', 'important');
      label.style.translate = '2px';

      if (action === 'remeasure') {
        fixture.detectChanges();
      }
      if (action === 'focus') {
        input.dispatchEvent(new Event('focus'));
        fixture.detectChanges();
      } else if (action === 'destroy') {
        fixture.destroy();
      } else {
        fixture.componentRef.setInput('unit', null);
        fixture.detectChanges();
      }

      expect(label.style.maxWidth).toBe('95%');
      expect(label.style.getPropertyPriority('max-width')).toBe('important');
      expect(label.style.marginLeft).toBe('7px');
      expect(label.style.getPropertyPriority('margin-left')).toBe('important');
      expect(label.style.translate).toBe('2px');
      fixture.destroy();
    });
  });

  it('should invalidate resized units, notify Angular and disconnect removed and destroyed observers', async () => {
    let callback: ResizeObserverCallback | undefined;
    const observe = jest.fn();
    const disconnect = jest.fn();
    const original = window.ResizeObserver;
    window.ResizeObserver = class implements ResizeObserver {
      observe = observe;
      disconnect = disconnect;
      unobserve = jest.fn();
      constructor(next: ResizeObserverCallback) {
        callback = next;
      }
    };
    let inputWidth = 316;
    const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function measureWidth(this: HTMLElement) {
      return this.tagName === 'INPUT' ? inputWidth : (this.textContent ?? '').length * 8;
    });
    const fixture = TestBed.createComponent(UnitPresentationTestComponent);
    try {
      fixture.componentInstance.control.setValue(1234567890123456);
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      const unit = fixture.debugElement.query(By.css('.mad-numeric-field-unit')).nativeElement as HTMLSpanElement;
      expect(observe).toHaveBeenCalledWith(element, { box: 'border-box' });
      expect(observe).toHaveBeenCalledWith(element.parentElement);
      expect(observe).toHaveBeenCalledWith(unit);
      expect(unit.style.left).toBe('168px');
      const output = jest.fn();
      fixture.debugElement
        .query(By.directive(NumericFieldDirective))
        .injector.get(NumericFieldDirective)
        .numericValueChanged.subscribe(output);
      for (const width of [156, 156, 116, 316]) {
        inputWidth = width;
        callback?.([], {} as ResizeObserver);
        await fixture.whenStable();
        expect(unit.style.left).toBe(`${Math.min(width - 16, 168)}px`);
        expect(element.style.paddingRight).toBe('16px');
        expect(element.style.width).toBe(`${width}px`);
      }
      expect(output).not.toHaveBeenCalled();
      expect(element.value).toBe('1,234,567,890,123,456');
      fixture.componentRef.setInput('unit', null);
      fixture.detectChanges();
      expect(disconnect).toHaveBeenCalledTimes(1);
      fixture.componentRef.setInput('unit', 'EUR');
      fixture.detectChanges();
      expect(observe).toHaveBeenCalledTimes(6);
      fixture.destroy();
      expect(disconnect).toHaveBeenCalledTimes(2);
    } finally {
      fixture.destroy();
      widths.mockRestore();
      window.ResizeObserver = original;
    }
  });

  it.each(['content-box', 'border-box'])('should reserve trailing text space with %s sizing and restore consumer styles', (boxSizing) => {
    const fixture = TestBed.createComponent(UnitPresentationTestComponent);
    fixture.componentRef.setInput('unit', null);
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    element.style.setProperty('width', '75%', 'important');
    element.style.boxSizing = boxSizing;
    element.style.paddingLeft = '7px';
    element.style.setProperty('padding-right', '11px', 'important');
    element.style.borderLeftWidth = '2px';
    element.style.borderRightWidth = '3px';
    const original = element.style.cssText;
    let availableWidth = 156;
    let unitWidth = 23;
    const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function measureWidth(this: HTMLElement) {
      if (this === element) {
        return availableWidth;
      }
      if (this.classList.contains('mad-numeric-field-unit')) {
        return unitWidth;
      }
      return (this.textContent ?? '').length * 8;
    });
    try {
      fixture.componentInstance.control.setValue(1234567890123456);
      fixture.componentRef.setInput('unit', 'kg');
      fixture.detectChanges();
      let unit = fixture.debugElement.query(By.css('.mad-numeric-field-unit')).nativeElement as HTMLSpanElement;
      const checkReservation = () => {
        expect(element.style.boxSizing).toBe('border-box');
        expect(element.style.width).toBe(`${availableWidth + 5}px`);
        expect(element.style.paddingRight).toBe(`${11 + unitWidth}px`);
        const textRight = 2 + availableWidth - 11 - unitWidth;
        expect(unit.style.left).toBe(`${textRight}px`);
      };
      checkReservation();
      // A render without invalidation must neither add padding nor rewrite sizing.
      const write = jest.spyOn(element.style, 'setProperty');
      fixture.detectChanges();
      checkReservation();
      expect(write).not.toHaveBeenCalled();
      write.mockRestore();
      availableWidth = 116;
      // A configuration invalidation uses the same read/write path as resize.
      fixture.componentRef.setInput('unit', 'EUR');
      unitWidth = 31;
      fixture.detectChanges();
      checkReservation();
      fixture.componentInstance.control.setValue(12);
      fixture.detectChanges();
      expect(unit.style.left).toBe('25px');
      expect(element.style.paddingRight).toBe('42px');
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      expect(element.style.cssText).toBe(original);
      fixture.componentInstance.control.setValue(12);
      fixture.detectChanges();
      fixture.componentRef.setInput('textAlign', 'right');
      fixture.detectChanges();
      expect(element.style.cssText).toBe(original);
      fixture.componentRef.setInput('textAlign', 'left');
      fixture.detectChanges();
      fixture.componentRef.setInput('unitPosition', 'left');
      fixture.detectChanges();
      expect(element.style.cssText).toBe(original);
      fixture.componentRef.setInput('unitPosition', 'right');
      fixture.detectChanges();
      unit = fixture.debugElement.query(By.css('.mad-numeric-field-unit')).nativeElement as HTMLSpanElement;
      expect(unit.style.left).toBe('25px');
      fixture.componentRef.setInput('unit', null);
      fixture.detectChanges();
      expect(element.style.cssText).toBe(original);
      fixture.componentRef.setInput('unit', 'kg');
      fixture.detectChanges();
      fixture.destroy();
      expect(element.style.cssText).toBe(original);
      expect(element.style.getPropertyPriority('width')).toBe('important');
      expect(element.style.getPropertyPriority('padding-right')).toBe('important');
    } finally {
      fixture.destroy();
      widths.mockRestore();
    }
  });

  describe.each(['content-box', 'border-box'])('active %s reservation ownership', (boxSizing) => {
    it.each(['width', 'padding', 'both', 'priority'])('should retain consumer %s updates through remeasurement and cleanup', (change) => {
      const fixture = TestBed.createComponent(UnitPresentationTestComponent);
      fixture.componentRef.setInput('unit', null);
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      element.style.setProperty('width', '75%', 'important');
      element.style.boxSizing = boxSizing;
      element.style.setProperty('padding-right', '11px', 'important');
      const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function measureWidth(this: HTMLElement) {
        if (this === element) {
          if (element.style.width === '50%') {
            return 100;
          }
          if (element.style.width === '60%') {
            return 120;
          }
          return Number.parseFloat(element.style.width) > 75 ? Number.parseFloat(element.style.width) : 156;
        }
        return this.classList.contains('mad-numeric-field-unit') ? 23 : (this.textContent ?? '').length * 8;
      });
      const assertDeclarations = (width: string, padding: string, priority = 'important') => {
        expect(element.style.width).toBe(width);
        expect(element.style.getPropertyPriority('width')).toBe('important');
        expect(element.style.paddingRight).toBe(padding);
        expect(element.style.getPropertyPriority('padding-right')).toBe(priority);
        expect(element.style.boxSizing).toBe(boxSizing);
      };
      try {
        fixture.componentRef.setInput('unit', 'kg');
        fixture.detectChanges();
        const priorityOnly = change === 'priority';
        const changesWidth = change === 'width' || change === 'both';
        const changesPadding = change === 'padding' || change === 'both';
        const expectedWidth = priorityOnly ? element.style.width : changesWidth ? '50%' : '75%';
        const expectedPadding = priorityOnly ? element.style.paddingRight : changesPadding ? '20px' : '11px';
        if (changesWidth || priorityOnly) {
          element.style.setProperty('width', priorityOnly ? element.style.width : '50.0%', 'important');
        }
        if (changesPadding || priorityOnly) {
          element.style.setProperty('padding-right', priorityOnly ? element.style.paddingRight : '20.0px', 'important');
        }
        fixture.componentRef.setInput('unit', 'EUR');
        fixture.detectChanges();
        expect(element.style.width).toBe(changesWidth ? '100px' : '156px');
        expect(element.style.paddingRight).toBe(`${Number.parseFloat(expectedPadding) + 23}px`);
        fixture.componentInstance.control.setValue(12);
        fixture.detectChanges();
        expect(element.style.paddingRight).toBe(`${Number.parseFloat(expectedPadding) + 23}px`);
        fixture.componentInstance.control.setValue(null);
        fixture.detectChanges();
        assertDeclarations(expectedWidth, expectedPadding);
        fixture.componentInstance.control.setValue(12);
        fixture.detectChanges();
        element.style.setProperty('width', '60%', 'important');
        element.style.setProperty('padding-right', '30px');
        fixture.componentRef.setInput('unit', null);
        fixture.detectChanges();
        assertDeclarations('60%', '30px', '');
        fixture.componentRef.setInput('unit', 'kg');
        fixture.detectChanges();
        expect(element.style.width).toBe('120px');
        expect(element.style.paddingRight).toBe('53px');
        fixture.componentRef.setInput('textAlign', 'right');
        fixture.detectChanges();
        assertDeclarations('60%', '30px', '');
        fixture.componentRef.setInput('textAlign', 'left');
        fixture.detectChanges();
        fixture.componentRef.setInput('unitPosition', 'left');
        fixture.detectChanges();
        assertDeclarations('60%', '30px', '');
        fixture.componentRef.setInput('unitPosition', 'right');
        fixture.detectChanges();
        element.style.setProperty('padding-right', '40px', 'important');
        fixture.destroy();
        assertDeclarations('60%', '40px');
      } finally {
        fixture.destroy();
        widths.mockRestore();
      }
    });
  });

  it.each(['fill', 'outline'] as const)('should reserve resting %s label space and restore owned styles', (appearance) => {
    const fixture = TestBed.createComponent(UnitPresentationTestComponent);
    fixture.componentRef.setInput('appearance', appearance);
    fixture.componentRef.setInput('textAlign', 'right');
    fixture.detectChanges();
    const formField = fixture.debugElement.query(By.directive(MatFormField)).componentInstance as MatFormField;
    const labelId = formField.getLabelId();
    const label = labelId ? document.getElementById(labelId) : null;
    expect(label).not.toBeNull();
    if (!label) {
      throw new Error('Missing Material label');
    }
    label.style.maxWidth = '90%';
    label.style.translate = '2px';
    const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    let width = 252;
    const widths = jest.spyOn(element, 'clientWidth', 'get').mockImplementation(() => width);
    try {
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('252px');
      expect(formField.floatLabel).toBe('auto');
      expect(fixture.debugElement.query(By.directive(MatInput)).injector.get(MatInput).shouldLabelFloat).toBe(false);
      width = 140;
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('140px');
      element.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('90%');
      element.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('140px');
      fixture.componentRef.setInput('floatLabel', 'always');
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('90%');
      fixture.componentRef.setInput('floatLabel', 'auto');
      fixture.componentRef.setInput('unit', null);
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('90%');
      expect(label.style.translate).toBe('2px');
      fixture.componentRef.setInput('unit', 'EUR');
      fixture.detectChanges();
      expect(label.style.maxWidth).toBe('140px');
      fixture.destroy();
      expect(label.style.maxWidth).toBe('90%');
      expect(label.style.translate).toBe('2px');
    } finally {
      fixture.destroy();
      widths.mockRestore();
    }
  });

  it.each(['fill', 'outline'] as const)('should align a resting %s label with a left unit without accumulating offsets', (appearance) => {
    const fixture = TestBed.createComponent(UnitPresentationTestComponent);
    fixture.componentRef.setInput('appearance', appearance);
    fixture.componentRef.setInput('unitPosition', 'left');
    fixture.detectChanges();
    const formField = fixture.debugElement.query(By.directive(MatFormField)).componentInstance as MatFormField;
    const labelId = formField.getLabelId();
    const label = labelId ? document.getElementById(labelId) : null;
    if (!label) {
      throw new Error('Missing Material label');
    }
    label.style.marginLeft = '3px';
    label.style.translate = '2px';
    const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const inputBounds = jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(64, 0, 200, 24));
    const labelBounds = jest.spyOn(label, 'getBoundingClientRect').mockReturnValue(new DOMRect(32, 0, 200, 24));
    try {
      fixture.componentInstance.control.setValue(null);
      fixture.detectChanges();
      const margin = label.style.marginLeft;
      expect(margin).toBe('calc(35px)');
      expect(label.style.translate).toBe('2px');
      labelBounds.mockReturnValue(new DOMRect(64, 0, 200, 24));
      fixture.detectChanges();
      expect(label.style.marginLeft).toBe(margin);
      element.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      expect(label.style.marginLeft).toBe('3px');
      expect(label.style.translate).toBe('2px');
    } finally {
      fixture.destroy();
      inputBounds.mockRestore();
      labelBounds.mockRestore();
    }
  });

  describe.each(['fill', 'outline'] as const)('Material %s appearance', (appearance) => {
    it.each(['left', 'right'] as const)(
      'should match the %s unit color for initially disabled controls and repeated toggles',
      (position) => {
        const fixture = TestBed.createComponent(UnitPresentationTestComponent);
        fixture.componentRef.setInput('appearance', appearance);
        fixture.componentRef.setInput('unitPosition', position);
        const control = fixture.componentInstance.control;
        control.disable({ emitEvent: false });
        fixture.detectChanges();
        const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
        const unit: HTMLSpanElement = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
        const output = jest.fn();
        fixture.debugElement
          .query(By.directive(NumericFieldDirective))
          .injector.get(NumericFieldDirective)
          .numericValueChanged.subscribe(output);
        const changes = jest.fn();
        control.valueChanges.subscribe(changes);
        const disabledColor = window.getComputedStyle(input).color;
        expect(unit.style.color).toBe(disabledColor);
        for (const disabled of [false, true, false]) {
          if (disabled) {
            control.disable({ emitEvent: false });
          } else {
            control.enable({ emitEvent: false });
          }
          fixture.detectChanges();
          expect(unit.style.color).toBe(window.getComputedStyle(input).color);
          if (disabled) {
            expect(unit.style.color).toBe(disabledColor);
          } else {
            expect(unit.style.color).not.toBe(disabledColor);
          }
        }
        input.style.color = 'rgb(40, 50, 60)';
        fixture.detectChanges();
        expect(unit.style.color).toBe('rgb(40, 50, 60)');
        expect(output).not.toHaveBeenCalled();
        expect(changes).not.toHaveBeenCalled();
        expect(control.value).toBe(1234.567);
        expect(control.pristine).toBe(true);
        expect(control.untouched).toBe(true);
      },
    );
  });

  it('should position initial values and refresh precision, padding and unit changes after rendering', () => {
    const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.tagName === 'INPUT' ? 200 : (this.textContent ?? '').length * 8;
    });
    const offsets = jest.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(function (this: HTMLElement) {
      return this.parentElement;
    });
    const bounds = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return new DOMRect(this.tagName === 'INPUT' ? 32 : 16, 0, 200, 24);
    });
    const fixture = TestBed.createComponent(UnitPresentationTestComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    let unit: HTMLSpanElement = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    const output = jest.fn();
    fixture.debugElement
      .query(By.directive(NumericFieldDirective))
      .injector.get(NumericFieldDirective)
      .numericValueChanged.subscribe(output);
    expect(input.value).toBe('1,234.56');
    expect(unit.style.position).toBe('absolute');
    expect(unit.style.left).toBe('80px');
    fixture.componentRef.setInput('decimalPlaces', 3);
    fixture.detectChanges();
    expect(input.value).toBe('1,234.567');
    expect(unit.style.left).toBe('88px');
    fixture.componentInstance.control.setValue(12.3, { emitEvent: false });
    fixture.componentRef.setInput('autofillDecimals', true);
    fixture.detectChanges();
    expect(input.value).toBe('12.300');
    expect(unit.style.left).toBe('64px');
    fixture.componentInstance.control.setValue(1234567890.123, { emitEvent: false });
    fixture.componentRef.setInput('unit', 'kilograms');
    fixture.detectChanges();
    expect(unit.textContent).toBe('kilograms');
    expect(unit.style.left).toBe('144px');
    fixture.componentRef.setInput('unitPosition', 'left');
    fixture.detectChanges();
    unit = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    expect(unit.style.left).toBe('');
    expect(unit.style.position).toBe('');
    fixture.componentRef.setInput('unitPosition', 'right');
    fixture.detectChanges();
    unit = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    expect(unit.style.left).toBe('144px');
    expect(output).not.toHaveBeenCalled();
    expect(fixture.componentInstance.control.pristine).toBe(true);
    widths.mockRestore();
    offsets.mockRestore();
    bounds.mockRestore();
  });
});
