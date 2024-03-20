import { ButtonModule } from '../button.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';

const checkButtonBasicAttributes = () => {
  const buttonCy = cy.getByCySel('button');
  buttonCy.should('be.visible');
  buttonCy.should('have.attr', 'color', 'primary');
  buttonCy.should('have.attr', 'title', 'Test tooltip');
  buttonCy.should('have.attr', 'mat-icon-button');
};

function mountTestWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [ButtonModule, MatButtonModule, MatIconModule],
    componentProperties,
  });
}

@Component({
  template: `
    <mad-icon-button data-cy="icon-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      <mat-icon>toll</mat-icon>
    </mad-icon-button>
  `,
})
class TestWrapperComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

describe('icon-button.component.cy.ts', () => {
  it('should properly mount the IconButtonComponent', () => {
    mountTestWrapperComponent();
  });

  it('should render a visible icon button with the expected attributes when not disabled and icon provided', () => {
    mountTestWrapperComponent().then((response) => {
      cy.spy(response.component, 'doSomething').as('doSomethingSpy');
    });

    checkButtonBasicAttributes();
    cy.getByCySel('icon-button').should('have.css', 'pointer-events', 'auto').and('have.css', 'opacity', '1');
    cy.getByCySel('button').find('mat-icon').should('exist');
    cy.getByCySel('button').find('mat-icon').should('have.text', 'toll');

    cy.getByCySel('icon-button').click();
    cy.get('@doSomethingSpy').should('have.been.calledOnce');
  });

  it('should render a visible icon button with the expected attributes when disabled and icon provided', () => {
    mountTestWrapperComponent({ disabled: true });

    checkButtonBasicAttributes();
    cy.getByCySel('icon-button').should('have.css', 'pointer-events', 'none').and('have.css', 'opacity', '0.35');
    cy.getByCySel('button').find('mat-icon').should('exist');
    cy.getByCySel('button').find('mat-icon').should('have.text', 'toll');
  });
});
