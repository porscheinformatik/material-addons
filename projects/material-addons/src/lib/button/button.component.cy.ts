import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from './button.module';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { checkButtonAttributes, checkMadButtonOpacityAndPointerEvent } from '../../../../../cypress/support/buttons-util';

@Component({
  template: `
    <mad-danger-button data-cy="danger-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      Delete
    </mad-danger-button>
  `,
})
class DangerButtonComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

@Component({
  template: `
    <mad-link-button data-cy="link-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()"> Link </mad-link-button>
  `,
})
class LinkButtonComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

@Component({
  template: `
    <mad-outline-button data-cy="outline-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      Outline
    </mad-outline-button>
  `,
})
class OutlineButtonComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

@Component({
  template: `
    <mad-icon-button data-cy="icon-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      <mat-icon>toll</mat-icon>
    </mad-icon-button>
  `,
})
class IconButtonComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

@Component({
  template: `
    <mad-primary-button data-cy="primary-button" title="Test tooltip" [disabled]="disabled" (click)="doSomething()">
      Primary
    </mad-primary-button>
  `,
})
class PrimaryButtonComponent {
  disabled: boolean = false;

  doSomething(): void {
    console.log('Clicked');
  }
}

const componentsToTest = [
  {
    component: DangerButtonComponent,
    selector: 'danger-button',
    text: 'Delete',
    color: 'warn',
    enabled: { pointerEvents: 'auto', opacity: '1' },
    disabled: { pointerEvents: 'auto', opacity: '1' },
  },
  {
    component: LinkButtonComponent,
    selector: 'link-button',
    text: 'Link',
    color: 'primary',
    enabled: { pointerEvents: 'auto', opacity: '1' },
    disabled: { pointerEvents: 'auto', opacity: '1' },
  },
  {
    component: IconButtonComponent,
    selector: 'icon-button',
    icon: 'toll',
    color: 'primary',
    enabled: { pointerEvents: 'auto', opacity: '1' },
    disabled: { pointerEvents: 'auto', opacity: '1' },
  },
  {
    component: OutlineButtonComponent,
    selector: 'outline-button',
    text: 'Outline',
    enabled: { pointerEvents: 'auto', opacity: '1' },
    disabled: { pointerEvents: 'auto', opacity: '1' },
  },
  {
    component: PrimaryButtonComponent,
    selector: 'primary-button',
    text: 'Primary',
    color: 'primary',
    enabled: { pointerEvents: 'auto', opacity: '1' },
    disabled: { pointerEvents: 'auto', opacity: '1' },
  },
];

function mountButtonTestWrapperComponent(component, properties = {}) {
  return cy.mount(component, {
    imports: [ButtonModule, MatButtonModule, MatIconModule],
    componentProperties: properties,
  });
}

function testComponentsBehavior(componentConfig) {
  describe(`${componentConfig.component.name}`, () => {
    it('renders correctly when enabled', () => {
      mountButtonTestWrapperComponent(componentConfig.component).then((response) => {
        // @ts-ignore
        cy.spy(response.component, 'doSomething').as('doSomethingSpy');
      });
      checkMadButtonOpacityAndPointerEvent(
        componentConfig.selector,
        componentConfig.enabled.pointerEvents,
        componentConfig.enabled.opacity,
      );
      checkButtonAttributes(componentConfig.text, componentConfig.color);
      const selectorButtonCy = cy.getByCySel(componentConfig.selector);
      selectorButtonCy.click();
      cy.get('@doSomethingSpy').should('have.been.calledOnce');
    });

    it('renders correctly when disabled', () => {
      mountButtonTestWrapperComponent(componentConfig.component, { disabled: true }).then((response) => {
        // @ts-ignore
        cy.spy(response.component, 'doSomething').as('doSomethingSpy');
      });
      checkMadButtonOpacityAndPointerEvent(
        componentConfig.selector,
        componentConfig.disabled.pointerEvents,
        componentConfig.disabled.opacity,
      );
      checkButtonAttributes(componentConfig.text, componentConfig.color);
      cy.getByCySel('button').should('be.disabled');
      cy.getByCySel(componentConfig.selector).click();
      cy.get('@doSomethingSpy').should('not.have.been.called');
    });
  });
}

describe('Button Components', () => {
  componentsToTest.forEach(testComponentsBehavior);
});
