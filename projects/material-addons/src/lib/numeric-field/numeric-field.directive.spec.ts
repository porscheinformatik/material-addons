import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumericFieldDirective } from './numeric-field.directive';
import { FormsModule } from '@angular/forms';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NumberFormatService } from './number-format.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: ` <mat-form-field>
      <input data-testid="simple" matInput unit="kg" [(ngModel)]="value" madNumericField />
    </mat-form-field>
    <mat-form-field>
      <input data-testid="rightUnit" matInput unit="kg" unitPosition="right" textAlign="left" [(ngModel)]="value" madNumericField />
    </mat-form-field>
    <mat-form-field>
      <input data-testid="leftUnit" matInput unit="kg" unitPosition="left" textAlign="left" [(ngModel)]="value" madNumericField />
    </mat-form-field>`,
})
class TestComponent {
  public value: number;
}

describe('NumericFieldDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let simpleInputEl: DebugElement;
  let rightUnitInputEl: DebugElement;
  let leftUnitInputEl: DebugElement;
  let simpleInputDirective: NumericFieldDirective;
  let rightUnitInputDirective: NumericFieldDirective;
  let leftUnitInputDirective: NumericFieldDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, NumericFieldDirective],
      imports: [FormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
      providers: [NumberFormatService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    simpleInputEl = fixture.debugElement.query(By.css('[data-testid="simple"]'));
    simpleInputDirective = simpleInputEl.injector.get(NumericFieldDirective);
    rightUnitInputEl = fixture.debugElement.query(By.css('[data-testid="rightUnit"]'));
    Object.defineProperty(rightUnitInputEl.nativeElement, 'offsetWidth', { value: 100, writable: true });
    rightUnitInputDirective = rightUnitInputEl.injector.get(NumericFieldDirective);
    leftUnitInputEl = fixture.debugElement.query(By.css('[data-testid="leftUnit"]'));
    Object.defineProperty(leftUnitInputEl.nativeElement, 'offsetWidth', { value: 100, writable: true });
    leftUnitInputDirective = leftUnitInputEl.injector.get(NumericFieldDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(simpleInputDirective).not.toBeNull();
  });

  it('Should update numericValue on input change', () => {
    simpleInputEl.nativeElement.value = '123.456';
    simpleInputEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.value).toEqual(123.45);
    expect(simpleInputDirective.unit).toEqual('kg');
  });

  it('Should set default params properly', () => {
    simpleInputEl.nativeElement.dispatchEvent(new Event('input'));

    expect(simpleInputEl.classes['text-right']).toBeTruthy();
    expect(simpleInputDirective.textAlign).toEqual('right');
    expect(simpleInputDirective.decimalPlaces).toEqual(2);
    expect(simpleInputDirective.roundValue).toBeFalsy();
    expect(simpleInputDirective.autofillDecimals).toBeFalsy();
    expect(simpleInputDirective.unitPosition).toEqual('right');
  });

  it('Should set unitPosition to right and textAlign to left and inject unitSpan', () => {
    rightUnitInputEl.nativeElement.value = '123.456';
    rightUnitInputEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(rightUnitInputDirective.unit).toEqual('kg');
    expect(rightUnitInputDirective.unitPosition).toEqual('right');
  });

  it('Should set unitPosition to left and textAlign to left and inject unitSpan', () => {
    leftUnitInputEl.nativeElement.value = '123.456';
    leftUnitInputEl.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(leftUnitInputDirective.unit).toEqual('kg');
    expect(leftUnitInputDirective.unitPosition).toEqual('left');
  });

  it('Should fire keydown backspace event', () => {
    leftUnitInputEl.nativeElement.value = '123456,';
    let event = new KeyboardEvent('keydown', { keyCode: 8 });
    leftUnitInputEl.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(leftUnitInputEl.nativeElement.value).toEqual('12345,');
  });

  it('Should fire keydown delete event', () => {
    leftUnitInputEl.nativeElement.value = '123,56';
    let event = new KeyboardEvent('keydown', { keyCode: 46 });
    Object.defineProperty(leftUnitInputEl.nativeElement, 'selectionStart', { get: () => 3 });
    Object.defineProperty(leftUnitInputEl.nativeElement, 'selectionEnd', { get: () => 3 });
    leftUnitInputEl.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(leftUnitInputEl.nativeElement.value).toEqual('123,6');
  });

  it('Should fire keyup backspace event', () => {
    leftUnitInputEl.nativeElement.value = '123456,';
    let event = new KeyboardEvent('keyup', { keyCode: 8 });
    leftUnitInputEl.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    expect(leftUnitInputEl.nativeElement.value).toEqual('123,456');
  });

  it('Should fire keyup backspace event', () => {
    leftUnitInputEl.nativeElement.value = '123456,';
    leftUnitInputEl.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(leftUnitInputEl.nativeElement.value).toEqual('123,456');
  });
});
