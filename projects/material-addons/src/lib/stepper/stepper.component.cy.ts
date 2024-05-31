import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StepComponent, StepperComponent } from './stepper.component';
import { StepHeaderComponent } from './step-header/step-header.component';
import { ButtonModule } from '../button/button.module';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [
      StepperComponent,
      StepComponent,
      StepHeaderComponent,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatIconModule,
      NoopAnimationsModule,
      ButtonModule,
      CdkStepperModule,
    ],
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
      },
    ],
    componentProperties,
  });
}

@Component({
  template: ` <mad-stepper [nextButtonLabel]="'Next'" [doneButtonLabel]="'Done'">
    <mad-step [stepControl]="this.personForm" [label]="'Person'">
      <form [formGroup]="this.personForm">
        <div class="fx fx-row fx-gap-1em">
          <mat-form-field>
            <mat-label>Firstname</mat-label>
            <input matInput placeholder="Firstname" formControlName="firstName" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Lastname</mat-label>
            <input matInput placeholder="Lastname" formControlName="lastName" />
          </mat-form-field>
        </div>
      </form>
    </mad-step>
    <mad-step [stepControl]="this.contactInformationForm" [label]="'Contact Information'">
      <form [formGroup]="this.contactInformationForm">
        <div class="fx fx-gap-1em">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput placeholder="Firstname" formControlName="email" />
          </mat-form-field>
        </div>
      </form>
    </mad-step>
  </mad-stepper>`,
})
class TestWrapperComponent {
  personForm: UntypedFormGroup;
  contactInformationForm: UntypedFormGroup;

  constructor() {}

  ngOnInit(): void {
    this.personForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(''),
      lastName: new UntypedFormControl('', [Validators.required]),
    });

    this.contactInformationForm = new UntypedFormGroup({
      email: new UntypedFormControl(''),
    });
  }
}

function checkStepHeaderInt(
  stepIndex: number,
  borderClass: string,
  statusClass: string,
  expandIcon: string,
  statusIcon: string,
  stepNumber: string,
  stepLabel: string,
) {
  const stepAlias = `${stepIndex}StepHeaderContainer`;

  cy.get('mad-step-header').eq(stepIndex).find('.header').as(stepAlias);
  cy.get(`@${stepAlias}`).should('be.visible').and('have.class', borderClass);
  // check status
  cy.get(`@${stepAlias}`).children().eq(0).should('be.visible').and('have.class', statusClass);
  // check icon expanded
  cy.get(`@${stepAlias}`).children().eq(1).should('be.visible').find('mat-icon').should('contain.text', expandIcon);
  // check step number is correct
  if (statusClass === 'step-state-neutral') {
    cy.get(`@${stepAlias}`).children().eq(2).should('be.visible').and('contain.text', `${stepNumber}.`);
  } else {
    cy.get(`@${stepAlias}`).children().eq(2).should('be.visible').find('mat-icon').should('contain.text', statusIcon);
  }
  // check step label is correct
  cy.get(`@${stepAlias}`).children().eq(3).should('be.visible').and('contain.text', stepLabel);
}

function checkStepHeaderDefaultContent(stepIndex: number, statusClass: string, expandIcon: string, stepLabel: string) {
  const stepNumber = (stepIndex + 1).toString();
  const borderClass = 'check-border';
  checkStepHeaderInt(stepIndex, borderClass, statusClass, expandIcon, null, stepNumber, stepLabel);
}

function checkStepHeaderErrorContent(stepIndex: number, statusClass: string, expandIcon: string, statusIcon: string, stepLabel: string) {
  const borderClass = 'error-border';
  checkStepHeaderInt(stepIndex, borderClass, statusClass, expandIcon, statusIcon, null, stepLabel);
}

function checkStepHeaderCompleteContent(stepIndex: number, statusClass: string, expandIcon: string, statusIcon: string, stepLabel: string) {
  const borderClass = 'check-border';
  checkStepHeaderInt(stepIndex, borderClass, statusClass, expandIcon, statusIcon, null, stepLabel);
}

