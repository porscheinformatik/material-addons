import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { NgFor, NgIf } from '@angular/common';

export interface IStep {
  label: string;
  enabled?: boolean;
  subSteps?: IStep[];
  activeSubStep?: IStep;
}

@Component({
  selector: 'mad-flowbar',
  templateUrl: './flowbar.component.html',
  styleUrls: ['./flowbar.component.scss'],
  standalone: true,
  imports: [MatStepperModule, NgFor, NgIf],
})
export class FlowbarComponent implements OnInit, AfterViewInit {
  @Input('steps') _steps: IStep[] = [];
  @Input('activeStep') _activeStep: IStep;
  @Output('activeStepChange') _activeStepChange: EventEmitter<IStep> = new EventEmitter<IStep>(true);
  /**
   * Event emitted when a step header is clicked.
   * When defined header navigation has to be implemented programmatically.
   * e.g. {@see changeActiveStepOnHeader}
   */
  @Output('headerClick') _headerClick: EventEmitter<IStep> = new EventEmitter<IStep>(true);
  @ViewChild('stepper') private stepper: MatStepper;

  get currentStepLabel(): string {
    return this._activeStep.label;
  }

  get currentSubStepLabel(): string {
    return this._activeStep.activeSubStep?.label;
  }

  ngOnInit(): void {
    // If no active step is set as input or the active step is not enabled, select the first enabled step
    if (!this._activeStep || !this._activeStep.enabled) {
      this._activeStep = this._steps.find((step) => step.enabled);
      if (this._activeStep) {
        // If sub steps exist then set the first non disabled sub step per default
        if (this.activeTabHasSubSteps()) {
          this._activeStep.activeSubStep = this._activeStep.subSteps.find((step) => step.enabled);
        }
        this._activeStepChange.emit(this._activeStep);
      }
    }
  }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = (): any => 'number';
  }

  getIndexForActiveStep(): number {
    const selectedIndex = this._steps.indexOf(this._activeStep);
    return selectedIndex === -1 ? 0 : selectedIndex;
  }

  changeActiveStep(step: IStep): void {
    const previousIndex = this._steps.indexOf(this._activeStep);
    this._activeStep = step;
    if (this.activeTabHasSubSteps()) {
      if (previousIndex < this._steps.indexOf(this._activeStep)) {
        this._activeStep.activeSubStep = this._activeStep.subSteps[0];
      } else {
        this._activeStep.activeSubStep = this._activeStep.subSteps[this._activeStep.subSteps.length - 1];
      }
    }
    this._activeStepChange.emit(this._activeStep);
  }

  changeActiveStepOnHeader(step: IStep): void {
    const stepIndex = this._steps.indexOf(step);
    this._activeStep = step;
    this.stepper.selected = this.stepper._steps.find((_, i) => i === stepIndex);
  }

  changeActiveSubStep(subStep: IStep): void {
    this._activeStep.activeSubStep = subStep;
  }

  previous(): void {
    if (this.isPreviousAvailable()) {
      // If active step has no sub steps or first sub step is selected -> go to previous main step
      if (!this.activeTabHasSubSteps() || this.isFirstSubStep()) {
        const previousEnabledStep = this.findPreviousEnabledStep();
        this.changeActiveStep(previousEnabledStep);
        this.stepper.selectedIndex = this._steps.indexOf(previousEnabledStep);
      } else {
        const subStepIndex = this._activeStep.subSteps.indexOf(this._activeStep.activeSubStep);
        this._activeStep.activeSubStep = this._activeStep.subSteps[subStepIndex - 1];
      }
    }
  }

  next(): void {
    if (this.isNextAvailable()) {
      // If active step has no sub steps or last sub step is selected -> go to next main step
      if (!this.activeTabHasSubSteps() || this.isLastSubStep()) {
        const nextEnabledStep = this.findNextEnabledStep();
        this.changeActiveStep(nextEnabledStep);
        this.stepper.selectedIndex = this._steps.indexOf(nextEnabledStep);
      } else {
        const subStepIndex = this._activeStep.subSteps.indexOf(this._activeStep.activeSubStep);
        this._activeStep.activeSubStep = this._activeStep.subSteps[subStepIndex + 1];
      }
    }
  }

  isPreviousAvailable(): boolean {
    if (this._activeStep) {
      if (!this.activeTabHasSubSteps() || this.isFirstSubStep()) {
        const index = this.getCurrentIndex();
        return index > 0 && this.isAnyPreviousStepEnabled(index);
      } else {
        return true;
      }
    }
    return false;
  }

  isNextAvailable(): boolean {
    if (this._activeStep) {
      if (!this.activeTabHasSubSteps() || this.isLastSubStep()) {
        const index = this.getCurrentIndex();
        return index < this._steps.length - 1 && this.isAnyFollowingStepEnabled(index);
      } else {
        return true;
      }
    }
    return false;
  }

  isLastStep(): boolean {
    if (this.getCurrentIndex() === this._steps.length - 1) {
      if (this.activeTabHasSubSteps()) {
        return this.isLastSubStep();
      } else {
        return true;
      }
    }
    return false;
  }

  getCurrentIndex(): number {
    return this._steps.findIndex((value) => value === this._activeStep);
  }

  getCurrentSubStepIndex(): number {
    return this._activeStep.subSteps.findIndex((value) => value === this._activeStep.activeSubStep);
  }

  triggerClick(): void {
    const selectedStep = this._steps[this.stepper.selectedIndex];
    this.changeActiveStep(selectedStep);
  }

  headerClick(event: any, step: IStep): void {
    event.stopPropagation(); //stop processing current header click event
    this._headerClick.emit(step);
  }

  private activeTabHasSubSteps(): boolean {
    return this._activeStep.subSteps && this._activeStep.subSteps.length > 0;
  }

  private isFirstSubStep(): boolean {
    return this._activeStep.activeSubStep === this._activeStep.subSteps[0];
  }

  private isLastSubStep(): boolean {
    return this._activeStep.activeSubStep === this._activeStep.subSteps[this._activeStep.subSteps.length - 1];
  }

  private isAnyPreviousStepEnabled(index: number): boolean {
    // eslint-disable-next-line id-blacklist
    return this._steps.slice(0, index).find((step) => step.enabled) !== undefined;
  }

  private isAnyFollowingStepEnabled(index: number): boolean {
    // eslint-disable-next-line id-blacklist
    return this._steps.slice(index + 1, this._steps.length).find((step) => step.enabled) !== undefined;
  }

  private findPreviousEnabledStep(): IStep {
    const index = this.getCurrentIndex();
    return this._steps
      .slice(0, index)
      .reverse()
      .find((step) => step.enabled);
  }

  private findNextEnabledStep(): IStep {
    const index = this.getCurrentIndex();
    return this._steps.slice(index + 1, this._steps.length).find((step) => step.enabled);
  }
}
