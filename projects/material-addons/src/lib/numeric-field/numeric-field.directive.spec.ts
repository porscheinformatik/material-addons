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
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
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
      [disabled]="disabled()"
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
  readonly disabled = input(false);
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
      [autofillDecimals]="autofillDecimals()"
      [decimalPlaces]="decimalPlaces()"
      [roundDisplayValue]="roundDisplayValue()"
    />
  `,
  imports: [NumericFieldDirective],
})
class TwoWayBindingTestComponent {
  readonly autofillDecimals = input(false);
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

  it.each([
    ['Delete', 1, 2, 1, '134.56', 1934.56, 3],
    ['Backspace', 2, 1, 0, '234.56', 9234.56, 1],
  ])(
    'should retain the grouping %s caret through keyup and continued editing',
    (key, before, intermediate, after, display, value, finalCursor) => {
      const element = getInput('reactiveInitialValue');
      const control = component.reactiveInitialValue;
      const changes = jest.fn();
      control.valueChanges.subscribe(changes);
      element.setSelectionRange(before, before);
      element.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
      expect([element.selectionStart, element.selectionEnd]).toEqual([intermediate, intermediate]);
      fixture.detectChanges();
      element.dispatchEvent(new KeyboardEvent('keyup', { key }));
      fixture.detectChanges();
      expect(element.value).toBe(display);
      expect([element.selectionStart, element.selectionEnd]).toEqual([after, after]);
      expect(changes).toHaveBeenCalledTimes(1);
      const digit = new KeyboardEvent('keydown', { key: '9', cancelable: true });
      element.dispatchEvent(digit);
      expect(digit.defaultPrevented).toBe(false);
      element.setRangeText('9', after, after, 'end');
      element.dispatchEvent(new Event('input'));
      element.dispatchEvent(new KeyboardEvent('keyup', { key: '9' }));
      expect(control.value).toBe(value);
      expect([element.selectionStart, element.selectionEnd]).toEqual([finalCursor, finalCursor]);
      expect(changes).toHaveBeenCalledTimes(2);
    },
  );

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

  describe.each(['readonly', 'disabled'])('a %s input', (state) => {
    it.each([
      ['Delete', 3],
      ['Backspace', 4],
    ] as const)('should leave grouping text and values unchanged on %s', (key, cursor) => {
      const input = getInput('reactiveInitialValue');
      const control = component.reactiveInitialValue;
      control.setValue(123456);
      if (state === 'readonly') {
        input.readOnly = true;
      } else {
        control.disable({ emitEvent: false });
      }
      const output = jest.fn();
      getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
      const changes = jest.fn();
      control.valueChanges.subscribe(changes);
      input.setSelectionRange(cursor, cursor);
      input.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key }));
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(input.value).toBe('123,456');
      expect(control.value).toBe(123456);
      expect(control.pristine).toBe(true);
      expect(output).not.toHaveBeenCalled();
      expect(changes).not.toHaveBeenCalled();
    });

    it.each(['input', 'change'])('should ignore synthetic %s edits while guarded', (eventType) => {
      const element = getInput('reactiveInitialValue');
      const control = component.reactiveInitialValue;
      if (state === 'readonly') {
        element.readOnly = true;
      } else {
        control.disable({ emitEvent: false });
      }
      const output = jest.fn();
      getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
      const changes = jest.fn();
      control.valueChanges.subscribe(changes);
      element.value = '42';
      element.dispatchEvent(new Event(eventType));
      element.dispatchEvent(new KeyboardEvent('keyup', { key: '2' }));
      element.dispatchEvent(new Event('blur'));
      expect(control.value).toBe(1234.56);
      expect(control.pristine).toBe(true);
      expect(output).not.toHaveBeenCalled();
      expect(changes).not.toHaveBeenCalled();
    });
  });

  it('should refresh a trailing unit after programmatic writes and clearing', () => {
    const input = getInput('rightUnit');
    const unit = input.closest('mat-form-field')?.querySelector<HTMLSpanElement>('.mad-numeric-field-unit');
    expect(unit).toBeDefined();
    const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this === input ? 200 : (this.textContent ?? '').length * 8;
    });
    const directive = getDirective('rightUnit');
    const output = jest.fn();
    directive.numericValueChanged.subscribe(output);
    directive.writeValue(12);
    expect(input.value).toBe('12');
    fixture.detectChanges();
    expect(unit?.style.position).toBe('absolute');
    expect(unit?.style.left).toBe('16px');
    directive.writeValue(123456);
    expect(input.value).toBe('123,456');
    fixture.detectChanges();
    expect(unit?.style.left).toBe('56px');
    directive.writeValue(null);
    fixture.detectChanges();
    expect(unit?.style.display).toBe('none');
    directive.writeValue(1234.567);
    fixture.detectChanges();
    expect(unit?.style.left).toBe('64px');
    expect(output).not.toHaveBeenCalled();
    widths.mockRestore();
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
  ])('should propagate grouping %s once before keyup without a native change event', (key, cursor, displayed, value) => {
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
    expect(control.value).toBe(value);
    expect(control.dirty).toBe(true);
    expect(control.untouched).toBe(true);
    const changes = jest.fn();
    control.valueChanges.subscribe(changes);
    input.dispatchEvent(new KeyboardEvent('keyup', { key }));
    input.dispatchEvent(new Event('blur'));
    expect(control.value).toBe(value);
    expect(control.touched).toBe(true);
    expect(changes).not.toHaveBeenCalled();
  });

  it.each(['keyup', 'blur'])('should send unhandled %s edits to forms exactly once', (eventType) => {
    const element = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    const changes = jest.fn();
    const trace: unknown[] = [];
    getDirective('reactiveInitialValue').numericValueChanged.subscribe((value) => trace.push(['output', value]));
    control.valueChanges.subscribe((value) => {
      changes(value);
      trace.push(['form', value]);
    });
    element.value = '42.567';
    const event = () => (eventType === 'keyup' ? new KeyboardEvent('keyup', { key: '7' }) : new Event('blur'));
    element.dispatchEvent(event());
    element.dispatchEvent(event());
    expect(control.value).toBe(42.56);
    expect(control.dirty).toBe(true);
    expect(control.touched).toBe(eventType === 'blur');
    expect(changes.mock.calls).toEqual([[42.56]]);
    expect(trace).toEqual([
      ['output', 42.56],
      ['form', 42.56],
    ]);
  });

  it.each(['setValue', 'reset'] as const)('should synchronously restore equal numeric text on %s', (method) => {
    const element = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    control.setValue(12);
    element.value = '12.';
    element.setSelectionRange(3, 3);
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe('12.');
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    const changes = jest.fn();
    control.valueChanges.subscribe(changes);
    control[method](12, { emitEvent: false });
    expect(element.value).toBe('12');
    expect(control.value).toBe(12);
    if (method === 'reset') {
      expect(control.pristine).toBe(true);
      expect(control.untouched).toBe(true);
    }
    expect(output).not.toHaveBeenCalled();
    expect(changes).not.toHaveBeenCalled();
  });

  it.each([Infinity, -Infinity, NaN])('should render programmatic %s empty without changing the supplied model', (value) => {
    const element = getInput('reactiveInitialValue');
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    component.reactiveInitialValue.setValue(value, { emitEvent: false });
    expect(element.value).toBe('');
    element.dispatchEvent(new Event('blur'));
    expect(component.reactiveInitialValue.value).toBe(value);
    expect(component.reactiveInitialValue.pristine).toBe(true);
    expect(output).not.toHaveBeenCalled();
  });

  it.each(['9'.repeat(310), 'Infinity', '-Infinity', 'NaN'])('should normalize nonfinite user text to an empty forms value', (text) => {
    const element = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    control.addValidators((value) => Validators.required(value));
    const output = jest.fn();
    getDirective('reactiveInitialValue').numericValueChanged.subscribe(output);
    element.value = text;
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe('');
    expect(control.value).toBeUndefined();
    expect(control.hasError('required')).toBe(true);
    expect(output.mock.calls).toEqual([[NaN]]);
  });

  it.each([
    ['123.,456', 4, '123.45', 4],
    ['1234,456', 4, '1,234,456', 5],
    ['123,9456', 5, '1,239,456', 5],
    ['12,456', 2, '12,456', 2],
    ['1,245.67', 4, '1,245.67', 4],
    ['-.456', 2, '-.45', 2],
  ] as const)('should preserve the edited prefix caret for %s', (raw, cursor, formatted, expectedCursor) => {
    const element = getInput('reactiveInitialValue');
    element.value = raw;
    element.setSelectionRange(cursor, cursor);
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe(formatted);
    expect(element.selectionStart).toBe(expectedCursor);
    expect(element.selectionEnd).toBe(expectedCursor);
  });

  it.each([
    ['-1,234.56', 0, 1, '-', '-1,234.56', 1],
    ['12,345.67', 2, 7, '.', '12.67', 3],
    ['-1,234.56', 0, 7, '-', '-56', 1],
    ['-1,234.56', 0, 7, '.', '.56', 1],
    ['123,456.78', 2, 6, '9', '1,296.78', 4],
  ] as const)('should preserve the caret when replacing %s [%s,%s) with %s', (text, start, end, replacement, formatted, cursor) => {
    const element = getInput('reactiveInitialValue');
    const control = component.reactiveInitialValue;
    control.setValue(Number(text.replaceAll(',', '')));
    element.setSelectionRange(start, end, 'backward');
    const event = new KeyboardEvent('keydown', { key: replacement, cancelable: true });
    expect(element.dispatchEvent(event)).toBe(true);
    element.setRangeText(replacement, start, end, 'end');
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe(formatted);
    expect(element.selectionStart).toBe(cursor);
    expect(element.selectionEnd).toBe(cursor);
    expect(control.value).toBe(Number(formatted.replaceAll(',', '')));
    expect(control.dirty).toBe(true);
  });

  it('should preserve a backward selection range while grouping and truncating', () => {
    const element = getInput('reactiveInitialValue');
    element.value = '-1234.567';
    element.setSelectionRange(1, 5, 'backward');
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe('-1,234.56');
    expect(element.selectionStart).toBe(1);
    expect(element.selectionEnd).toBe(6);
    expect(element.selectionDirection).toBe('backward');
  });

  it.each([
    ['00012', 3, 5, '12', 0, 2],
    ['.45', 1, 3, '0.45', 2, 4],
    ['-.45', 2, 4, '-0.45', 3, 5],
  ] as const)('should retain selected digits in final normalization of %s', (raw, start, end, display, mappedStart, mappedEnd) => {
    const element = getInput('reactiveInitialValue');
    element.value = raw;
    element.setSelectionRange(start, end, 'backward');
    element.dispatchEvent(new Event('blur'));
    expect(element.value).toBe(display);
    expect(element.selectionStart).toBe(mappedStart);
    expect(element.selectionEnd).toBe(mappedEnd);
    expect(element.selectionDirection).toBe('backward');
  });

  it.each([
    ['1e3', 1, 2, '1,000', 2, 4],
    ['1e3', 0, 3, '1,000', 0, 5],
    ['1e3', 2, 2, '1,000', 4, 4],
    ['-1e3', 2, 3, '-1,000', 3, 5],
    ['1.2e3', 3, 4, '1,200', 3, 4],
  ] as const)('should map an atomic exponent selection in %s deterministically', (raw, start, end, display, mappedStart, mappedEnd) => {
    const element = getInput('reactiveInitialValue');
    element.value = raw;
    element.setSelectionRange(start, end, 'backward');
    element.dispatchEvent(new Event('input'));
    expect(element.value).toBe(display);
    expect(element.selectionStart).toBe(mappedStart);
    expect(element.selectionEnd).toBe(mappedEnd);
    expect(element.selectionDirection).toBe('backward');
    element.dispatchEvent(new KeyboardEvent('keyup', { key: '3' }));
    expect(element.selectionStart).toBe(mappedStart);
    expect(element.selectionEnd).toBe(mappedEnd);
    expect(element.selectionDirection).toBe('backward');
  });

  it.each(['00012', '.45', '-.45', '1e3', '-1.2e3'])('should retain a full backward selection after normalizing %s', (raw) => {
    const element = getInput('reactiveInitialValue');
    element.value = raw;
    element.setSelectionRange(0, raw.length, 'backward');
    element.dispatchEvent(new Event('blur'));
    expect(element.selectionStart).toBe(0);
    expect(element.selectionEnd).toBe(element.value.length);
    expect(element.selectionDirection).toBe('backward');
  });

  it.each([
    ['-123.45', 0, 1, '-', true],
    ['-123.45', 0, 0, '-', false],
    ['123.45', 0, 3, '.', false],
    ['123.45', 0, 4, '.', true],
    ['-123.45', 0, 5, '.', true],
  ] as const)('should treat selection end as exclusive for %s [%s,%s) replacing %s', (text, start, end, key, allowed) => {
    const element = getInput('reactiveInitialValue');
    element.value = text;
    element.setSelectionRange(start, end);
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    expect(element.dispatchEvent(event)).toBe(allowed);
    expect(event.defaultPrevented).toBe(!allowed);
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
    setInputValue(input, '42');
    const measurements = [...document.body.querySelectorAll('span')].filter(
      (span) => span.style.visibility === 'hidden' && span.style.whiteSpace === 'nowrap',
    );
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

describe('NumericFieldDirective unit presentation', () => {
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

  it('should refresh binding-only units after writes and native disabled bindings', () => {
    const widths = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function (this: HTMLElement) {
      return this.tagName === 'INPUT' ? 200 : (this.textContent ?? '').length * 8;
    });
    const fixture = TestBed.createComponent(DynamicTestComponent);
    fixture.componentRef.setInput('unit', 'kg');
    fixture.componentRef.setInput('textAlign', 'left');
    fixture.componentRef.setInput('externalValue', 12);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-testid="bindingOnly"]');
    const unit: HTMLSpanElement = fixture.nativeElement.querySelector('.mad-numeric-field-unit');
    const output = jest.fn();
    fixture.debugElement
      .query(By.css('[data-testid="bindingOnly"]'))
      .injector.get(NumericFieldDirective)
      .numericValueChanged.subscribe(output);
    expect(unit.style.left).toBe('19px');
    fixture.componentRef.setInput('externalValue', 123456);
    fixture.detectChanges();
    expect(unit.style.left).toBe('59px');
    input.style.color = 'rgb(60, 70, 80)';
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
    expect(unit.style.color).toBe('rgb(60, 70, 80)');
    fixture.componentRef.setInput('disabled', false);
    input.style.color = 'rgb(10, 20, 30)';
    fixture.detectChanges();
    expect(input.disabled).toBe(false);
    expect(unit.style.color).toBe('rgb(10, 20, 30)');
    expect(output).not.toHaveBeenCalled();
    widths.mockRestore();
  });
});

describe('NumericFieldDirective dynamic forms and inputs', () => {
  describe.each(['en-US', 'de-DE'])('partial-entry blur in %s', (locale) => {
    it.each([null, undefined, NaN, 1234.567])('should preserve padded external %s through unedited blur', (value) => {
      const fixture = TestBed.createComponent(TwoWayBindingTestComponent);
      TestBed.inject(NumberFormatService).prepareSeparators(locale);
      fixture.componentInstance.value = value;
      fixture.componentRef.setInput('autofillDecimals', true);
      fixture.detectChanges();
      const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      const displayed = element.value;
      element.dispatchEvent(new Event('focus'));
      element.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(fixture.componentInstance.value).toBe(value);
      expect(fixture.componentInstance.outputs).toEqual([]);
      expect(element.value).toBe(displayed);
      expect(displayed).toBe(Number.isFinite(value) ? (locale === 'en-US' ? '1,234.56' : '1.234,56') : '');
    });

    describe.each([false, true])('padding %s', (padding) => {
      it.each(['decimal', 'sign', 'negative decimal'])('should resolve only finite final formatting for a two-way %s edit', (partial) => {
        const fixture = TestBed.createComponent(TwoWayBindingTestComponent);
        const service = TestBed.inject(NumberFormatService);
        service.prepareSeparators(locale);
        fixture.componentRef.setInput('autofillDecimals', padding);
        fixture.detectChanges();
        const element = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        const separator = service.decimalSeparator;
        element.value = partial === 'decimal' ? separator : partial === 'sign' ? '-' : `-${separator}`;
        element.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        const before = fixture.componentInstance.outputs.length;
        expect(Number.isNaN(fixture.componentInstance.value)).toBe(true);
        element.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        const remainsInvalid = partial === 'sign' && !padding;
        const expected = partial === 'decimal' ? 0 : -0;
        if (remainsInvalid) {
          expect(Number.isNaN(fixture.componentInstance.value)).toBe(true);
          expect(element.value).toBe('-');
        } else {
          expect(fixture.componentInstance.value).toBe(expected);
          expect(element.value).toBe(`${partial === 'decimal' ? '' : '-'}0${separator}${padding ? '00' : ''}`);
        }
        const resolution = !remainsInvalid;
        expect(fixture.componentInstance.outputs.length).toBe(before + Number(resolution));
        const outputs = [...fixture.componentInstance.outputs];
        element.dispatchEvent(new KeyboardEvent('keyup', { key: separator }));
        element.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
        expect(fixture.componentInstance.outputs).toEqual(outputs);
      });

      it.each(['change', 'blur', 'submit'] as const)('should commit a resolved decimal exactly once with updateOn %s', (updateOn) => {
        const fixture = TestBed.createComponent(DynamicTestComponent);
        const service = TestBed.inject(NumberFormatService);
        service.prepareSeparators(locale);
        fixture.componentRef.setInput('autofillDecimals', padding);
        const control = new FormControl<number | null | undefined>(null, {
          updateOn,
          validators: (candidate) => Validators.required(candidate),
        });
        fixture.componentInstance.form = new FormGroup({ amount: control });
        fixture.detectChanges();
        const field = fixture.debugElement.query(By.css('form input'));
        const element = field.nativeElement as HTMLInputElement;
        const trace: string[] = [];
        const outputs = jest.fn();
        field.injector.get(NumericFieldDirective).numericValueChanged.subscribe((value) => {
          outputs(value);
          if (Number.isFinite(value)) {
            trace.push('output');
            expect(control.untouched).toBe(true);
          }
        });
        const changes = jest.fn();
        control.valueChanges.subscribe((value) => {
          changes(value);
          if (value === 0) {
            trace.push('model');
          }
        });
        const touched = jest.spyOn(control, 'markAsTouched');
        expect(control.pristine).toBe(true);
        expect(control.hasError('required')).toBe(true);
        element.value = service.decimalSeparator;
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('blur'));
        expect(outputs.mock.calls).toEqual([[NaN], [0]]);
        expect(control.value).toBe(updateOn === 'submit' ? null : 0);
        expect(control.hasError('required')).toBe(updateOn === 'submit');
        expect(touched).toHaveBeenCalledTimes(updateOn === 'submit' ? 0 : 1);
        if (updateOn !== 'submit') {
          expect(outputs.mock.invocationCallOrder[1]).toBeLessThan(touched.mock.invocationCallOrder[0]);
        }
        const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(control.value).toBe(0);
        expect(control.valid).toBe(true);
        expect(control.dirty).toBe(true);
        expect(control.touched).toBe(true);
        expect(trace).toEqual(['output', 'model']);
        expect(changes.mock.calls).toEqual(updateOn === 'change' ? [[undefined], [0]] : [[0]]);
        changes.mockClear();
        outputs.mockClear();
        element.dispatchEvent(new KeyboardEvent('keyup', { key: service.decimalSeparator }));
        element.dispatchEvent(new Event('blur'));
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(changes).not.toHaveBeenCalled();
        expect(outputs).not.toHaveBeenCalled();
      });
    });
  });

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

  describe.each(['change', 'blur', 'submit'] as const)('grouping edits with updateOn %s', (updateOn) => {
    it.each([
      ['Delete', 3, 12356],
      ['Backspace', 4, 12456],
    ] as const)('should queue %s for the forms lifecycle and validation', (key, cursor, value) => {
      const fixture = TestBed.createComponent(DynamicTestComponent);
      const control = new FormControl<number | null | undefined>(123456, {
        updateOn,
        validators: [(candidateControl) => Validators.required(candidateControl), Validators.min(13000), Validators.max(15000)],
      });
      fixture.componentInstance.form = new FormGroup({ amount: control });
      fixture.detectChanges();
      const element: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('form input');
      const changes = jest.fn();
      control.valueChanges.subscribe(changes);
      element.setSelectionRange(cursor, cursor);
      element.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
      element.dispatchEvent(new KeyboardEvent('keyup', { key }));
      expect(control.value).toBe(updateOn === 'change' ? value : 123456);
      expect(control.dirty).toBe(updateOn === 'change');
      expect(control.untouched).toBe(true);
      element.dispatchEvent(new Event('blur'));
      expect(control.value).toBe(updateOn === 'submit' ? 123456 : value);
      expect(control.touched).toBe(updateOn !== 'submit');
      const form: HTMLFormElement = (fixture.nativeElement as HTMLElement).querySelector<HTMLFormElement>('form');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      expect(control.value).toBe(value);
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(control.hasError('min')).toBe(true);
      expect(control.hasError('max')).toBe(false);
      expect(control.hasError('required')).toBe(false);
      expect(changes.mock.calls).toEqual([[value]]);
    });
  });

  it.each([1.23999, -1.23999])('should truncate programmatic %s toward zero', (value) => {
    const fixture = createFormattingFixture(value);
    expect((fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('form input').value).toBe(value < 0 ? '-1.23' : '1.23');
    expect(fixture.componentInstance.form.controls.amount.value).toBe(value);
  });

  it('should render exponent values using the requested decimal precision', () => {
    const fixture = createFormattingFixture(1e-7);
    fixture.componentRef.setInput('decimalPlaces', 8);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('form input').value).toBe('0.0000001');
    expect(fixture.componentInstance.form.controls.amount.value).toBe(1e-7);
  });

  it.each(['', 'invalid', -1, 1.5, 101, NaN, Infinity])('should fall back to two places for invalid precision %s', (precision) => {
    const fixture = createFormattingFixture(1.23999);
    fixture.componentRef.setInput('decimalPlaces', precision);
    expect(() => fixture.detectChanges()).not.toThrow();
    expect((fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('form input').value).toBe('1.23');
  });

  it.each(['0', '3', 100])('should accept integer precision %s', (precision) => {
    const fixture = createFormattingFixture(12.3456);
    fixture.componentRef.setInput('decimalPlaces', precision);
    fixture.detectChanges();
    const places = Number(precision);
    expect((fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('form input').value).toBe(
      places === 0 ? '12' : places === 3 ? '12.345' : '12.3456',
    );
  });

  it('should preserve unfinished two-way text and caret when the output is echoed', () => {
    const fixture = TestBed.createComponent(TwoWayBindingTestComponent);
    fixture.detectChanges();
    const element: HTMLInputElement = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input');
    element.value = '12.';
    element.setSelectionRange(3, 3);
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(12);
    expect(element.value).toBe('12.');
    expect(element.selectionStart).toBe(3);
    expect(fixture.componentInstance.outputs).toEqual([12]);
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
