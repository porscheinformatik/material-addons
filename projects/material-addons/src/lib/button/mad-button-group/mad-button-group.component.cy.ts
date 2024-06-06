import { MatButtonModule } from '@angular/material/button';
import { MadButtonGroupComponent } from './mad-button-group.component';
import { Component } from '@angular/core';
import { ButtonModule } from '../button.module';

function mountTestWrapperComponent() {
  return cy.mount(TestWrapperComponent, {
    imports: [MadButtonGroupComponent, ButtonModule, MatButtonModule],
  });
}

@Component({
  template: `
    <mad-button-group data-cy="button-group">
      <button mat-stroked-button madButton>Group 1</button>
      <button mat-raised-button madButton>Group 2</button>
      <button mat-button madButton>Group 3</button>
    </mad-button-group>
  `,
})
class TestWrapperComponent {}

describe('mad-button-group.component.cy.ts', () => {
  it('should properly mount the MadButtonGroupComponent', () => {
    mountTestWrapperComponent();
  });

  it('should be visible and have the class .mad-button-group', () => {
    mountTestWrapperComponent();
    cy.getByCySel('button-group').should('be.visible');
    cy.getByCySel('button-group').should('have.class', 'mad-button-group');
  });

  it('should have correct content', () => {
    mountTestWrapperComponent();

    cy.getByCySel('button-group').find('button').should('have.length', 3);
    cy.getByCySel('button-group')
      .find('button')
      .first()
      .should('contain', 'Group 1')
      .next()
      .should('contain', 'Group 2')
      .next()
      .should('contain', 'Group 3');
  });
});
