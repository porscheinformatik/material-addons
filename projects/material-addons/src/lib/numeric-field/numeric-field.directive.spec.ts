import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NumericFieldModule } from './numeric-field.module';
import { NumericFieldDirective } from './numeric-field.directive';
import { NumberFormatService } from './number-format.service';

@Component({
  template: `
    <mat-form-field>
      <input data-testid="simple" matInput [(ngModel)]="value" madNumericField />
    </mat-form-field>

    <input data-testid="plain" [numericValue]="plainValue" (numericValueChange)="plainValue = $event" madNumericField />

    <mat-form-field>
      <mat-label>Reactive initial value</mat-label>
      <input data-testid="reactiveInitialValue" matInput [formControl]="reactiveInitialValue" unit="EUR" madNumericField />
    </mat-form-field>

    <mat-form-field>
      <input
        data-testid="numericValueInitialValue"
        matInput
        [numericValue]="numericValueInitialValue"
        (numericValueChange)="numericValueInitialValue = $event"
        unit="EUR"
        madNumericField
      />
    </mat-form-field>

    <mat-form-field>
      <input data-testid="rightUnit" matInput unit="kg" unitPosition="right" textAlign="left" [(ngModel)]="value" madNumericField />
    </mat-form-field>

    <mat-form-field>
      <input data-testid="leftUnit" matInput unit="kg" unitPosition="left" textAlign="left" [(ngModel)]="value" madNumericField />
    </mat-form-field>

    <mat-form-field>
      <input data-testid="money" matInput [autofillDecimals]="true" [(ngModel)]="moneyValue" madNumericField />
    </mat-form-field>

    <mat-form-field>
      <input data-testid="integer" matInput decimalPlaces="0" [(ngModel)]="integerValue" madNumericField />
    </mat-form-field>

    <mat-form-field>
      <input data-testid="rounded" matInput [roundDisplayValue]="true" [(ngModel)]="roundedValue" madNumericField />
    </mat-form-field>
  `,
  imports: [NumericFieldModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
class TestComponent {
  value?: number;
  plainValue: number | null | undefined = 1234.56;
  reactiveInitialValue = new FormControl<number | null | undefined>(1234.56);
  numericValueInitialValue: number | null | undefined = 1234.56;
  moneyValue?: number;
  integerValue?: number;
  roundedValue?: number;
}

@Component({
  template: `
    <form [formGroup]="form">
      <input madNumericField formControlName="amount" [decimalPlaces]="decimalPlaces()" [autofillDecimals]="autofillDecimals()" />
    </form>
    <input data-testid="combined" madNumericField [formControl]="combinedControl" [numericValue]="externalValue()" />
  `,
  imports: [NumericFieldDirective, ReactiveFormsModule],
})
class DynamicTestComponent {
  readonly decimalPlaces = input(2);
  readonly autofillDecimals = input(false);
  readonly externalValue = input<number | null | undefined>(50);
  readonly combinedControl = new FormControl(10);
  form = new FormGroup({ amount: new FormControl<number | null | undefined>(12, Validators.required) });
}

describe('NumericFieldDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(getDirective('simple')).toBeTruthy();
  });

  it('should set default params properly', () => {
    const debugElement = getDebugElement('simple');
    const input = getInput('simple');
    const directive = debugElement.injector.get(NumericFieldDirective);

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(debugElement.classes['text-right']).toBeTruthy();
    expect(directive.textAlign()).toEqual('right');
    expect(directive.decimalPlaces()).toEqual(2);
    expect(directive.roundValue()).toBeFalsy();
    expect(directive.autofillDecimals()).toBeFalsy();
    expect(directive.unitPosition()).toEqual('right');
  });

  it('should update form value and format display value on input', () => {
    const input = getInput('simple');

    setInputValue(input, '1234.567');

    expect(component.value).toEqual(1234.56);
    expect(input.value).toEqual('1,234.56');
  });

  it('should format initial reactive form values', () => {
    expect(getInput('reactiveInitialValue').value).toEqual('1,234.56');
  });

  it('should apply reactive form disabled state through ControlValueAccessor', () => {
    const input = getInput('reactiveInitialValue');

    expect(input.disabled).toBe(false);

    component.reactiveInitialValue.disable();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);

    component.reactiveInitialValue.enable();
    fixture.detectChanges();

    expect(input.disabled).toBe(false);
  });

  it('should clear the input when a reactive form control is reset', () => {
    const input = getInput('reactiveInitialValue');

    component.reactiveInitialValue.reset();
    fixture.detectChanges();

    expect(input.value).toBe('');
    expect(component.reactiveInitialValue.value).toBeNull();
  });

  it('should float the Material label for initial reactive form values', () => {
    const formField = getInput('reactiveInitialValue').closest('mat-form-field');
    const label = formField?.querySelector('.mdc-floating-label');

    expect(label?.classList.contains('mdc-floating-label--float-above')).toBe(true);
  });

  it('should format initial numericValue input values', () => {
    expect(getInput('numericValueInitialValue').value).toEqual('1,234.56');
  });

  it('should notify MatInput when writing the native input value manually', () => {
    const debugElement = getDebugElement('simple');
    const matInput = debugElement.injector.get(MatInput);
    const stateChangesSpy = jest.spyOn(matInput.stateChanges, 'next');

    getDirective('simple').writeValue(1234.56);

    expect(getInput('simple').value).toEqual('1,234.56');
    expect(stateChangesSpy).toHaveBeenCalled();
  });

  it('should work without matInput', () => {
    expect(getInput('plain').value).toEqual('1,234.56');
  });

  it('should return undefined for an empty value to support required validators', () => {
    const input = getInput('simple');

    setInputValue(input, '');

    expect(component.value).toBeUndefined();
  });

  it('should apply final formatting on blur', () => {
    const input = getInput('money');

    setInputValue(input, '12');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(component.moneyValue).toEqual(12);
    expect(input.value).toEqual('12.00');
  });

  it('should round display value when roundDisplayValue is enabled', () => {
    const input = getInput('rounded');

    getDirective('rounded').writeValue(1234.567);
    fixture.detectChanges();

    expect(input.value).toEqual('1,234.57');
  });

  it('should truncate display value by default', () => {
    const input = getInput('simple');

    getDirective('simple').writeValue(1234.567);
    fixture.detectChanges();

    expect(input.value).toEqual('1,234.56');
  });

  it('should prevent invalid characters', () => {
    const input = getInput('simple');
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });

    const result = input.dispatchEvent(event);

    expect(result).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should prevent decimal separators when decimalPlaces is zero', () => {
    const input = getInput('integer');
    const event = new KeyboardEvent('keydown', { key: '.', cancelable: true });

    const result = input.dispatchEvent(event);

    expect(result).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should prevent too many decimal places', () => {
    const input = getInput('simple');
    input.value = '123.45';
    input.setSelectionRange(6, 6);
    const event = new KeyboardEvent('keydown', { key: '6', cancelable: true });

    const result = input.dispatchEvent(event);

    expect(result).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should allow a negative sign only at the beginning', () => {
    const input = getInput('simple');
    const allowedEvent = new KeyboardEvent('keydown', { key: '-', cancelable: true });

    input.value = '123';
    input.setSelectionRange(0, 0);
    expect(input.dispatchEvent(allowedEvent)).toBe(true);
    expect(allowedEvent.defaultPrevented).toBe(false);

    const blockedEvent = new KeyboardEvent('keydown', { key: '-', cancelable: true });
    input.value = '123';
    input.setSelectionRange(1, 1);
    expect(input.dispatchEvent(blockedEvent)).toBe(false);
    expect(blockedEvent.defaultPrevented).toBe(true);
  });

  it('should remove adjacent digit when deleting a grouping separator', () => {
    const input = getInput('simple');
    input.value = '123,456';
    input.setSelectionRange(3, 3);
    const event = new KeyboardEvent('keydown', { key: 'Delete', cancelable: true });

    input.dispatchEvent(event);
    fixture.detectChanges();

    expect(input.value).toEqual('123,56');
    expect(event.defaultPrevented).toBe(true);
  });

  it('should implement disabled state', () => {
    const input = getInput('simple');
    const directive = getDirective('simple');

    directive.setDisabledState(true);

    expect(input.disabled).toBe(true);
  });

  it('should render a left-positioned unit compatibility span', () => {
    const input = getInput('leftUnit');
    const unit = input.closest('mat-form-field')?.querySelector('.mad-numeric-field-unit');

    expect(unit?.textContent).toEqual('kg');
    expect(unit?.hasAttribute('matprefix')).toBe(true);
    expect(unit?.hasAttribute('mattextprefix')).toBe(true);
  });

  it('should render a right-positioned unit compatibility span', () => {
    const input = getInput('rightUnit');
    const unit = input.closest('mat-form-field')?.querySelector('.mad-numeric-field-unit');

    expect(unit?.textContent).toEqual('kg');
    expect(unit?.hasAttribute('matsuffix')).toBe(true);
    expect(unit?.hasAttribute('mattextsuffix')).toBe(true);
  });

  it('should preserve the output-before-form-change order and duplicate native change notification', () => {
    const input = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    const trace: unknown[] = [];
    getDirective('reactiveInitialValue').numericValueChanged.subscribe((value) => {
      trace.push(['output', value, input.value, control.value, control.touched]);
    });
    control.valueChanges.subscribe((value) => trace.push(['form', value, input.value]));

    input.value = '42';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));

    expect(trace).toEqual([
      ['output', 42, '42', 1234.56, false],
      ['form', 42, '42'],
      ['form', 42, '42'],
    ]);
    expect(control.touched).toBe(true);
    expect(control.dirty).toBe(true);
  });

  it('should preserve reset outputs without marking a control touched or dirty', () => {
    const control = component.reactiveInitialValue;
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    control.setValue(55.555);
    expect(getInput('reactiveInitialValue').value).toBe('55.55');
    expect(control.value).toBe(55.555);
    expect(output).not.toHaveBeenCalled();

    control.reset();
    expect(output).toHaveBeenCalledTimes(1);
    expect(output).toHaveBeenLastCalledWith(NaN);
    expect(control.value).toBeNull();
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    control.reset();
    expect(output).toHaveBeenCalledTimes(1);
  });

  it('should retain repeated NaN outputs for empty input, change, keyup and blur', () => {
    const input = getInput('reactiveInitialValue');
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));
    input.dispatchEvent(new Event('blur'));
    expect(output.mock.calls).toEqual([[NaN], [NaN], [NaN], [NaN]]);
    expect(component.reactiveInitialValue.value).toBeUndefined();
  });

  it('should preserve plain numericValue input timing without a registered form callback', () => {
    const input = getInput('plain');
    input.value = '42.567';
    input.dispatchEvent(new Event('input'));
    expect(component.plainValue).toBe(1234.56);
    expect(input.value).toBe('42.567');
    input.dispatchEvent(new KeyboardEvent('keyup', { key: '7' }));
    expect(component.plainValue).toBe(42.56);
    expect(input.value).toBe('42.56');
  });

  it.each([null, undefined, NaN])('should preserve empty programmatic writes for %s', (value) => {
    const directive = getDirective('reactiveInitialValue');
    const output = jest.fn();
    const change = jest.fn();
    const touched = jest.fn();
    directive.numericValueChanged.subscribe(output);
    directive.registerOnChange(change);
    directive.registerOnTouched(touched);
    directive.writeValue(value);
    directive.writeValue(value);
    expect(getInput('reactiveInitialValue').value).toBe('');
    expect(output.mock.calls).toEqual([[NaN]]);
    expect(change).not.toHaveBeenCalled();
    expect(touched).not.toHaveBeenCalled();
  });

  it.each([
    ['Delete', 3, '123,56', 12356],
    ['Backspace', 4, '12,456', 12456],
  ])('should preserve delayed form propagation for grouping %s', (key, cursor, displayed, value) => {
    const input = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    control.setValue(123456);
    const trace: unknown[] = [];
    getDirective('reactiveInitialValue').numericValueChanged.subscribe((next) => trace.push([next, input.value, control.value]));
    input.setSelectionRange(cursor, cursor);
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    input.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(trace).toEqual([[value, displayed, 123456]]);
    input.dispatchEvent(new KeyboardEvent('keyup', { key }));
    expect(control.value).toBe(123456);
    input.dispatchEvent(new Event('change'));
    expect(control.value).toBe(value);
  });

  it('should apply final display formatting before marking a control touched', () => {
    const input = getInput('money');
    const directive = getDirective('money');
    setInputValue(input, '12');
    const touched = jest.fn(() => input.value);
    directive.registerOnTouched(touched);
    input.dispatchEvent(new Event('blur'));
    expect(touched.mock.results[0].value).toBe('12.00');
  });

  it('should clean up unit and measurement spans on destruction', () => {
    const input = getInput('rightUnit');
    const unit = input.closest('mat-form-field')?.querySelector('.mad-numeric-field-unit');
    const previous = new Set(document.body.querySelectorAll('span'));
    setInputValue(input, '42');
    const measurements = [...document.body.querySelectorAll('span')].filter((span) => !previous.has(span));
    expect(measurements.length).toBeGreaterThan(0);
    fixture.destroy();
    expect(unit?.isConnected).toBe(false);
    expect(measurements.every((span) => !span.isConnected)).toBe(true);
  });

  function getDebugElement(testId: string): DebugElement {
    return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
  }

  function getInput(testId: string): HTMLInputElement {
    return getDebugElement(testId).nativeElement as HTMLInputElement;
  }

  function getDirective(testId: string): NumericFieldDirective {
    return getDebugElement(testId).injector.get(NumericFieldDirective);
  }

  function setInputValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
});

