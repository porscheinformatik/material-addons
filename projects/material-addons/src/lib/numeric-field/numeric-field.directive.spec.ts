import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NumericFieldModule } from './numeric-field.module';
import { NumericFieldDirective } from './numeric-field.directive';

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
