import { Component } from '@angular/core';
import { ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StepComponent, StepperComponent } from './stepper.component';

@Component({
  template: `
    <mad-stepper>
      <mad-step label="Step 1">Content 1</mad-step>
      <mad-step label="Step 2">Content 2</mad-step>
    </mad-stepper>
  `,
  imports: [StepperComponent, StepComponent],
})
class HostComponent {}

describe('StepComponent.stepClosed reactivity', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent, NoopAnimationsModule],
      // Mimics the real bootstrapped app: CD runs automatically whenever the zone goes stable,
      // instead of requiring an explicit fixture.detectChanges() call after every state change.
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
  });

  it('reflects stepClosed being set directly on a StepComponent instance (e.g. via an external @ViewChild reference), without a manual detectChanges call', fakeAsync(() => {
    const fixture = TestBed.createComponent(HostComponent);
    tick();

    const firstStep: StepComponent = fixture.debugElement.query(By.directive(StepComponent)).componentInstance;
    const firstHeaderIcon = () =>
      (fixture.nativeElement as HTMLElement).querySelectorAll('mad-step-header mat-icon')[0].textContent?.trim();

    // initially the first (selected) step is open -> arrow points down
    expect(firstHeaderIcon()).toBe('keyboard_arrow_down');

    // simulate an external consumer (e.g. holding a @ViewChild(StepComponent) reference) setting the
    // public stepClosed property directly - NOT via a click within StepperComponent's own template,
    // and NOT via a CdkStepper selection change (which happens to call markForCheck() internally).
    firstStep.stepClosed = true;
    tick(); // no manual fixture.detectChanges() call anywhere in this test!

    expect(firstHeaderIcon()).toBe('keyboard_arrow_right');
  }));
});
