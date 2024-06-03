import { Component } from '@angular/core';
import { NumericFieldDirective } from './numeric-field.directive';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NumberFormatService } from './number-format.service';

const testCases = [
  { input: '111', output: '111' },
  { input: '1111', output: '1,111' },
  { input: '111111', output: '111,111' },
  { input: '1111111', output: '1,111,111' },
  { input: '1111111.1', output: '1,111,111.1' },
  { input: '1111111.10', output: '1,111,111.10' },
  { input: '1111111.11', output: '1,111,111.11' },
  { input: '1111111.111', output: '1,111,111.11' },
  { input: '1111111,1', output: '11,111,111' },
  { input: 'aAbBcCdDeEfF', output: '' },
];

const fourDecimalCases = [
  { input: '1111111', output: '1,111,111' },
  { input: '1111111.1', output: '1,111,111.1' },
  { input: '1111111.10', output: '1,111,111.10' },
  { input: '1111111.11', output: '1,111,111.11' },
  { input: '1111111.111', output: '1,111,111.111' },
  { input: '1111111.11111', output: '1,111,111.1111' },
  { input: '1111111,1', output: '11,111,111' },
  { input: 'aAbBcCdDeEfF', output: '' },
];

const zeroDecimalCases = [
  { input: '1111111', output: '1,111,111' },
  { input: '1111111.1', output: '11,111,111' },
  { input: '1111111.10', output: '111,111,110' },
  { input: '1111111.11', output: '111,111,111' },
  { input: '1111111,1', output: '11,111,111' },
  { input: 'aAbBcCdDeEfF', output: '' },
];

const autofillDecimalsWithDecimalCases = [
  {
    decimalPlaces: 0,
    cases: [
      { input: '1', output: '1' },
      { input: '11', output: '11' },
      { input: '11111', output: '11,111' },
      { input: '11111.11', output: '1,111,111' },
      { input: '11111.1101', output: '111,111,101' },
    ],
  },
  {
    decimalPlaces: 2,
    cases: [
      { input: '1', output: '1.00' },
      { input: '11', output: '11.00' },
      { input: '11111', output: '11,111.00' },
      { input: '11111.11', output: '11,111.11' },
      { input: '11111.1101', output: '11,111.11' },
    ],
  },
  {
    decimalPlaces: 4,
    cases: [
      { input: '1', output: '1.0000' },
      { input: '11', output: '11.0000' },
      { input: '11111', output: '11,111.0000' },
      { input: '11111.11', output: '11,111.1100' },
      { input: '11111.1101', output: '11,111.1101' },
    ],
  },
];

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestDirectiveComponent, {
    imports: [NumericFieldDirective, FormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
    providers: [
      NumberFormatService,
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
      },
    ],
    componentProperties,
  });
}

@Component({
  template: ` <div style="display: flex; flex-direction: column; justify-content: space-between">
    <mat-form-field>
      <input data-cy="simple" matInput [(ngModel)]="simpleValue" madNumericField />
    </mat-form-field>
    <mat-form-field>
      <input
        data-cy="custom"
        matInput
        [unit]="unit"
        [unitPosition]="unitPosition"
        [textAlign]="textAlign"
        [decimalPlaces]="decimalPlaces"
        [autofillDecimals]="autofillDecimals"
        [roundDisplayValue]="roundDisplayValue"
        [(ngModel)]="customValue"
        madNumericField
      />
    </mat-form-field>
  </div>`,
})
class TestDirectiveComponent {
  simpleValue: number;
  customValue: number;
  unit = 'kg';
  unitPosition: 'right' | 'left' = 'left';
  textAlign: 'right' | 'left' = 'left';
  decimalPlaces = 2;
  autofillDecimals = false;
  roundDisplayValue = false;
}

function checkValueFormatting(inputCyName: string, inputValue: string, expectedOutput: string): void {
  cy.getByCySel(inputCyName)
    .type(inputValue)
    .invoke('val')
    .then((val) => {
      console.log(val);
      expect(val).to.equal(expectedOutput);
    });

  cy.getByCySel(inputCyName).should('have.attr', 'madnumericfield');
  cy.getByCySel(inputCyName).clear();
}

