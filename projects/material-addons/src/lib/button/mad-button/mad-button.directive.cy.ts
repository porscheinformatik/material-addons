import { Component, Input } from '@angular/core';
import { ButtonModule } from '../button.module';
import { MatButtonModule } from '@angular/material/button';

function mountTestWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [ButtonModule, MatButtonModule],
    componentProperties,
  });
}

@Component({
  template: ` <button mat-stroked-button madButton [uppercase]="uppercase" [outline]="outline">Group 1</button> `,
})
class TestWrapperComponent {
  @Input()
  uppercase: boolean = true;

  @Input()
  outline: boolean = true;
}

describe('mad-button.directive.cy.ts', () => {
  it('should properly mount the TestWrapperComponent', () => {
    mountTestWrapperComponent();
  });

  it('should have proper default classes', () => {
    mountTestWrapperComponent();

    cy.get('button').should('have.class', 'mad-uppercase');
    cy.get('button').should('have.class', 'mad-outline');
  });

  // TODO fix component, because with this params it is not working properly
  it('should be without additional classes', () => {
    mountTestWrapperComponent({
      uppercase: false,
      outline: false,
    });

    cy.get('button').should('not.have.class', 'mad-uppercase');
    cy.get('button').should('not.have.class', 'mad-outline');
  });
});
