import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { ReadOnlyFormFieldModule } from '../../readonly/readonly-form-field.module';
import { ReactiveFormQuickListCompactComponent } from './reactive-form-quick-list-compact.component';

const oneTestControl = [{ id: 1, name: 'Test1' }];

function mountWrapperComponent(componentProperties = {}) {
  return cy.mount(TestWrapperComponent, {
    declarations: [ReactiveFormQuickListCompactComponent],
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
    <mad-reactive-form-quick-list-compact
      data-cy="reactive-form-quick-list-compact"
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
    </mad-reactive-form-quick-list-compact>
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
  textIsEditable = true;
  addPossible = true;
  removePossible = true;

  formControls = [
    { id: 1, name: 'Test1' },
    { id: 2, name: 'Test2' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
  ) {}

  get array(): FormArray {
    return this.formGroup?.get('array') as FormArray;
  }

  ngOnInit(): void {
    const formArr = this.formControls.map((control) => this.formBuilder.group(control));
    this.formGroup = this.formBuilder.group({
      test: 'test',
      array: this.formBuilder.array(formArr),
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

  it('should mount ReactiveFormQuickListCompactComponent', () => {
    mountWrapperComponent();
  });

  it('should not show add and delete buttons in readonly mode', () => {
    mountWrapperComponent({
      textIsEditable: false,
    });

    cy.getByCySel('reactive-form-quick-list-compact').should('be.visible').and('have.attr', 'ng-reflect-readonly', 'true');
    cy.getByCySel('reactive-form-quick-list-item').should('be.visible');
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('add-first-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
  });

  it('should show add item button if there is no items', () => {
    mountWrapperComponent({
      formControls: [],
    });
    cy.getByCySel('add-item-button').should('not.exist');
    cy.getByCySel('delete-item-button').should('not.exist');
    cy.getByCySel('add-first-item-button').should('be.visible');
  });

  it('should display proper add first item button label', () => {
    mountWrapperComponent({
      addLabel: 'Test Label',
      formControls: [],
    });
    cy.getByCySel('add-first-item-button').should('contain.text', ' Test Label\n');
  });

  it('should add first item when click on add button', () => {
    mountWrapperComponent({
      formControls: [],
    }).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });
    cy.getByCySel('add-first-item-button').click();
    cy.get('@onItemAddedSpy').should('be.calledOnce');
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 1);
    cy.getByCySel('add-first-item-button').should('not.exist');
  });

  it('should show delete and add icons on item, but not add button with label', () => {
    mountWrapperComponent({
      formControls: oneTestControl,
    });
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 1);
    cy.getByCySel('add-item-button').should('be.visible').and('contain.text', 'add_circle_outline');
    cy.getByCySel('delete-item-button').should('be.visible').and('contain.text', 'delete');
    cy.getByCySel('add-first-item-button').should('not.exist');
  });

  it('should add an item when add item button is clicked', () => {
    mountWrapperComponent({}).then((response) => {
      cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
    });
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 2);
    cy.getByCySel('add-item-button').click();
    cy.get('@onItemAddedSpy').should('be.calledOnce');
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 3);
  });

  it('should show add button on last item and delete on all items', () => {
    mountWrapperComponent();
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 2);
    // check general count
    cy.getByCySel('add-item-button').should('have.length', 1);
    cy.getByCySel('delete-item-button').should('have.length', 2);
    // check first item has only delete button
    cy.getByCySel('reactive-form-quick-list-item').eq(0).siblings().should('have.length', 1).and('contain.text', 'delete');
    // check second item has add and delete buttons
    cy.getByCySel('reactive-form-quick-list-item').eq(1).siblings().should('have.length', 2);
    cy.getByCySel('reactive-form-quick-list-item').eq(1).siblings().eq(0).should('contain.text', 'delete'); //delete button
    cy.getByCySel('reactive-form-quick-list-item').eq(1).siblings().eq(1).should('contain.text', 'add_circle_outline'); //add item button
  });

  it('should delete an item when delete item button is clicked', () => {
    mountWrapperComponent().then((response) => {
      cy.spy(response.component, 'onItemRemoved').as('onItemRemovedSpy');
    });
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 2);
    cy.getByCySel('delete-item-button').first().click();
    cy.get('@onItemRemovedSpy').should('be.calledOnce');
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 1);
  });

  it('should not show remove button and disable add button when addPossible and removePossible are false', () => {
    mountWrapperComponent({
      addPossible: false,
      removePossible: false,
    });

    cy.getByCySel('add-item-button').should('be.visible').and('have.attr', 'ng-reflect-disabled', 'true');
    cy.getByCySel('delete-item-button').should('not.exist');
  });

  it('should disable add button if max item limit reached', () => {
    mountWrapperComponent();
    // add 3rd item
    cy.getByCySel('add-item-button').click();
    cy.getByCySel('reactive-form-quick-list-item').should('have.length', 3);
    cy.getByCySel('add-item-button').should('be.visible').and('have.attr', 'ng-reflect-disabled', 'true');
  });

  it('should not show delete button if min item limit reached', () => {
    mountWrapperComponent({
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
});
