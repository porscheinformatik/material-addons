import { Component } from '@angular/core';
import { QuickListItem } from '../base-quick-list.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReadOnlyFormFieldModule } from '../../readonly/readonly-form-field.module';
import { QuickListCompactComponent } from './quick-list-compact.component';

let testItems = [
  { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
  { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
];

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [QuickListCompactComponent],
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
    <mad-quick-list-compact
      data-cy="quick-list-compact"
      [addLabel]="addLabel"
      [allItems]="items"
      [addPossible]="addPossible"
      [removePossible]="removePossible"
      [readonly]="!textIsEditable"
      [maxItems]="maxItems"
      [minItems]="minItems"
      (added)="onItemAdded($event)"
      (removed)="onItemRemoved($event)"
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
    </mad-quick-list-compact>
  </form>`,
  styles: `
    mad-readonly-form-field-wrapper:not(:first-child) {
      margin-left: 2em;
    }
  `,
})
class TestWrapperComponent {
  addLabel = 'Add Item';
  items = [];
  textIsEditable = true;
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

describe('quick-list-compact.component.cy.ts', () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    testItems = [
      { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
      { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
    ];
  });

  it('should mount QuickListCompactComponent', () => {
    mountWrapperComponent();
  });

  it('should show add item button if there is no items', () => {
    mountWrapperComponent();
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
    cy.getByCySel('add-first-item-button').should('be.visible');
  });

  it('should display proper add item button label', () => {
    mountWrapperComponent({
      addLabel: 'Test Label',
    });
    cy.getByCySel('add-first-item-button').should('contain.text', ' Test Label\n');
  });

  it('should add first item when click on add button', () => {
    mountWrapperComponent().then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });
    cy.getByCySel('add-first-item-button').click();
    cy.get('@onItemAddedSpy').should('be.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 1);
    cy.getByCySel('add-first-item-button').should('not.exist');
  });

  it('should show delete and add icons on item, but not add button with label', () => {
    mountWrapperComponent({
      items: [testItems[0]],
    });
    cy.getByCySel('quick-list-item').should('have.length', 1);
    cy.getByCySel('add-item-button').should('be.visible').and('contain.text', 'add_circle_outline');
    cy.getByCySel('delete-item-button').should('be.visible').and('contain.text', 'delete');
    cy.getByCySel('add-first-item-button').should('not.exist');
  });

  it('should add an item when add item button is clicked', () => {
    mountWrapperComponent({
      items: [testItems[0]],
    }).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });
    cy.getByCySel('quick-list-item').should('have.length', 1);
    cy.getByCySel('add-item-button').click();
    cy.get('@onItemAddedSpy').should('be.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 2);
  });

  it('should show add button on last item and delete on all items', () => {
    mountWrapperComponent({
      items: testItems,
    });
    cy.getByCySel('quick-list-item').should('have.length', 2);
    // check general count
    cy.getByCySel('add-item-button').should('have.length', 1);
    cy.getByCySel('delete-item-button').should('have.length', 2);
    // check first item has only delete button
    cy.getByCySel('quick-list-item').eq(0).siblings().should('have.length', 1).and('contain.text', 'delete');
    // check second item has add and delete buttons
    cy.getByCySel('quick-list-item').eq(1).siblings().should('have.length', 2);
    cy.getByCySel('quick-list-item').eq(1).siblings().eq(0).should('contain.text', 'delete'); //delete button
    cy.getByCySel('quick-list-item').eq(1).siblings().eq(1).should('contain.text', 'add_circle_outline'); //add item button
  });

  it('should delete an item when delete item button is clicked', () => {
    mountWrapperComponent({
      items: testItems,
    }).then((response) => {
      cy.spy(response.component, 'onItemRemoved').as('onItemRemovedSpy');
    });
    cy.getByCySel('quick-list-item').should('have.length', 2);
    cy.getByCySel('delete-item-button').first().click();
    cy.get('@onItemRemovedSpy').should('be.calledOnce');
    cy.getByCySel('quick-list-item').should('have.length', 1);
  });

  it('should not show remove button and disable add button when addPossible and removePossible are false', () => {
    mountWrapperComponent({
      items: testItems,
      addPossible: false,
      removePossible: false,
    });

    cy.getByCySel('add-item-button').should('be.visible').and('have.attr', 'ng-reflect-disabled', 'true');
    cy.getByCySel('delete-item-button').should('not.exist');
  });

  it('should disable add button if max item limit reached', () => {
    mountWrapperComponent({
      items: testItems,
    });
    // add 3rd item
    cy.getByCySel('add-item-button').click();
    cy.getByCySel('quick-list-item').should('have.length', 3);
    cy.getByCySel('add-item-button').should('be.visible').and('have.attr', 'ng-reflect-disabled', 'true');
  });

  it('should not show delete button if min item limit reached', () => {
    mountWrapperComponent({
      items: testItems,
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
});
