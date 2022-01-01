import { CdkStepHeader, STEP_STATE, StepState } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

@Component({
  selector: 'mad-step-header',
  templateUrl: './step-header.component.html',
  styleUrls: ['./step-header.component.scss'],
  inputs: ['color'],
  host: {
    'class': 'mad-step-header',
    'role': 'tab',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepHeaderComponent extends CdkStepHeader {
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

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** Focuses the step header. */
  focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  public getCssForState(): string {
    if (this.state === STEP_STATE.NUMBER && !this.completed && !this.hasError) {
      return 'step-state-neutral'; //initiale state is 'number'
    } else if (this.completed) {
      return 'step-state-complete';
    } else if (this.hasError) {
      return 'step-state-error';
    }
  }

  public getIcon(): string {
    if (this.completed) {
      return 'check_circle_outline';
    } else if (this.hasError) {
      return 'error_outline';
    }
    return '';
  }
}
