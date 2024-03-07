import { ButtonModule } from '../button.module';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';

const checkButtonBasicAttributes = () => {
  const buttonCy = cy.getByCySel('button');
  buttonCy.should('be.visible');
  buttonCy.should('contain.text', 'Primary');
  buttonCy.should('have.attr', 'color', 'primary');
  buttonCy.should('have.attr', 'title', 'Test tooltip');
  buttonCy.should('have.attr', 'mat-raised-button');
};

function mountTestWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [ButtonModule, MatButtonModule],
    componentProperties,
  });
}

@Component({
  template: `
    <mad-primary-button data-cy="primary-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      Primary
    </mad-primary-button>
  `,
})
class TestWrapperComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

describe('primary-button.component.cy.ts', () => {
  it('should properly mount the PrimaryButtonComponent', () => {
    mountTestWrapperComponent();
  });

  it('should render a visible primary button with the expected attributes when not disabled', () => {
    mountTestWrapperComponent().then((response) => {
      cy.spy(response.component, 'doSomething').as('doSomethingSpy');
    });

    checkButtonBasicAttributes();
    cy.getByCySel('primary-button').should('have.css', 'pointer-events', 'auto').and('have.css', 'opacity', '1');
    cy.getByCySel('primary-button').click();
    cy.get('@doSomethingSpy').should('have.been.calledOnce');
  });

  it('should render a visible primary button with the expected attributes when disabled', () => {
    mountTestWrapperComponent({ disabled: true });

    checkButtonBasicAttributes();
    cy.getByCySel('primary-button').should('have.css', 'pointer-events', 'none').and('have.css', 'opacity', '0.35');
  });
});
