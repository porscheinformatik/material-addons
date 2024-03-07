import { ButtonModule } from '../button.module';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';

const checkButtonBasicAttributes = () => {
  const buttonCy = cy.getByCySel('button');
  buttonCy.should('be.visible');
  buttonCy.should('contain.text', 'Delete');
  buttonCy.should('have.attr', 'color', 'warn');
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
    <mad-danger-button data-cy="danger-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      Delete
    </mad-danger-button>
  `,
})
class TestWrapperComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

describe('danger-button.component.cy.ts', () => {
  it('should properly mount the DangerButtonComponent', () => {
    mountTestWrapperComponent();
  });

  it('should render a visible danger button with the expected attributes when not disabled', () => {
    mountTestWrapperComponent().then((response) => {
      cy.spy(response.component, 'doSomething').as('doSomethingSpy');
    });

    checkButtonBasicAttributes();
    cy.getByCySel('danger-button').should('have.css', 'pointer-events', 'auto').and('have.css', 'opacity', '1');
    cy.getByCySel('danger-button').click();
    cy.get('@doSomethingSpy').should('have.been.calledOnce');
  });

  it('should render a visible danger button with the expected attributes when disabled', () => {
    mountTestWrapperComponent({ disabled: true });

    checkButtonBasicAttributes();
    cy.getByCySel('danger-button').should('have.css', 'pointer-events', 'none').and('have.css', 'opacity', '0.35');
  });
});
