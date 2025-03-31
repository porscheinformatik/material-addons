import { Component, DebugElement } from '@angular/core';
import { ReadOnlyFormFieldWrapperComponent } from './readonly-form-field-wrapper.component';
import { ReadOnlyFormFieldComponent } from '../readonly-form-field/readonly-form-field.component';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReadOnlyFormFieldModule } from '../readonly-form-field.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: `
    <form [formGroup]="form">
      <mad-readonly-form-field-wrapper [readonly]="readonly" [value]="value">
        <mat-form-field>
          <mat-label>Test Label</mat-label>
          <input formControlName="test" matInput />
        </mat-form-field>
      </mad-readonly-form-field-wrapper>
    </form>
  `,
  standalone: true,
  imports: [ReadOnlyFormFieldModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInput],
})
class WrapperTestHostComponent {
  readonly = true;
  value = 'Test Value';
  form = new FormGroup({ test: new FormControl('Initial Value') });
}

describe('ReadOnlyFormFieldWrapperComponent', () => {
  let fixture: ComponentFixture<WrapperTestHostComponent>;
  let hostComponent: WrapperTestHostComponent;
  let wrapperDebugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperTestHostComponent, NoopAnimationsModule],
      providers: [FormGroupDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperTestHostComponent);
    hostComponent = fixture.componentInstance;
    wrapperDebugEl = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the host and wrapper component', () => {
    expect(hostComponent).toBeTruthy();
    const wrapper = wrapperDebugEl.query(By.directive(ReadOnlyFormFieldWrapperComponent));
    expect(wrapper).toBeTruthy();
  });

  it('should render readonly component when readonly is true', () => {
    const readonlyField = wrapperDebugEl.query(By.directive(ReadOnlyFormFieldComponent));
    expect(readonlyField).toBeTruthy();
  });

  it('should render projected content when readonly is false', () => {
    hostComponent.readonly = false;
    fixture.detectChanges();
    const input = wrapperDebugEl.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.value).toBe('Initial Value');
  });

  it('should emit suffixClickedEmitter', () => {
    const wrapperInstance = wrapperDebugEl.query(By.directive(ReadOnlyFormFieldWrapperComponent)).componentInstance;
    jest.spyOn(wrapperInstance.suffixClickedEmitter, 'emit');
    wrapperInstance.suffixClicked();
    expect(wrapperInstance.suffixClickedEmitter.emit).toHaveBeenCalled();
  });

  it('should emit prefixClickedEmitter', () => {
    const wrapperInstance = wrapperDebugEl.query(By.directive(ReadOnlyFormFieldWrapperComponent)).componentInstance;
    jest.spyOn(wrapperInstance.prefixClickedEmitter, 'emit');
    wrapperInstance.prefixClicked();
    expect(wrapperInstance.prefixClickedEmitter.emit).toHaveBeenCalled();
  });
});
