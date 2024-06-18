import { MaterialActionButtonComponent } from './material-action-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    imports: [MaterialActionButtonComponent, RouterTestingModule, MatButtonModule, MatIconModule, MatTooltipModule],
    componentProperties,
  });
}

@Component({
  template: ` <mad-material-action-button
    data-cy="action-button"
    [actionName]="'Add something'"
    [icon]="icon"
    [liftHigher]="liftHigher"
    [liftHigher2]="liftHigher2"
    [routerLink]="'/action-button'"
    [id]="'add'"
  >
  </mad-material-action-button>`,
})
class TestWrapperComponent {
  liftHigher = false;
  liftHigher2 = false;
  icon = 'add';
}

describe('material-action-button.component.ts', () => {
  it('should mount MaterialActionButtonComponent', () => {
    mountWrapperComponent();
  });

  it('should have proper structure by default', () => {
    mountWrapperComponent();

    cy.getByCySel('action-button').should('be.visible');
    cy.getByCySel('action-button').find('div').should('exist').and('have.class', 'material-action-button');
    cy.getByCySel('action-button').find('a').should('exist').should('have.attr', 'href', '/action-button');
    cy.getByCySel('action-button').find('button').should('be.visible').find('mat-icon').should('contain.text', 'add');
  });

  it('should show tooltip with actionName when hovered', () => {
    mountWrapperComponent();

    cy.getByCySel('action-button').find('button').realHover();
    cy.get('body').find('mat-tooltip-component').should('be.visible').and('contain.text', 'Add something');
  });

  it('should show button higher', () => {
    mountWrapperComponent({
      liftHigher: true,
    });

    cy.getByCySel('action-button').should('be.visible');
    cy.getByCySel('action-button').find('div').should('exist').and('have.class', 'material-action-button').and('have.class', 'lift-higher');
  });

  it('should show higher and in mini version', () => {
    mountWrapperComponent({
      liftHigher2: true,
    });

    cy.getByCySel('action-button').should('be.visible');
    cy.getByCySel('action-button')
      .find('div')
      .should('exist')
      .and('have.class', 'material-action-button')
      .and('have.class', 'lift-higher-2');
  });
});
