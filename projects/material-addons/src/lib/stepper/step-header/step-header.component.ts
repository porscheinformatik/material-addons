import { CdkStepHeader, STEP_STATE, StepState } from '@angular/cdk/stepper';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

@Component({
  selector: 'mad-step-header',
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.scss'],
  inputs: ['color'],
  host: {
    class: 'mad-step-header',
    role: 'tab',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepHeaderComponent extends CdkStepHeader implements AfterViewInit, OnDestroy {
  @Input()
  index: number;

  @Input()
  label: string;

  @Input() state: StepState;

  @Input() errorMessage: string;

  @Input() selected: boolean;

  @Input() active: boolean;

  @Input() optional: boolean;

  @Input() hasError: boolean;

  @Input() completed: boolean;

  @Input() closed: boolean;

  constructor(private _focusMonitor: FocusMonitor, _elementRef: ElementRef<HTMLElement>) {
    super(_elementRef);
  }

  ngAfterViewInit(): void {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  getCssForState(): string {
    if (this.state === STEP_STATE.NUMBER && !this.completed && !this.hasError) {
      return 'step-state-neutral'; //initiale state is 'number'
    } else if (this.completed) {
      return 'step-state-complete';
    } else if (this.hasError) {
      return 'step-state-error';
    }
  }

  getIcon(): string {
    if (this.completed) {
      return 'check_circle_outline';
    } else if (this.hasError) {
      return 'error_outline';
    }
    return '';
  }
}
