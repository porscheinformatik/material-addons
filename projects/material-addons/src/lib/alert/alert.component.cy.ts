import { AlertComponent } from './alert.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const commonImports = [NoopAnimationsModule, MatIconModule, MatButtonModule];

const defaultProps = {
  type: 'info' as 'info',
  message: 'This is an info alert',
  size: 'medium' as 'medium',
  actionText: '',
  closeable: true,
};

function mountComponent(componentProperties = {}) {
  return cy.mount(AlertComponent, {
    componentProperties: { ...defaultProps, ...componentProperties },
    imports: commonImports,
  });
}

describe('AlertComponent', () => {
  it('renders with default properties', () => {
    mountComponent();

    cy.getByCySel('alert').should('exist');
    cy.getByCySel('alert').should('have.class', 'info');
    cy.getByCySel('alert-message').should('contain.text', 'This is an info alert');
    cy.getByCySel('alert-icon').find('mat-icon').should('contain.text', 'info');
  });

  it('renders with success type', () => {
    mountComponent({ type: 'success', message: 'Success!' });

    cy.getByCySel('alert').should('have.class', 'success');
    cy.getByCySel('alert-message').should('contain.text', 'Success!');
    cy.getByCySel('alert-icon').find('mat-icon').should('contain.text', 'check_circle');
  });

  it('renders with warning type', () => {
    mountComponent({ type: 'warning', message: 'Warning!' });

    cy.getByCySel('alert').should('have.class', 'warning');
    cy.getByCySel('alert-message').should('contain.text', 'Warning!');
    cy.getByCySel('alert-icon').find('mat-icon').should('contain.text', 'warning');
  });

  it('renders with error type', () => {
    mountComponent({ type: 'error', message: 'Error!' });

    cy.getByCySel('alert').should('have.class', 'error');
    cy.getByCySel('alert-message').should('contain.text', 'Error!');
    cy.getByCySel('alert-icon').find('mat-icon').should('contain.text', 'error');
  });

  it('renders with custom action button', () => {
    mountComponent({ actionText: 'Retry' });

    cy.getByCySel('alert-action-btn').should('contain.text', 'Retry');
  });

  it('emits action event when action button is clicked', () => {
    mountComponent({ actionText: 'Retry' }).then((response) => {
      cy.spy(response.component, 'onAction').as('onActionSpy');
    });

    cy.getByCySel('alert-action-btn').click();
    cy.get('@onActionSpy').should('have.been.called');
  });

  it('emits close event when close button is clicked', () => {
    mountComponent().then((response) => {
      cy.spy(response.component, 'closeAlert').as('onCloseSpy');
    });

    cy.getByCySel('alert-close-btn').click();
    cy.get('@onCloseSpy').should('have.been.called');
  });

  it('does not render close button if closeable is false', () => {
    mountComponent({ closeable: false });

    cy.getByCySel('alert-close-btn').should('not.exist');
  });
});
