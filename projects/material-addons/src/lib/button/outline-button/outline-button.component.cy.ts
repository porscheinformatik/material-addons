import { ButtonModule } from '../button.module';
import { MatButtonModule } from '@angular/material/button';
import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

const checkButtonBasicAttributes = () => {
  const buttonCy = cy.getByCySel('button');
  buttonCy.should('be.visible');
  buttonCy.should('contain.text', 'Outline');
  buttonCy.should('have.attr', 'title', 'Test tooltip');
};

function mountTestWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [ButtonModule, MatButtonModule],
    componentProperties,
  });
}

@Component({
  template: `
    <mad-outline-button data-cy="outline-button" title="Test tooltip" [disabled]="disabled" [color]="color" (click)="doSomething()">
      Outline
    </mad-outline-button>
  `,
})
class TestWrapperComponent {
  disabled: boolean = false;
  color: ThemePalette = 'primary';

  doSomething(): void {
    console.log('Clicked');
  }
}

describe('outline-button.component.cy.ts', () => {
  it('should properly mount the OutlineButtonComponent', () => {
    mountTestWrapperComponent();
  });

  it('should render a visible link button with the expected attributes when not disabled', () => {
    mountTestWrapperComponent().then((response) => {
      cy.spy(response.component, 'doSomething').as('doSomethingSpy');
    });

    checkButtonBasicAttributes();
    cy.getByCySel('outline-button').should('have.css', 'pointer-events', 'auto').and('have.css', 'opacity', '1');
    cy.getByCySel('outline-button').click();
    cy.get('@doSomethingSpy').should('have.been.calledOnce');
  });

  it('should render a visible outline button with the expected attributes when disabled', () => {
    mountTestWrapperComponent({ disabled: true });

    checkButtonBasicAttributes();
    cy.getByCySel('outline-button').should('have.css', 'pointer-events', 'none').and('have.css', 'opacity', '0.35');
  });
});