function checkAutoFormattingValue(inputValue: string, expectedOutput: string): void {
  cy.getByCySel('custom').type(inputValue);
  cy.get('body').click();
  cy.wait(2);
  cy.getByCySel('custom').should('have.attr', 'madnumericfield');
  cy.getByCySel('custom').should('have.value', expectedOutput);
  cy.getByCySel('custom').clear();
}

describe('numeric-field.directive.cy.ts', () => {
  it('should mount TestDirectiveComponent', () => {
    mountWrapperComponent();
  });

  describe('simple input with default params', () => {
    it('should show formatted value by default', () => {
      mountWrapperComponent();

      cy.getByCySel('simple').should('be.visible');
      for (let testCase of testCases) {
        checkValueFormatting('simple', testCase.input, testCase.output);
      }
    });

    it('should not show prefix or suffix by default', () => {
      mountWrapperComponent();

      cy.getByCySel('simple').should('be.visible');
      // get material form container children and check there is only input and outline (before/after type value)
      cy.get('.mat-mdc-form-field-flex').first().children().should('have.length', '2');
      cy.getByCySel('simple').type('111');
      // check it stays the same after typing
      cy.get('.mat-mdc-form-field-flex').first().children().should('have.length', '2');
    });

    it('should be focused when type value', () => {
      mountWrapperComponent();

      cy.getByCySel('simple').type('111');
      cy.get('mat-form-field').should('have.class', 'mat-focused');
    });
  });

  describe('input with directive params', () => {
    it('should show formatted value by default', () => {
      mountWrapperComponent();

      cy.getByCySel('custom').should('be.visible');
      for (let testCase of testCases) {
        checkValueFormatting('custom', testCase.input, testCase.output);
      }
    });

    it('should show prefix', () => {
      mountWrapperComponent({
        unit: 'mm',
      });

      // get material form container children and check there input, outline and prefix (before/after type value)
      cy.get('.mat-mdc-form-field-flex').eq(1).children().should('have.length', '3');
      cy.getByCySel('custom').type('111');
      // check it stays the same after typing
      cy.get('.mat-mdc-form-field-flex').eq(1).children().should('have.length', '3');
      cy.get('.mat-mdc-form-field-flex').eq(1).children().first().should('have.attr', 'matprefix');
      cy.get('.mat-mdc-form-field-flex').eq(1).contains('mm');
    });

    it('should show suffix', () => {
      mountWrapperComponent({
        unit: 'mm',
        unitPosition: 'right',
        textAlign: 'right',
      });

      // get material form container children and check there input, outline and suffix (before/after type value)
      cy.get('.mat-mdc-form-field-flex').eq(1).children().should('have.length', '3');
      cy.getByCySel('custom').type('111');
      // check it stays the same after typing
      cy.get('.mat-mdc-form-field-flex').eq(1).children().should('have.length', '3');
      cy.get('.mat-mdc-form-field-flex').eq(1).children().eq(2).should('have.attr', 'matsuffix');
      cy.get('.mat-mdc-form-field-flex').eq(1).contains('mm');
    });

    it('should show proper decimals with 4 decimalPlaces', () => {
      mountWrapperComponent({
        decimalPlaces: 4,
      });

      for (let testCase of fourDecimalCases) {
        checkValueFormatting('custom', testCase.input, testCase.output);
      }
    });

    it('should show proper decimals with 0 decimalPlaces', () => {
      mountWrapperComponent({
        decimalPlaces: 0,
      });

      for (let testCase of zeroDecimalCases) {
        checkValueFormatting('custom', testCase.input, testCase.output);
      }
    });

    describe('autofill with decimalPlaces combinations', () => {
      for (let group of autofillDecimalsWithDecimalCases) {
        console.log(group);
        it('should show proper decimals with autofill', () => {
          mountWrapperComponent({
            autofillDecimals: true,
            decimalPlaces: group.decimalPlaces,
          });

          for (let testCase of group.cases) {
            checkAutoFormattingValue(testCase.input, testCase.output);
          }
        });
      }
    });
  });
});
