import { QuickListComponent } from './quick-list.component';
import { ButtonModule } from '../button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { QuickListItem } from './base-quick-list.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReadOnlyFormFieldModule } from '../readonly/readonly-form-field.module';
import { checkVisibilityBasedOnState, testAddRemoveFunctionality } from '../../../../../cypress/support/quick-list-util';
import { ReactiveFormQuickListComponent } from './reactive-form-quick-list/reactive-form-quick-list.component';
import {QuickListCompactComponent} from './quick-list-compact/quick-list-compact.component';
import {
  ReactiveFormQuickListCompactComponent
} from './reactive-form-quick-list-compact/reactive-form-quick-list-compact.component';

function setupComponent(component, componentProperties = {}) {
  return cy.mount(component, {
    declarations: [QuickListComponent, ReactiveFormQuickListComponent, QuickListCompactComponent, ReactiveFormQuickListCompactComponent],
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
class QuickListWrapperComponent {
  addLabel = 'Add Item';
  items = [
    { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
    { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
  ];
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
class ReactiveFormQuickListWrapperComponent implements OnInit {
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
        <span data-cy="quick-list-compact-item" class="fx fx-row">
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
class QuickListCompactWrapperComponent {
  addLabel = 'Add Item';
  items = [
    { id: '1', firstName: 'FirstItem', lastName: 'FirstItem1' },
    { id: '2', firstName: 'SecondItem', lastName: 'SecondItem2' },
  ];
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
        <form data-cy="reactive-form-quick-list-compact-item" [formGroup]="item">
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
class ReactiveQuickListCompactWrapperComponent implements OnInit {
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

const componentsToTest = [
  {
    component: QuickListWrapperComponent,
    selector: 'quick-list'
  },
  {
    component: ReactiveFormQuickListWrapperComponent,
    selector: 'reactive-form-quick-list',
  },
  {
    component: QuickListCompactWrapperComponent,
    selector: 'quick-list-compact',
  },
  {
    component: ReactiveQuickListCompactWrapperComponent,
    selector: 'reactive-form-quick-list-compact',
  }
];

function testQuickListComponentsBehavior(componentConfig) {
  describe(`${componentConfig.component.name}`, () => {
    beforeEach(() => {
      cy.viewport(600, 600);
    });

    it(`mounts ${componentConfig.component.name}`, () => {
      setupComponent(componentConfig.component);
      cy.getByCySel(componentConfig.selector).should('be.visible');
    });

    it('handles add and remove functionality', () => {
      setupComponent(componentConfig.component, { textIsEditable: true }).then((response) => {
        // @ts-ignore
        cy.spy(response.component, 'onItemAdded').as('onItemAddedSpy');
        // @ts-ignore
        cy.spy(response.component, 'onItemRemoved').as('onItemRemovedSpy');
      });
      testAddRemoveFunctionality(componentConfig.selector);
    });

    it('checks button visibility based on state', () => {
      setupComponent(componentConfig.component, { textIsEditable: false });
      checkVisibilityBasedOnState(false);
    });

    it('shows correct add button label', () => {
      if (componentConfig.component.name !== 'QuickListCompactWrapperComponent' && componentConfig.component.name !== 'ReactiveQuickListCompactWrapperComponent') {
        setupComponent(componentConfig.component, { textIsEditable: true, addLabel: 'Test Label' });
        cy.getByCySel('add-item-button').should('contain.text', 'Test Label');
      } else {
        setupComponent(componentConfig.component, { textIsEditable: true, addLabel: 'Test Label', items: [], formControls: [] });
        cy.getByCySel('add-first-item-button').should('contain.text', 'Test Label');
      }
    });

    it('should disable buttons based on props', () => {
      setupComponent(componentConfig.component, { textIsEditable: true, addPossible: false, removePossible: false });
      cy.getByCySel('add-item-button').should('have.attr', 'ng-reflect-disabled', 'true');
      cy.getByCySel('delete-item-button').should('not.exist');
    });
  });
}

describe('Quick List Components', () => {
  componentsToTest.forEach(testQuickListComponentsBehavior);
});
