import { Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReadOnlyFormFieldWrapperComponent } from './readonly-form-field-wrapper.component';
import { ReadOnlyFormFieldModule } from '../readonly-form-field.module';

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [
      ReadOnlyFormFieldWrapperComponent,
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatTooltipModule,
      MatIconModule,
      NoopAnimationsModule,
      ReadOnlyFormFieldModule,
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
  template: ` <mad-readonly-form-field-wrapper
    data-cy="wrapper"
    [readonly]="!textIsEditable"
    [value]="demoIdNumber"
    [formatNumber]="false"
    prefix="help"
    (prefixClickedEmitter)="wrapperPrefixClicked()"
  >
    <mat-form-field>
      <mat-label>A long number</mat-label>
      <input
        data-cy="input-field"
        [(ngModel)]="demoIdNumber"
        autocomplete="off"
        class="form-control"
        id="numberx"
        matInput
        name="id"
        type="number"
      />
      <mat-icon (click)="fieldPrefixClicked()" class="pointer" color="primary" matPrefix>info</mat-icon>
      <mat-icon (click)="fieldSuffixClicked()" class="pointer" color="primary" matSuffix>delete</mat-icon>
    </mat-form-field>
  </mad-readonly-form-field-wrapper>`,
})
class TestWrapperComponent {
  textIsEditable = false;
  demoIdNumber = 123456;

  fieldSuffixClicked() {
    console.log('field suffix clicked');
  }

  fieldPrefixClicked() {
    console.log('field prefix clicked');
  }

  wrapperPrefixClicked() {
    console.log('wrapper prefix clicked');
  }
}

describe('readonly-form-field-wrapper.component.cy.ts', () => {
  it('should mount ReadonlyFormFieldWrapperComponent', () => {
    mountWrapperComponent();
  });

  it('should show mat-form-field wrapped by mad-readonly-form-field in readonly mode', () => {
    mountWrapperComponent();
    cy.getByCySel('wrapper').should('be.visible');
    cy.getByCySel('wrapper').find('mad-readonly-form-field').should('exist').and('be.visible');
  });

  it('should not wrap mat-form-field by mad-readonly-form-field in edit mode', () => {
    mountWrapperComponent({
      textIsEditable: true,
    });
    cy.getByCySel('wrapper').should('be.visible');
    cy.getByCySel('wrapper').find('mad-readonly-form-field').should('not.exist');
  });

  it('should show only wrapper prefix in readonly mode', () => {
    mountWrapperComponent();

    cy.getByCySel('wrapper').find('mat-icon').as('icons').should('have.length', 3);
    cy.get('@icons').eq(0).should('not.be.visible'); // info icon from edit mode
    cy.get('@icons').eq(1).should('not.be.visible'); // delete icon from edit mode
    cy.get('@icons').eq(2).should('be.visible').and('contain.text', 'help'); // help icon from readonly mode
  });

  it('should show form field prefix and suffix in edit mode', () => {
    mountWrapperComponent({
      textIsEditable: true,
    });

    cy.getByCySel('wrapper').find('mat-icon').as('icons').should('have.length', 2);
    cy.get('@icons').eq(0).should('be.visible').and('contain.text', 'info'); // info icon from edit mode
    cy.get('@icons').eq(1).should('be.visible').and('contain.text', 'delete'); // delete icon from edit mode
  });

  it('should show disabled form field in readonly mode', () => {
    mountWrapperComponent();

    // original input should not be shown
    cy.getByCySel('input-field').should('not.be.visible');
    // input by wrapper should be shown instead
    cy.getByCySel('wrapper').find('mad-readonly-form-field').find('input').should('have.attr', 'disabled');
  });

  it('should show editable form field in edit mode', () => {
    mountWrapperComponent({
      textIsEditable: true,
    });

    // original input should be shown
    cy.getByCySel('input-field').should('be.visible').and('not.have.attr', 'disabled');
  });

  it('should emit wrapper prefix event on wrapper prefix click', () => {
    mountWrapperComponent().then((response) => {
      cy.spy(response.component, 'wrapperPrefixClicked').as('wrapperPrefixClickedSpy');
      cy.spy(response.component, 'fieldPrefixClicked').as('fieldPrefixClickedSpy');
    });

    cy.getByCySel('wrapper').contains('help').click();
    cy.get('@wrapperPrefixClickedSpy').should('have.been.calledOnce');
    cy.get('@fieldPrefixClickedSpy').should('not.have.been.called');
  });

  it('should emit field prefix/suffix event on field prefix/suffix click in edit mode', () => {
    mountWrapperComponent({
      textIsEditable: true,
    }).then((response) => {
      cy.spy(response.component, 'wrapperPrefixClicked').as('wrapperPrefixClickedSpy');
      cy.spy(response.component, 'fieldPrefixClicked').as('fieldPrefixClickedSpy');
      cy.spy(response.component, 'fieldSuffixClicked').as('fieldSuffixClickedSpy');
    });

    // click prefix
    cy.getByCySel('wrapper').contains('info').click();
    cy.get('@fieldPrefixClickedSpy').should('have.been.calledOnce');
    cy.get('@wrapperPrefixClickedSpy').should('not.have.been.called');
    //click suffix
    cy.getByCySel('wrapper').contains('delete').click();
    cy.get('@fieldSuffixClickedSpy').should('have.been.calledOnce');
  });
});
