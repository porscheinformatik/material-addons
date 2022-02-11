import { animate, state, style, transition, trigger, AnimationTriggerMetadata } from '@angular/animations';

/**
 * Animations used by the MAD stepper.
 */
export const madStepperAnimations: {
  readonly verticalStepTransition: AnimationTriggerMetadata;
} = {
  verticalStepTransition: trigger('stepTransition', [
    state('previous', style({ height: '0px', visibility: 'hidden' })),
    state('next', style({ height: '0px', visibility: 'hidden' })),
    state('current', style({ height: '*', visibility: 'visible' })),
    transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),
};