describe('stepper.component.ts', () => {
  it('should mount StepperComponent', () => {
    mountWrapperComponent();
  });

  it('should show provided steps', () => {
    mountWrapperComponent();
    // should be 2 steps
    cy.getByCySel('step-container').should('have.length', 2).and('be.visible');
  });

  it('should show correct 1st step header (status, icon, number, label)', () => {
    mountWrapperComponent();
    checkStepHeaderDefaultContent(0, 'step-state-neutral', 'keyboard_arrow_down', 'Person');
  });

  it('should show correct 2nd step header (status, icon, number, label)', () => {
    mountWrapperComponent();
    checkStepHeaderDefaultContent(1, 'step-state-neutral', 'keyboard_arrow_right', 'Contact Information');
  });

  it('should show content of first step, but not second', () => {
    mountWrapperComponent();

    cy.getByCySel('stepper-content').eq(0).should('be.visible');
    cy.getByCySel('stepper-content').eq(1).should('not.be.visible');
  });

  it('should have proper structure, show 2 fields and button "Next" on first step', () => {
    mountWrapperComponent();

    // check content structure
    cy.getByCySel('stepper-content').eq(0).should('have.class', 'vertical-content');
    cy.getByCySel('stepper-content').eq(0).children().as('stepContentContainer');
    cy.get('@stepContentContainer').should('have.class', 'step-container');
    // check mad-step content
    cy.get('@stepContentContainer').children().should('have.length', 2);
    cy.get('@stepContentContainer')
      .children()
      .eq(0)
      .should('have.class', 'step-content')
      .find('mat-form-field')
      .should('be.visible')
      .and('have.length', 2);
    // check mad-step-buttons shows only Next button
    cy.get('@stepContentContainer')
      .children()
      .eq(1)
      .should('have.class', 'step-buttons')
      .find('mad-primary-button')
      .should('have.length', 1)
      .and('be.visible')
      .and('contain.text', 'Next');
  });

  it('should show error header status when click on next button with INVALID form', () => {
    mountWrapperComponent();

    cy.getByCySel('next-step-button').click();
    checkStepHeaderErrorContent(0, 'step-state-error', 'keyboard_arrow_down', 'error_outline', 'Person');
  });

  it('should show complete header status when click on next button with VALID form', () => {
    mountWrapperComponent();

    // fill required field
    cy.getByCySel('stepper-content').find('mat-form-field').eq(1).type('Test Lastname');
    cy.getByCySel('next-step-button').click();
    // check header status changed to completed
    checkStepHeaderCompleteContent(0, 'step-state-complete', 'keyboard_arrow_right', 'check_circle_outline', 'Person');
  });

  it('should close 1st step content and expand 2nd step content when click on next button', () => {
    mountWrapperComponent();

    // fill 1st step required field
    cy.getByCySel('stepper-content').find('mat-form-field').eq(1).type('Test Lastname');
    cy.getByCySel('next-step-button').click();
    // check content
    cy.getByCySel('stepper-content').eq(0).should('not.be.visible'); // 1st step content

    cy.getByCySel('stepper-content').eq(1).should('be.visible'); //2nd step content
    cy.getByCySel('stepper-content').eq(1).should('have.class', 'vertical-content');
    cy.getByCySel('stepper-content').eq(1).children().as('stepContentContainer');
    cy.get('@stepContentContainer').should('have.class', 'step-container');
    // check mad-step-buttons shows only Done button
    cy.get('@stepContentContainer')
      .children()
      .eq(1)
      .should('have.class', 'step-buttons')
      .find('mad-primary-button')
      .should('have.length', 1)
      .and('be.visible')
      .and('contain.text', 'Done');
  });

  it('should show 2 collapsed headers and no content on complete 2nd step', () => {
    mountWrapperComponent();

    // fill 1st step required field
    cy.getByCySel('stepper-content').find('mat-form-field').eq(1).type('Test Lastname');
    cy.getByCySel('next-step-button').click();
    // click 2nd step Done button
    cy.getByCySel('complete-step-button').click();
    // check headers content
    checkStepHeaderCompleteContent(0, 'step-state-complete', 'keyboard_arrow_right', 'check_circle_outline', 'Person');
    checkStepHeaderCompleteContent(1, 'step-state-complete', 'keyboard_arrow_right', 'check_circle_outline', 'Contact Information');
    //check content collapsed
    cy.getByCySel('stepper-content').eq(0).should('not.be.visible'); // 1st step content
    cy.getByCySel('stepper-content').eq(1).should('not.be.visible'); //2nd step content
  });
});
