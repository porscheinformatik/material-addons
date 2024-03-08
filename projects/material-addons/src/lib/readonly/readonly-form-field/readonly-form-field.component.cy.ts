import { Component } from '@angular/core';
import { ReadOnlyFormFieldComponent } from './readonly-form-field.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const multiText =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore \n' +
  'et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ';

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [ReadOnlyFormFieldComponent],
    imports: [RouterModule, MatFormFieldModule, MatInputModule, FormsModule, MatTooltipModule, MatIconModule, NoopAnimationsModule],
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
  template: `
    <mad-readonly-form-field
      *ngIf="showDateField"
      data-cy="date-field"
      [value]="'2019-08-09' | date"
      label="Date value with icons"
      prefix="info"
      (prefixClickedEmitter)="prefixClicked()"
      suffix="help"
      (suffixClickedEmitter)="suffixClicked()"
    />
    <mad-readonly-form-field
      *ngIf="showNumberField"
      data-cy="number-field"
      [value]="numberFieldValue"
      label="Number value"
      [formatNumber]="formatNumber"
      [errorMessage]="errorMessage"
    ></mad-readonly-form-field>
    <mad-readonly-form-field *ngIf="showContentField" data-cy="content-field" label="Content value" [useProjectedContent]="true"
      ><a href="www.google.com" target="_blank">LINK</a></mad-readonly-form-field
    >
    <mad-readonly-form-field
      *ngIf="showMultilineField"
      data-cy="multiline-field"
      [value]="multilineText"
      [rows]="rows"
      [shrinkIfEmpty]="shrinkIfEmpty"
      [multiline]="true"
      label="Multi value"
    ></mad-readonly-form-field>
  `,
})
class TestWrapperComponent {
  showDateField = false;
  showNumberField = false;
  showContentField = false;
  showMultilineField = false;

  numberFieldValue = null;
  formatNumber = false;
  errorMessage = null;
  multilineText = multiText;
  rows = null;
  shrinkIfEmpty = false;

  suffixClicked() {}

  prefixClicked() {}
}