describe('NumericFieldDirective dynamic forms and inputs', () => {
  it.each(['change', 'blur', 'submit'] as const)('should preserve updateOn %s', (updateOn) => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    const control = new FormControl<number | null | undefined>(12, { updateOn, validators: Validators.required });
    fixture.componentInstance.form = new FormGroup({ amount: control });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('form input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    expect(control.value).toBe(updateOn === 'change' ? undefined : 12);
    input.dispatchEvent(new Event('blur'));
    expect(control.value).toBe(updateOn === 'submit' ? 12 : undefined);
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(control.value).toBeUndefined();
    expect(control.hasError('required')).toBe(true);
    expect(control.touched).toBe(true);
  });

  it('should reformat when formatting inputs change', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.componentInstance.form.controls.amount.setValue(12.3456);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('form input');
    expect(input.value).toBe('12.34');
    fixture.componentRef.setInput('decimalPlaces', 1);
    fixture.componentRef.setInput('autofillDecimals', true);
    fixture.detectChanges();
    expect(input.value).toBe('12.3');
    expect(fixture.componentInstance.form.controls.amount.value).toBe(12.3456);
  });

  it('should retain the existing order when CVA and numericValue are both supplied', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="combined"]');
    expect(input.value).toBe('50');
    expect(fixture.componentInstance.combinedControl.value).toBe(10);
    fixture.componentInstance.combinedControl.setValue(20);
    fixture.detectChanges();
    expect(input.value).toBe('20');
    fixture.componentRef.setInput('externalValue', 30);
    fixture.detectChanges();
    expect(input.value).toBe('30');
    expect(fixture.componentInstance.combinedControl.value).toBe(20);
  });

  it('should preserve separator signal dependencies during numericValue formatting', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.componentRef.setInput('externalValue', 1234.5);
    fixture.detectChanges();
    TestBed.inject(NumberFormatService).prepareSeparators('de-DE');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="combined"]');
    // The input effect short-circuits when its numeric value is unchanged.
    expect(input.value).toBe('1,234.5');
    fixture.componentRef.setInput('externalValue', 1234.6);
    fixture.detectChanges();
    expect(input.value).toBe('1.234,6');
  });
});
