import { Component } from '@angular/core';
import { ThrottleClickDirective } from './throttle-click.directive';
import { MatButtonModule } from '@angular/material/button';

const throttleTime = 500;

@Component({
  template: ` <button mat-button madThrottleClick (throttleClick)="onThrottleClick()" [throttleTime]="throttleTime" color="primary">
      Test Button
    </button>
    <span data-cy="clicks-count">{{ clicks }}</span>`,
})
class TestWrapperComponent {
  clicks = 0;
  throttleTime = throttleTime;

  onThrottleClick(): void {
    this.clicks += 1;
  }
}

describe('throttle-click.directive.ts', () => {
  it('should mount component with ThrottleClickDirective', () => {
    cy.mount(TestWrapperComponent, {
      declarations: [ThrottleClickDirective],
      imports: [MatButtonModule],
    });
  });

  it('Should throttle click events', () => {
    cy.mount(TestWrapperComponent, {
      declarations: [ThrottleClickDirective],
      imports: [MatButtonModule],
    }).then((response) => {
      cy.spy(response.component, 'onThrottleClick').as('onThrottleClickSpy');
    });

    const btn = cy.get('button');
    btn.dblclick();
    // checks that the clicks have been throttled
    cy.getByCySel('clicks-count').should('contain.text', 1);
    cy.get('@onThrottleClickSpy').should('have.been.calledOnce');
    // Wait for throttleTime
    cy.wait(throttleTime);
    btn.click();
    // checks that the clicks have been throttled after throttleTime
    cy.get('span').should('contain.text', 2);
    cy.get('@onThrottleClickSpy').should('have.been.calledTwice');
  });
});
