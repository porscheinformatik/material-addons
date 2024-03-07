import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { ReadOnlyFormFieldModule } from '../../readonly/readonly-form-field.module';
import { ReactiveFormQuickListComponent } from './reactive-form-quick-list.component';

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [ReactiveFormQuickListComponent],
    imports: [
      CommonModule,
      ButtonModule,
      MatIconModule,
      MatInputModule,
      NoopAnimationsModule,
      FormsModule,
      MatFormFieldModule,
      ReadOnlyFormFieldModule,
      ReactiveFormsModule,
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
  template: ` <form [formGroup]="formGroup">
    <mad-reactive-form-quick-list
      data-cy="reactive-form-quick-list"
      [addLabel]="addLabel"
      [formArray]="array"
      [addPossible]="addPossible"
      [removePossible]="removePossible"
      [readonly]="!textIsEditable"
      [maxItems]="maxItems"
      [minItems]="minItems"
      (added)="onItemAdded()"
      (removed)="onItemRemoved()"
    >
      <ng-template let-item>
        <form data-cy="reactive-form-quick-list-item" [formGroup]="item">
          <span class="fx fx-row">
            <mad-readonly-form-field-wrapper [value]="item.get('id').getRawValue()" [readonly]="!textIsEditable">
              <mat-form-field class="form-group">
                <mat-label>Id</mat-label>
                <input formControlName="id" matInput />
              </mat-form-field>
            </mad-readonly-form-field-wrapper>

            <mad-readonly-form-field-wrapper [value]="item.get('name').getRawValue()" [readonly]="!textIsEditable">
              <mat-form-field class="form-group">
                <mat-label>Name</mat-label>
                <input formControlName="name" matInput />
              </mat-form-field>
            </mad-readonly-form-field-wrapper>
          </span>
        </form>
      </ng-template>
    </mad-reactive-form-quick-list>
  </form>`,
  styles: `
    mad-readonly-form-field-wrapper:not(:first-child) {
      margin-left: 2em;
    }
  `,
})
class TestWrapperComponent implements OnInit {
  addLabel = 'Add';
  minItems = 0;
  maxItems = 3;
  formGroup: FormGroup;
  textIsEditable = false;
  addPossible = true;
  removePossible = true;

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {}

  get array(): FormArray {
    return this.formGroup?.get('array') as FormArray;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      test: 'test',
      array: this.formBuilder.array([
        this.formBuilder.group({
          id: 1,
          name: 'Name 1',
        }),
        this.formBuilder.group({
          id: 2,
          name: 'Name 2',
        }),
      ]),
    });
  }

  onItemAdded(): void {
    this.array.push(
      this.formBuilder.group({
        id: null,
        name: null,
      }),
    );
    this.formGroup.updateValueAndValidity();
    this.cd.detectChanges(); // to avoid ExpressionChangedAfterItHasBeenCheckedError on add button click
  }

  onItemRemoved(): void {}
}

describe('reactive-form-quick-list.component.cy.ts', () => {
  beforeEach(() => {
    cy.viewport(600, 600);
  });

  it('should mount ReactiveFormQuickListComponent', () => {
    mountWrapperComponent();
  });

  it('should not show add and delete buttons in readonly mode', () => {
    mountWrapperComponent();

    cy.getByCySel('reactive-form-quick-list').should('be.visible').and('have.attr', 'ng-reflect-readonly', 'true');
    cy.getByCySel('reactive-form-quick-list-item').should('be.visible');
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
  });

  it('should mount ReactiveFormQuickListComponent', () => {
    mountWrapperComponent({
      textIsEditable: true,
    });

    cy.getByCySel('reactive-form-quick-list').should('be.visible');
    cy.getByCySel('reactive-form-quick-list-item').should('be.visible');
    cy.getByCySel('add-item-button').should('be.visible');
    cy.getByCySel('delete-item-button').should('be.visible');
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
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 2);
  });

  it('should add an item when add button is clicked', () => {
    mountWrapperComponent({
      textIsEditable: true,
    }).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });

    cy.getByCySel('add-item-button').click();
    cy.get('@onItemAddedSpy').should('have.been.calledOnce');
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 3);
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
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 1);
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
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 1);
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