describe('readonly-form-field.component.cy.ts', () => {
  it('should mount ReadOnlyFormFieldComponent', () => {
    mountWrapperComponent({
      showDateField: true,
      showNumberField: true,
      showContentField: true,
      showMultilineField: true,
    });
  });

  it('should show all form fields in readonly', () => {
    mountWrapperComponent({
      showDateField: true,
      showNumberField: true,
      showContentField: true,
      showMultilineField: true,
    });

    cy.get('mad-readonly-form-field').should('be.visible');
    cy.get('mad-readonly-form-field').find('mat-form-field').should('have.class', 'mat-form-field-disabled');
  });

  it('should show formatted date field with icons, label and disabled input', () => {
    mountWrapperComponent({
      showDateField: true,
    });

    cy.getByCySel('date-field').should('be.visible');
    // check label
    cy.getByCySel('date-field')
      .find('label')
      .should('be.visible')
      .and('contain.text', 'Date value with icons')
      .and('have.attr', 'ng-reflect-floating', 'true');
    //check prefix and suffix icons
    cy.getByCySel('date-field').find('mat-icon').as('icons').should('be.visible');
    cy.get('@icons').eq(0).should('contain.text', 'info').and('have.attr', 'matprefix');
    cy.get('@icons').eq(1).should('contain.text', 'help').and('have.attr', 'matsuffix');
    // check input
    cy.getByCySel('date-field').find('input').as('inputField').should('have.value', 'Aug 9, 2019');
    cy.get('@inputField').should('have.attr', 'readonly');
    cy.get('@inputField').should('have.attr', 'disabled');
  });

  it('should emit events on prefix/suffix icons click', () => {
    mountWrapperComponent({
      showDateField: true,
    }).then((response) => {
      cy.spy(response.component, 'prefixClicked').as('prefixClickedSpy');
      cy.spy(response.component, 'suffixClicked').as('suffixClickedSpy');
    });

    // check prefix click
    cy.getByCySel('prefix-icon').click();
    cy.get('@prefixClickedSpy').should('have.been.calledOnce');

    // check suffix click
    cy.getByCySel('suffix-icon').click();
    cy.get('@suffixClickedSpy').should('have.been.calledOnce');
  });

  it('should not show suffix and prefix if not propagated', () => {
    mountWrapperComponent({
      showNumberField: true,
    });

    cy.getByCySel('number-field').should('be.visible');
    cy.getByCySel('prefix-icon').should('not.exist');
    cy.getByCySel('suffix-icon').should('not.exist');
    // check label
    cy.getByCySel('number-field')
      .find('label')
      .should('be.visible')
      .and('contain.text', 'Number value')
      .and('have.attr', 'ng-reflect-floating', 'true');
  });

  it('should display "=" if value is null or undefined', () => {
    [null, undefined].forEach((numberFieldValue) => {
      mountWrapperComponent({
        showNumberField: true,
        numberFieldValue: numberFieldValue,
      });

      cy.getByCySel('number-field').should('be.visible');
      cy.getByCySel('number-field').find('input').should('contain.value', '-');
    });
  });

  it('should display error message if propagated', () => {
    mountWrapperComponent({
      showNumberField: true,
      errorMessage: 'test error message',
    });

    cy.getByCySel('number-field').should('be.visible');
    cy.getByCySel('number-field').find('mat-error').should('be.visible').and('contain.text', 'test error message');
  });

  it('should display formatted value in readonly disabled input', () => {
    mountWrapperComponent({
      showNumberField: true,
      numberFieldValue: '1,234.56',
      formatNumberValue: true,
    });

    cy.getByCySel('number-field').should('be.visible');
    cy.getByCySel('number-field').find('input').as('inputField').should('have.value', '1,234.56');
    cy.get('@inputField').should('have.attr', 'readonly');
    cy.get('@inputField').should('have.attr', 'disabled');
  });

  it('should show content field with label and disabled input', () => {
    mountWrapperComponent({
      showContentField: true,
    });

    cy.getByCySel('content-field').should('be.visible');
    // check label
    cy.getByCySel('content-field')
      .find('label')
      .should('be.visible')
      .and('contain.text', 'Content value')
      .and('have.attr', 'ng-reflect-floating', 'true');
    // check input
    cy.getByCySel('content-field').find('input').as('inputField');
    cy.get('@inputField').should('have.attr', 'readonly');
    cy.get('@inputField').should('not.have.attr', 'disabled');
    // check content
    cy.getByCySel('content-field').find('a').should('contain.text', 'LINK');
  });

  it('should show multiline field with label and disabled input and rows', () => {
    [2, 4].forEach((rows) => {
      mountWrapperComponent({
        showMultilineField: true,
        rows: rows,
      });

      cy.getByCySel('multiline-field').should('be.visible');
      // check label
      cy.getByCySel('multiline-field')
        .find('label')
        .should('be.visible')
        .and('contain.text', 'Multi value')
        .and('have.attr', 'ng-reflect-floating', 'true');
      // check input
      cy.getByCySel('multiline-field').find('textarea').as('textAreaField');
      cy.get('@textAreaField').should('have.attr', 'readonly');
      cy.get('@textAreaField').should('have.attr', 'disabled');
      // check textarea
      cy.getByCySel('multiline-field').find('textarea').should('have.value', multiText);
      cy.getByCySel('multiline-field').find('textarea').should('have.attr', 'rows', rows);
    });
  });

  it('should shrink multiline if value is empty', () => {
    mountWrapperComponent({
      showMultilineField: true,
      multilineText: null,
      shrinkIfEmpty: true,
    });

    cy.getByCySel('multiline-field').should('be.visible');
    // check label
    cy.getByCySel('multiline-field')
      .find('label')
      .should('be.visible')
      .and('contain.text', 'Multi value')
      .and('have.attr', 'ng-reflect-floating', 'true');
    // check textarea
    cy.getByCySel('multiline-field').find('textarea').as('textAreaField');
    cy.get('@textAreaField').should('have.attr', 'readonly');
    cy.get('@textAreaField').should('have.attr', 'disabled');
    cy.get('@textAreaField').should('have.value', '-');
    // check textarea
    cy.getByCySel('multiline-field').find('textarea').should('have.attr', 'rows', 1);
  });
});
