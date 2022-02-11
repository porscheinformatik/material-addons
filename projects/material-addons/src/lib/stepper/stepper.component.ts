import { Directionality } from '@angular/cdk/bidi';
import { CdkStep, CdkStepper, STEP_STATE, StepContentPositionState} from '@angular/cdk/stepper';
import { AnimationEvent } from '@angular/animations';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy, OnInit,
  Optional,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { StepHeaderComponent } from './step-header/step-header.component';
import { madStepperAnimations } from './mad-stepper-animation';

@Component({
  selector: 'mad-step',
  templateUrl: './step.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [{ provide: CdkStep, useExisting: StepComponent }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent extends CdkStep implements AfterContentInit, OnDestroy {
  /** Action event for the next button. If not set the StepComponent will handle the step navigation */
  @Output()
  onNext = new EventEmitter<any>();

  /** Action event for the done button. If not set the StepComponent will handle the step navigation  */
  @Output()
  onDone = new EventEmitter<any>();

  /*** Action event when the header is clicked. If not set the StepComponent will handle the step navigation*/
  @Output()
  onHeaderClick = new EventEmitter<any>();

  stepClosed = false;

  private _isSelected = Subscription.EMPTY;

  constructor(@Inject(forwardRef(() => StepperComponent)) private stepper: StepperComponent, private _viewContainerRef: ViewContainerRef) {
    super(stepper);
  }

  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes
      .pipe(
        switchMap(() =>
          this._stepper.selectionChange.pipe(
            map(event => event.selectedStep === this),
            tap(() => (this.stepClosed = false)),
            startWith(this._stepper.selected === this),
          ),
        ),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }

  public next(): void {
    this.stepValidation();

    if (this.onNext.observers.length <= 0) {
      this.stepper.next();
    }
    this.onNext.emit();
  }

  public selectAndMarkAsTouched(index: number): void {
    //Mark current selected step as touched before selecting to display errors in the from
    this._stepper.selected?.stepControl?.markAllAsTouched();
    this.stepClosed = false;
    if (this.onHeaderClick.observers.length <= 0) {
      this.select();
    }
    this.onHeaderClick.emit(index);
  }

  public completeLast(): void {
    this.stepValidation();
    this.stepClosed = true;

    if (this.onDone.observers.length <= 0) {
      this.stepper.next();
    }

    this.onDone.emit();
  }

  public resetValidations(): void {
    this.hasError = false;
    this.completed = true;
    this.state = STEP_STATE.DONE;
  }

  private stepValidation(): void {
    this.stepControl?.markAllAsTouched();
    if (this.stepControl?.valid) {
      this.hasError = false;
      this.completed = true;
      this.state = STEP_STATE.DONE;
    } else {
      this.completed = false;
      this.hasError = true;
      this.state = STEP_STATE.ERROR;
    }
  }
}

@Component({
  selector: 'mad-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  host: {
    '[class.stepper-vertical]': 'true',
    '[attr.aria-orientation]': '"vertical"',
    'role': 'tablist',
  },
  animations: [madStepperAnimations.verticalStepTransition],
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent extends CdkStepper implements OnInit, AfterContentInit {

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  nextButtonLabel: string;

  @Input()
  doneButtonLabel: string;
  /** Step headers of all steps inside the stepper */
  @ViewChildren(StepHeaderComponent) _stepHeader: QueryList<StepHeaderComponent>;

  /** Steps inside the Stepper */
  @ContentChildren(StepComponent, { descendants: true }) _steps: QueryList<StepComponent>;

  /** Steps that belong to the current stepper, excluding ones from nested steppers. */
  steps: QueryList<StepComponent> = new QueryList<StepComponent>();

  readonly _animationDone = new Subject<AnimationEvent>();


  constructor(
    @Optional() dir: Directionality,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) _document: any,
  ) {
    super(dir, changeDetectorRef, elementRef, _document);
    this._orientation = 'vertical';
  }

  ngOnInit() {
    // Only linear stepper implementation is supported
    super.linear = true;
  }

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._stateChanged();
    });

    this._animationDone
      .pipe(
        distinctUntilChanged((x, y) => x.fromState === y.fromState && x.toState === y.toState),
        takeUntil(this._destroyed),
      )
      .subscribe(event => {
        if ((event.toState as StepContentPositionState) === 'current') {
          this.animationDone.emit();
        }
      });
  }

  /**
   * Method patched to enable the closing of the last step.
   */
  _getAnimationDirection(index: number): StepContentPositionState {
    const closeLastStep = this.selectedIndex === this.steps.length - 1 && this._steps.last?.completed && this._steps.last?.stepClosed;
    if (closeLastStep) {
      return 'next';
    }
    return super._getAnimationDirection(index);
  }

  _stepIsNavigable(index: number, step: StepComponent): boolean {
    return step.completed || this.selectedIndex === index || !this.linear;
  }
}
