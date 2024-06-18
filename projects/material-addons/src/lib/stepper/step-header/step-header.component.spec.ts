import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepHeaderComponent } from './step-header.component';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { DebugElement } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { STEP_STATE } from '@angular/cdk/stepper';
import { By } from '@angular/platform-browser';

describe('StepHeaderComponent', () => {
  let fixture: ComponentFixture<StepHeaderComponent>;
  let component: StepHeaderComponent;
  let de: DebugElement;
  let focusMonitor: FocusMonitor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StepHeaderComponent, MatIconModule],
      providers: [FocusMonitor],
    }).compileComponents();

    fixture = TestBed.createComponent(StepHeaderComponent);
    component = fixture.componentInstance;
    focusMonitor = TestBed.inject(FocusMonitor);
    de = fixture.debugElement;
    component.index = 2;
    component.label = 'Test Label';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should show the correct index', () => {
    const indexSpan = de.query(By.css('[data-testid="step-number"]'));
    expect(indexSpan.nativeElement.textContent).toEqual('3.');
  });

  it('should show the correct label', () => {
    const labelDiv = de.query(By.css('[data-testid="step-label"]'));
    expect(labelDiv.nativeElement.textContent).toEqual('Test Label');
  });

  it('should return step-state-neutral when state is NUMBER, and completed and hasError are false', () => {
    component.state = STEP_STATE.NUMBER;
    component.completed = false;
    component.hasError = false;
    fixture.detectChanges();
    expect(component.getCssForState()).toBe('step-state-neutral');
  });

  it('should return step-state-complete when completed is true', () => {
    component.completed = true;
    fixture.detectChanges();
    expect(component.getCssForState()).toBe('step-state-complete');
  });

  it('should return step-state-error when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    expect(component.getCssForState()).toBe('step-state-error');
  });

  it('should return "check_circle_outline" icon when completed is true', () => {
    component.completed = true;
    fixture.detectChanges();
    expect(component.getIcon()).toBe('check_circle_outline');
  });

  it('should return "error_outline" icon when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    expect(component.getIcon()).toBe('error_outline');
  });

  it('should return an empty string when neither completed nor hasError is true', () => {
    component.completed = false;
    component.hasError = false;
    fixture.detectChanges();
    expect(component.getIcon()).toBe('');
  });

  it('should focus via focus monitor when origin is present', () => {
    const spy = jest.spyOn(focusMonitor, 'focusVia');
    const mockOrigin: FocusOrigin = 'program';
    component.focus(mockOrigin);
    expect(spy).toHaveBeenCalled();
  });

  it('should focus via native element when origin is not present', () => {
    const spy = jest.spyOn(component._elementRef.nativeElement, 'focus');
    component.focus();
    expect(spy).toHaveBeenCalled();
  });
});
