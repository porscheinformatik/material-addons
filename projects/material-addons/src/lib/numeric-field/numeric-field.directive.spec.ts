import { ChangeDetectorRef, Component, DebugElement, effect, forwardRef, inject, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
      <input
        madNumericField
        formControlName="amount"
        [decimalPlaces]="decimalPlaces()"
        [autofillDecimals]="autofillDecimals()"
        [roundDisplayValue]="roundDisplayValue()"
      />
    </form>
    <input
      data-testid="bindingOnly"
      madNumericField
      [unit]="unit()"
      [unitPosition]="unitPosition()"
      [textAlign]="textAlign()"
      [numericValue]="externalValue()"
      [decimalPlaces]="decimalPlaces()"
      [autofillDecimals]="autofillDecimals()"
      [roundDisplayValue]="roundDisplayValue()"
    />
    <input
      data-testid="combined"
      madNumericField
      [formControl]="combinedControl"
      [numericValue]="externalValue()"
      [decimalPlaces]="decimalPlaces()"
      [autofillDecimals]="autofillDecimals()"
      [roundDisplayValue]="roundDisplayValue()"
    />
  `,
  imports: [NumericFieldDirective, ReactiveFormsModule],
})
class DynamicTestComponent {
  readonly unit = input<string | null>(null);
  readonly unitPosition = input<'left' | 'right'>('right');
  readonly textAlign = input<'left' | 'right'>('right');
  readonly decimalPlaces = input(2);
  readonly autofillDecimals = input(false);
  readonly roundDisplayValue = input(false);
  readonly externalValue = input<number | null | undefined>(50);
  readonly combinedControl = new FormControl(10);
  form = new FormGroup({ amount: new FormControl<number | null | undefined>(12, Validators.required) });
}

@Component({
  template: `
    <input
      madNumericField
      [(numericValue)]="value"
      (numericValueChange)="outputs.push($event)"
      [decimalPlaces]="decimalPlaces()"
      [roundDisplayValue]="roundDisplayValue()"
    />
  `,
  imports: [NumericFieldDirective],
})
class TwoWayBindingTestComponent {
  readonly decimalPlaces = input(2);
  readonly roundDisplayValue = input(false);
  value: number | null | undefined = 1234.567;
  outputs: number[] = [];
}

@Component({
  template: `<input madNumericField [formControl]="control" [decimalPlaces]="decimalPlaces()" />`,
  imports: [NumericFieldDirective, ReactiveFormsModule],
})
class ProgrammaticEffectTestComponent {
  readonly sourceValue = input(1234.567);
  readonly decimalPlaces = input(2);
  readonly control = new FormControl(1234.567);
  private readonly writeEffect = effect(() => this.control.setValue(this.sourceValue(), { emitEvent: false }));
}

@Component({
  selector: 'test-binding-wrapper',
  template: `
    <input
      madNumericField
      [numericValue]="value"
      [decimalPlaces]="decimalPlaces()"
      [disabled]="disabled"
      (numericValueChange)="acceptValue($event)"
      (blur)="touch()"
    />
  `,
  imports: [NumericFieldDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BindingWrapperComponent), multi: true }],
})
class BindingWrapperComponent implements ControlValueAccessor {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  readonly decimalPlaces = input(2);
  value: number | null | undefined;
  disabled = false;
  readonly changes: (number | undefined)[] = [];
  private change: (value: number | undefined) => void = () => {};
  private touched: () => void = () => {};

  writeValue(value: number | null | undefined): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: number | undefined) => void): void {
    this.change = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetectorRef.markForCheck();
  }

  acceptValue(value: number): void {
    // The custom output uses NaN for empty edits; forms require an empty value for required validation.
    this.value = Number.isNaN(value) ? undefined : value;
    this.changes.push(this.value);
    this.change(this.value);
  }

  touch(): void {
    this.touched();
  }
}

@Component({
  selector: 'test-reactive-wrapper',
  template: `<input madNumericField [formControl]="innerControl" [decimalPlaces]="decimalPlaces()" (blur)="touch()" />`,
  imports: [NumericFieldDirective, ReactiveFormsModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReactiveWrapperComponent), multi: true }],
})
class ReactiveWrapperComponent implements ControlValueAccessor {
  readonly decimalPlaces = input(2);
  readonly innerControl = new FormControl<number | null | undefined>(undefined);
  readonly changes: (number | undefined)[] = [];
  private change: (value: number | undefined) => void = () => {};
  private touched: () => void = () => {};

  constructor() {
    this.innerControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      const normalized = value == null || Number.isNaN(value) ? undefined : value;
      this.changes.push(normalized);
      this.change(normalized);
    });
  }

  writeValue(value: number | null | undefined): void {
    this.innerControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: number | undefined) => void): void {
    this.change = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(disabled: boolean): void {
    if (disabled) {
      this.innerControl.disable({ emitEvent: false });
    } else {
      this.innerControl.enable({ emitEvent: false });
    }
  }

  touch(): void {
    this.touched();
  }
}

@Component({
  template: `
    <form [formGroup]="form">
      @if (wrapper() === 'binding') {
        <test-binding-wrapper formControlName="amount" [decimalPlaces]="decimalPlaces()" />
      } @else {
        <test-reactive-wrapper formControlName="amount" [decimalPlaces]="decimalPlaces()" />
      }
    </form>
  `,
  imports: [BindingWrapperComponent, ReactiveWrapperComponent, ReactiveFormsModule],
})
class WrappedTestComponent {
  readonly wrapper = input<'binding' | 'reactive'>('binding');
  readonly decimalPlaces = input(2);
  form = new FormGroup({ amount: new FormControl<number | null | undefined>(1234.567, Validators.required) });
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

  it('should keep reset silent without marking a control touched or dirty', () => {
    const control = component.reactiveInitialValue;
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    control.setValue(55.555);
    expect(getInput('reactiveInitialValue').value).toBe('55.55');
    expect(control.value).toBe(55.555);
    expect(output).not.toHaveBeenCalled();

    control.reset();
    expect(output).not.toHaveBeenCalled();
    expect(control.value).toBeNull();
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    control.reset();
    expect(output).not.toHaveBeenCalled();
  });

  it('should notify empty input and change without repeating outputs on unchanged keyup and blur', () => {
    const input = getInput('reactiveInitialValue');
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));
    input.dispatchEvent(new Event('blur'));
    expect(output.mock.calls).toEqual([[NaN], [NaN]]);
    expect(component.reactiveInitialValue.value).toBeUndefined();
  });

  it.each(['input', 'change'])('should process %s immediately without a registered form callback', (eventType) => {
    const input = getInput('plain');
    const output = jest.fn();
    getDirective('plain').numericValueChanged.subscribe(output);
    input.value = '42.567';
    input.dispatchEvent(new Event(eventType));
    expect(component.plainValue).toBe(42.56);
    expect(input.value).toBe('42.56');
    expect(output.mock.calls).toEqual([[42.56]]);
  });

  it.each(['keyup', 'blur'])('should accept an unhandled text edit on %s without repeating it', (eventType) => {
    const input = getInput('plain');
    const output = jest.fn();
    getDirective('plain').numericValueChanged.subscribe(output);
    input.value = '42.567';
    const event = () => (eventType === 'keyup' ? new KeyboardEvent('keyup', { key: '7' }) : new Event('blur'));
    input.dispatchEvent(event());
    input.dispatchEvent(event());
    expect(input.value).toBe('42.56');
    expect(component.plainValue).toBe(42.56);
    expect(output.mock.calls).toEqual([[42.56]]);
  });

  it('should retain repeated empty edit outputs without Angular forms', () => {
    const input = getInput('plain');
    const output = jest.fn();
    getDirective('plain').numericValueChanged.subscribe(output);
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    expect(input.value).toBe('');
    expect(component.plainValue).toBeNaN();
    expect(output.mock.calls).toEqual([[NaN], [NaN]]);
  });

  it.each([null, undefined, NaN])('should keep empty programmatic writes silent for %s', (value) => {
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
    expect(output).not.toHaveBeenCalled();
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

  it('should update unit and alignment bindings and clean up removed units', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="bindingOnly"]');
    fixture.componentRef.setInput('unit', 'kg');
    fixture.componentRef.setInput('unitPosition', 'left');
    fixture.componentRef.setInput('textAlign', 'left');
    fixture.detectChanges();
    let unit: HTMLSpanElement = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    expect(unit.textContent).toBe('kg');
    expect(unit.hasAttribute('matprefix')).toBe(true);
    expect(input.classList.contains('text-right')).toBe(false);
    fixture.componentRef.setInput('unit', 'EUR');
    fixture.componentRef.setInput('unitPosition', 'right');
    fixture.componentRef.setInput('textAlign', 'right');
    fixture.detectChanges();
    expect(unit.isConnected).toBe(false);
    unit = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    expect(unit.textContent).toBe('EUR');
    expect(unit.hasAttribute('matsuffix')).toBe(true);
    expect(input.classList.contains('text-right')).toBe(true);
    fixture.componentRef.setInput('unit', null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.mad-numeric-field-unit')).toBeNull();
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

  describe.each(['form input', '[data-testid="bindingOnly"]'])('formatting %s', (selector) => {
    it('should restore programmatic precision without notifying consumers', () => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      const control = fixture.componentInstance.form.controls.amount;
      const formChanges = jest.fn();
      control.valueChanges.subscribe(formChanges);
      expect(input.value).toBe('1,234.56');

      for (const [places, display] of [
        [3, '1,234.567'],
        [1, '1,234.5'],
        [3, '1,234.567'],
      ] as const) {
        fixture.componentRef.setInput('decimalPlaces', places);
        fixture.detectChanges();
        expect(input.value).toBe(display);
      }

      expect(control.value).toBe(1234.567);
      expect(fixture.componentInstance.externalValue()).toBe(1234.567);
      expect(control.pristine).toBe(true);
      expect(control.untouched).toBe(true);
      expect(output).not.toHaveBeenCalled();
      expect(formChanges).not.toHaveBeenCalled();
    });

    it.each([1234.567, -1234.567])('should render rounding and simultaneous padding/precision changes from %s', (value) => {
      const fixture = createFormattingFixture(value);
      const { input, output } = observeInput(fixture, selector);
      const sign = value < 0 ? '-' : '';
      fixture.componentRef.setInput('roundDisplayValue', true);
      fixture.detectChanges();
      expect(input.value).toBe(`${sign}1,234.57`);
      fixture.componentRef.setInput('roundDisplayValue', false);
      fixture.componentRef.setInput('decimalPlaces', 4);
      fixture.componentRef.setInput('autofillDecimals', true);
      fixture.detectChanges();
      expect(input.value).toBe(`${sign}1,234.5670`);
      expect(fixture.componentInstance.form.controls.amount.value).toBe(value);
      expect(output).not.toHaveBeenCalled();
    });

    it('should retain only the latest precision-limited user edit', () => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      input.value = '42.567';
      input.dispatchEvent(new Event('input'));
      expect(input.value).toBe('42.56');
      expect(output.mock.calls).toEqual([[42.56]]);

      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.componentRef.setInput('autofillDecimals', true);
      fixture.detectChanges();
      expect(input.value).toBe('42.560');
      expect(output.mock.calls).toEqual([[42.56]]);
      if (selector === 'form input') {
        expect(fixture.componentInstance.form.controls.amount.value).toBe(42.56);
      }
    });

    it('should retain full precision through focus and blur without an edit', () => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      input.dispatchEvent(new Event('focus'));
      input.dispatchEvent(new Event('blur'));
      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.detectChanges();
      expect(input.value).toBe('1,234.567');
      expect(fixture.componentInstance.form.controls.amount.value).toBe(1234.567);
      expect(output).not.toHaveBeenCalled();
    });

    it('should accept a native input event even when its text matches the current display', () => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      expect(input.value).toBe('1,234.56');
      input.dispatchEvent(new Event('input'));
      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.detectChanges();
      expect(input.value).toBe('1,234.56');
      expect(output.mock.calls).toEqual([[1234.56]]);
    });

    it.each([1234.56, 1234.569])('should retain a new external value %s with the same display', (value) => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      if (selector === 'form input') {
        fixture.componentInstance.form.controls.amount.setValue(value);
      } else {
        fixture.componentRef.setInput('externalValue', value);
      }
      fixture.detectChanges();
      expect(input.value).toBe('1,234.56');
      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.detectChanges();
      expect(input.value).toBe(value === 1234.56 ? '1,234.56' : '1,234.569');
      expect(output).not.toHaveBeenCalled();
    });

    it.each([null, undefined, NaN])('should keep formatting changes silent after clearing with %s', (value) => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      if (selector === 'form input') {
        fixture.componentInstance.form.controls.amount.setValue(value);
      } else {
        fixture.componentRef.setInput('externalValue', value);
      }
      fixture.detectChanges();
      expect(input.value).toBe('');
      expect(output).not.toHaveBeenCalled();
      input.dispatchEvent(new Event('focus'));
      input.dispatchEvent(new Event('blur'));
      expect(output).not.toHaveBeenCalled();
      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.componentRef.setInput('roundDisplayValue', true);
      fixture.componentRef.setInput('autofillDecimals', true);
      fixture.detectChanges();
      expect(input.value).toBe('');
      expect(output).not.toHaveBeenCalled();
    });

    it('should react to separator-only changes without accepting or notifying a value change', () => {
      const fixture = createFormattingFixture();
      const { input, output } = observeInput(fixture, selector);
      const control = fixture.componentInstance.form.controls.amount;
      const formChanges = jest.fn();
      control.valueChanges.subscribe(formChanges);
      const service = TestBed.inject(NumberFormatService);

      service.prepareSeparators('de-AT');
      fixture.detectChanges();
      expect(input.value).toBe('1.234,56');
      expect(control.value).toBe(1234.567);
      expect(control.pristine).toBe(true);
      expect(control.untouched).toBe(true);
      input.dispatchEvent(new Event('blur'));
      expect(output).not.toHaveBeenCalled();
      expect(formChanges).not.toHaveBeenCalled();

      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.detectChanges();
      expect(input.value).toBe('1.234,567');
      service.prepareSeparators('en-US');
      fixture.detectChanges();
      expect(input.value).toBe('1,234.567');
      expect(output).not.toHaveBeenCalled();
      expect(formChanges).not.toHaveBeenCalled();

      input.value = '42.567';
      input.dispatchEvent(new Event('input'));
      service.prepareSeparators('de-DE');
      fixture.detectChanges();
      expect(input.value).toBe('42,567');
      expect(output.mock.calls).toEqual([[42.567]]);
      if (selector === 'form input') {
        expect(control.value).toBe(42.567);
        expect(formChanges.mock.calls).toEqual([[42.567]]);
      }
    });
  });

  it.each([null, undefined, NaN])('should preserve an ordinary parent empty value %s without feedback', (value) => {
    const fixture = TestBed.createComponent(TwoWayBindingTestComponent);
    fixture.detectChanges();
    fixture.componentInstance.value = value;
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(fixture.debugElement.query(By.directive(NumericFieldDirective)).injector.get(NumericFieldDirective).numericValue()).toBe(value);
    expect(input.value).toBe('');
    expect(fixture.componentInstance.value).toBe(value);
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(value);
    expect(fixture.componentInstance.outputs).toEqual([]);
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeNaN();
    expect(fixture.componentInstance.outputs).toEqual([NaN]);
  });

  describe.each([false, true])('two-way binding with rounding %s', (rounding) => {
    it.each(['input', 'change'])('should notify an accepted same-display %s edit and keep the model consistent', (eventType) => {
      const fixture = TestBed.createComponent(TwoWayBindingTestComponent);
      fixture.detectChanges();
      fixture.componentRef.setInput('decimalPlaces', 1);
      fixture.componentRef.setInput('roundDisplayValue', rounding);
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      const acceptedValue = rounding ? 1234.6 : 1234.5;
      expect(input.value).toBe(rounding ? '1,234.6' : '1,234.5');
      expect(fixture.componentInstance.value).toBe(1234.567);
      expect(fixture.componentInstance.outputs).toEqual([]);

      input.value = String(acceptedValue);
      input.dispatchEvent(new Event(eventType));
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe(acceptedValue);
      expect(fixture.componentInstance.outputs).toEqual([acceptedValue]);
      input.dispatchEvent(new Event(eventType));
      fixture.detectChanges();
      expect(fixture.componentInstance.outputs).toEqual([acceptedValue]);

      fixture.componentRef.setInput('decimalPlaces', 3);
      fixture.detectChanges();
      expect(input.value).toBe(rounding ? '1,234.6' : '1,234.5');
      expect(fixture.componentInstance.value).toBe(acceptedValue);
      expect(fixture.componentInstance.outputs).toEqual([acceptedValue]);
    });
  });

  it('should not replay an unchanged numericValue binding after a newer CVA write', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.detectChanges();
    const { input, output } = observeInput(fixture, '[data-testid="combined"]');
    fixture.componentInstance.combinedControl.setValue(1234.567);
    fixture.componentRef.setInput('decimalPlaces', 3);
    fixture.detectChanges();
    expect(input.value).toBe('1,234.567');
    expect(fixture.componentInstance.combinedControl.value).toBe(1234.567);
    expect(fixture.componentInstance.externalValue()).toBe(50);
    expect(output).not.toHaveBeenCalled();
  });

  it('should not add formatting dependencies to a consumer effect writing a form value', () => {
    const fixture = TestBed.createComponent(ProgrammaticEffectTestComponent);
    fixture.detectChanges();
    fixture.componentRef.setInput('sourceValue', 1234.5678);
    fixture.detectChanges();
    const { input, output } = observeInput(fixture, 'input');
    input.value = '42.567';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    fixture.componentRef.setInput('decimalPlaces', 3);
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe(42.56);
    expect(input.value).toBe('42.56');
    expect(output.mock.calls).toEqual([[42.56]]);
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

  it('should reformat an unchanged numericValue binding when separators change', () => {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.componentRef.setInput('externalValue', 1234.5);
    fixture.detectChanges();
    TestBed.inject(NumberFormatService).prepareSeparators('de-DE');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="combined"]');
    expect(input.value).toBe('1.234,5');
    fixture.componentRef.setInput('externalValue', 1234.6);
    fixture.detectChanges();
    expect(input.value).toBe('1.234,6');
  });

  function createFormattingFixture(value = 1234.567): ComponentFixture<DynamicTestComponent> {
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.componentInstance.form.controls.amount.setValue(value);
    fixture.componentRef.setInput('externalValue', value);
    fixture.detectChanges();
    return fixture;
  }

  function observeInput(fixture: ComponentFixture<DynamicTestComponent>, selector: string) {
    const debugElement = fixture.debugElement.query(By.css(selector));
    const input = debugElement.nativeElement as HTMLInputElement;
    const output = jest.fn();
    debugElement.injector.get(NumericFieldDirective).numericValueChanged.subscribe(output);
    return { input, output };
  }
});

describe.each(['binding', 'reactive'] as const)('NumericFieldDirective in a %s CVA wrapper', (wrapper) => {
  function createWrapper(updateOn: 'change' | 'blur' | 'submit' = 'change') {
    const fixture = TestBed.createComponent(WrappedTestComponent);
    fixture.componentRef.setInput('wrapper', wrapper);
    const control = new FormControl<number | null | undefined>(1234.567, { updateOn, validators: Validators.required });
    fixture.componentInstance.form = new FormGroup({ amount: control });
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const wrapperInstance =
      wrapper === 'binding'
        ? (fixture.debugElement.query(By.directive(BindingWrapperComponent)).componentInstance as BindingWrapperComponent)
        : (fixture.debugElement.query(By.directive(ReactiveWrapperComponent)).componentInstance as ReactiveWrapperComponent);
    const output = jest.fn();
    fixture.debugElement
      .query(By.directive(NumericFieldDirective))
      .injector.get(NumericFieldDirective)
      .numericValueChanged.subscribe(output);
    return { fixture, control, input, changes: wrapperInstance.changes, output };
  }

  it('should keep initial values, successive programmatic writes and resets free of feedback', () => {
    const { fixture, control, input, changes, output } = createWrapper();
    const formChanges = jest.fn();
    control.valueChanges.subscribe(formChanges);
    expect(input.value).toBe('1,234.56');
    expect(control.value).toBe(1234.567);
    expect(changes).toEqual([]);

    control.setValue(55.555);
    control.setValue(66.666);
    fixture.detectChanges();
    expect(input.value).toBe('66.66');
    expect(control.value).toBe(66.666);
    expect(formChanges.mock.calls).toEqual([[55.555], [66.666]]);
    control.setValue(77.777, { emitEvent: false });
    fixture.detectChanges();
    expect(input.value).toBe('77.77');
    expect(formChanges).toHaveBeenCalledTimes(2);

    control.reset();
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(control.value).toBeNull();
    expect(control.hasError('required')).toBe(true);
    expect(control.pristine).toBe(true);
    expect(control.untouched).toBe(true);
    control.reset(null, { emitEvent: false });
    fixture.detectChanges();
    expect(formChanges.mock.calls).toEqual([[55.555], [66.666], [null]]);

    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(control.value).toBeNull();
    expect(control.pristine).toBe(true);
    expect(control.touched).toBe(true);
    expect(changes).toEqual([]);
    expect(output).not.toHaveBeenCalled();
    expect(formChanges).toHaveBeenCalledTimes(3);
  });

  it('should retain external precision through formatting and blur, then accept actual edits', () => {
    const { fixture, control, input, changes, output } = createWrapper();
    input.dispatchEvent(new Event('blur'));
    fixture.componentRef.setInput('decimalPlaces', 3);
    fixture.detectChanges();
    expect(input.value).toBe('1,234.567');
    expect(control.value).toBe(1234.567);
    expect(changes).toEqual([]);
    expect(output).not.toHaveBeenCalled();
    input.value = '42.5678';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('42.567');
    expect(control.value).toBe(42.567);
    expect(control.dirty).toBe(true);
    expect(changes).toEqual([42.567]);
    expect(output.mock.calls).toEqual([[42.567]]);
  });

  it('should bridge disabled state without propagating changes', () => {
    const { fixture, control, input, changes, output } = createWrapper();
    control.disable({ emitEvent: false });
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
    control.enable({ emitEvent: false });
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
    expect(changes).toEqual([]);
    expect(output).not.toHaveBeenCalled();
  });

  it.each(['change', 'blur', 'submit'] as const)('should normalize empty edits and preserve outer updateOn %s', (updateOn) => {
    const { fixture, control, input, changes, output } = createWrapper(updateOn);
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(control.value).toBe(updateOn === 'change' ? undefined : 1234.567);
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(control.value).toBe(updateOn === 'submit' ? 1234.567 : undefined);
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(control.value).toBeUndefined();
    expect(control.hasError('required')).toBe(true);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(true);
    expect(changes).toEqual([undefined]);
    expect(output.mock.calls).toEqual([[NaN]]);
  });
});
