import { QuickListComponent } from './quick-list.component';
import { ButtonModule } from '../button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { QuickListItem } from './base-quick-list.component';
import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReadOnlyFormFieldModule } from '../readonly/readonly-form-field.module';

let testItems = [
  { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
  { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
];

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [QuickListComponent],
    imports: [
      CommonModule,
      ButtonModule,
      MatIconModule,
      MatInputModule,
      NoopAnimationsModule,
      FormsModule,
      MatFormFieldModule,
      MatCheckboxModule,
      ReadOnlyFormFieldModule,
    ],
    providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
      },
    ],
    componentProperties,
  });
}

@Component({
  template: ` <form #form="ngForm">
    <mad-quick-list
      data-cy="quick-list"
      [addLabel]="addLabel"
      [allItems]="items"
      [addPossible]="addPossible"
      [removePossible]="removePossible"
      [readonly]="!textIsEditable"
      (added)="onItemAdded($event)"
      (removed)="onItemRemoved($event)"
      [minItems]="minItems"
      [maxItems]="maxItems"
    >
      <ng-template let-item>
        <span data-cy="quick-list-item" class="fx fx-row">
          <mad-readonly-form-field-wrapper [value]="item.firstName" [readonly]="!textIsEditable">
            <mat-form-field>
              <mat-label>First Name</mat-label>
              <input [(ngModel)]="item.firstName" [name]="'firstName-' + item.id" matInput />
            </mat-form-field>
          </mad-readonly-form-field-wrapper>

          <mad-readonly-form-field-wrapper [value]="item.lastName" [readonly]="!textIsEditable">
            <mat-form-field>
              <mat-label>Last Name</mat-label>
              <input [(ngModel)]="item.lastName" [name]="'lastName-' + item.id" matInput />
            </mat-form-field>
          </mad-readonly-form-field-wrapper>
        </span>
      </ng-template>
    </mad-quick-list>
  </form>`,
  styles: `
    mad-readonly-form-field-wrapper:not(:first-child) {
      margin-left: 2em;
    }
  `,
})
class TestWrapperComponent {
  addLabel = 'Add Item';
  items = testItems;
  textIsEditable = false;
  addPossible = true;
  removePossible = true;
  minItems = 0;
  maxItems = 3;

  onItemAdded(item: QuickListItem): void {
    console.log(item);
  }

  onItemRemoved(item: QuickListItem): void {
    console.log(item);
  }
}

describe('quick-list.component.cy.ts', () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    testItems = [
      { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
      { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
    ];
  });

  it('should mount QuickListComponent', () => {
    mountWrapperComponent();
  });

  it('should not show add and delete in readonly mode', () => {
    mountWrapperComponent();
    cy.getByCySel('quick-list').should('be.visible').and('have.attr', 'ng-reflect-readonly', 'true');
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
    cy.get('mad-readonly-form-field-wrapper').should('exist').and('be.visible');
  });

  it('should display proper add button label', () => {
    mountWrapperComponent({
      textIsEditable: true,
      addLabel: 'Test Label',
    });
    cy.getByCySel('add-item-button').should('contain.text', ' Test Label\n');
  });

  it('should display the correct number of items', () => {
    mountWrapperComponent();
    cy.getByCySel('quick-list-item').should('have.length', 2);
  });

  it('should add an item when add button is clicked', () => {
    mountWrapperComponent({
      textIsEditable: true,
    }).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });

    cy.getByCySel('add-item-button').click();
    cy.get('@onItemAddedSpy').should('have.been.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 3);
    cy.getByCySel('delete-item-button').should('have.length', 3);
  });

  it('should remove an item when delete button is clicked', () => {
    mountWrapperComponent({
      textIsEditable: true,
    }).then((response) => {
      cy.spy(response.component, 'onItemRemoved').as('onItemRemovedSpy');
    });
    cy.getByCySel('delete-item-button').first().click();
    cy.get('@onItemRemovedSpy').should('have.been.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 1);
    cy.getByCySel('delete-item-button').should('have.length', 1);
  });

  it('should disable add item button if max item limit reached', () => {
    mountWrapperComponent({
      textIsEditable: true,
    }).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });
    // add 3rd item
    cy.getByCySel('add-item-button').click();
    cy.get('@onItemAddedSpy').should('have.been.calledOnce');
    // max item reached, button should be disabled
    cy.getByCySel('add-item-button').should('have.attr', 'ng-reflect-disabled', 'true');
  });

  it('should not show delete item button if min item limit reached', () => {
    mountWrapperComponent({
      textIsEditable: true,
      minItems: 1,
    }).then((response) => {
      cy.spy(response.component, 'onItemRemoved').as('onItemRemovedSpy');
    });
    // delete first item
    cy.getByCySel('delete-item-button').first().click();
    cy.get('@onItemRemovedSpy').should('have.been.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 1);
    cy.getByCySel('delete-item-button').should('not.exist');
  });

  it('should disable add item button if add is not possible', () => {
    mountWrapperComponent({
      textIsEditable: true,
      addPossible: false,
    });
    cy.getByCySel('add-item-button').should('have.attr', 'ng-reflect-disabled', 'true');
  });

  it('should not show delete item button if min item limit reached', () => {
    mountWrapperComponent({
      textIsEditable: true,
      removePossible: false,
    });
    cy.getByCySel('delete-item-button').should('not.exist');
  });
});
