import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '../button/button.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './card.component';
import { Component, Type } from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ThrottleClickModule } from '../throttle-click/throttle-click.module';
import { ReadOnlyFormFieldComponent } from '../readonly/readonly-form-field/readonly-form-field.component';
import { ReadOnlyFormFieldWrapperComponent } from '../readonly/readonly-form-field-wrapper/readonly-form-field-wrapper.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MountResponse } from 'cypress/angular';

const commonImports = [MatCardModule, MatIconModule, ButtonModule, NoopAnimationsModule];

function mountWrapperComponent(component: Type<ReadonlyWrapperComponent | EditableWrapperComponent>, componentProperties = {}) {
  return cy.mount(component, {
    imports: [
      MatFormFieldModule,
      MatCardModule,
      MatIconModule,
      ButtonModule,
      MatButtonModule,
      ThrottleClickModule,
      NoopAnimationsModule,
      MatTooltipModule,
      MatInputModule,
      FormsModule,
    ],
    declarations: [MatLabel, CardComponent, ReadOnlyFormFieldComponent, ReadOnlyFormFieldWrapperComponent],
    providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } }],
    componentProperties,
  });
}

@Component({
  template: `
    <mad-card [expandable]="isExpandable" [readonly]="true" title="Readonly Card">
      <mad-readonly-form-field-wrapper data-cy="form-wrapper" [readonly]="true" [value]="firstName">
        <mat-form-field class="form-group">
          <mat-label>First Name</mat-label>
          <input [(ngModel)]="firstName" matInput name="firstName" />
        </mat-form-field>
      </mad-readonly-form-field-wrapper>
    </mad-card>
  `,
})
class ReadonlyWrapperComponent {
  firstName = 'Cypress';
  isExpandable = false;
}

@Component({
  template: `
    <mad-card
      (additionalAction)="onAdditionalAction()"
      (cancel)="onCancel()"
      (edit)="onEditMode()"
      (save)="onSave()"
      [additionalActionIcon]="'help'"
      [cancelDisabled]="isLoading"
      [editMode]="isInEditMode"
      [expandable]="false"
      [readonly]="false"
      [saveDisabled]="isLoading"
      cancelText="Cancel test"
      saveText="Save test"
      title="Editable Card"
    >
      <mad-readonly-form-field-wrapper data-cy="form-wrapper" [readonly]="!isInEditMode" [value]="firstName">
        <mat-form-field class="form-group">
          <mat-label>First Name</mat-label>
          <input data-cy="firstname-input" [(ngModel)]="firstName" matInput name="firstName" />
        </mat-form-field>
      </mad-readonly-form-field-wrapper>
    </mad-card>
  `,
})
class EditableWrapperComponent {
  firstName = 'Cypress';
  isInEditMode = false;
  isLoading = false;

  onEditMode(): void {
    this.isInEditMode = true;
  }

  onCancel(): void {
    this.firstName = 'Cypress';
    this.isInEditMode = false;
  }

  onSave(): void {
    this.isLoading = true;
    // simulate a HTTP call to the backend
    timer(1500)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => (this.isInEditMode = false));
  }

  onAdditionalAction() {
    console.log('additional action was clicked!');
  }
}

describe('card.component.cy.ts', () => {
  it('should properly mount the CardComponent', () => {
    cy.mount(CardComponent, {
      imports: commonImports,
    });
  });

  describe('structural tests of CardComponent', () => {
    it('should have proper default structure', () => {
      cy.mount(CardComponent, {
        imports: commonImports,
      });

      cy.get('mat-card').should('exist');
      // header default structure
      cy.get('mat-card-header').should('exist');
      cy.get('mat-card-header').find('mat-card-title-group').should('exist');
      cy.getByCySel('card-title').should('exist');
      cy.getByCySel('card-title').should('have.class', 'small-title-container');
      cy.getByCySel('title-buttons-block').should('exist');
      cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 1);
      cy.getByTestId('collapse-btn').should('exist');
      cy.getByTestId('collapse-btn').find('mat-icon').contains('keyboard_arrow_down');
      cy.getByTestId('additional-btn').should('not.exist');
      cy.getByTestId('edit-btn').should('not.exist');
      // content default structure
      cy.get('mat-card-content').should('exist');
      // action buttons structure
      cy.get('mat-card-actions').should('not.exist');
    });

    it('should properly show card title', () => {
      cy.mount(CardComponent, {
        imports: commonImports,
        componentProperties: {
          title: 'Test Title',
        },
      });

      cy.getByCySel('card-title').should('exist');
      cy.getByCySel('card-title').contains('Test Title');
      cy.getByCySel('card-title').should('have.class', 'small-title-container');
    });

    it('should properly show card header (title, collapse icon and additional icon) and emit event', () => {
      const onAdditionalActionSpy = cy.spy().as('additionalActionSpy');
      cy.mount(CardComponent, {
        imports: commonImports,
        componentProperties: {
          title: 'Test Title',
          additionalActionIcon: 'help',
          additionalAction: {
            emit: onAdditionalActionSpy,
          } as any,
        },
      });

      cy.getByCySel('card-title').should('exist');
      cy.getByCySel('card-title').contains('Test Title');
      cy.getByCySel('card-title').should('have.class', 'small-title-container');

      cy.getByCySel('title-buttons-block').should('exist');
      cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 2);

      cy.getByTestId('collapse-btn').should('exist');
      cy.getByTestId('collapse-btn').find('mat-icon').contains('keyboard_arrow_down');

      cy.getByTestId('additional-btn').should('exist');
      cy.getByTestId('additional-btn').find('mat-icon').contains('help');
      cy.getByTestId('additional-btn').click();
      cy.get('@additionalActionSpy').should('have.been.calledOnce');

      cy.getByTestId('edit-btn').should('not.exist');
    });

    it('should properly show card header (title, collapse icon, additional icon and edit icon) and emit events', () => {
      const onAdditionalActionSpy = cy.spy().as('additionalActionSpy');
      const onEditSpy = cy.spy().as('editSpy');
      cy.mount(CardComponent, {
        imports: commonImports,
        componentProperties: {
          readonly: false,
          title: 'Test Title',
          additionalActionIcon: 'help',
          additionalAction: {
            emit: onAdditionalActionSpy,
          } as any,
          edit: {
            emit: onEditSpy,
          } as any,
        },
      });

      cy.getByCySel('card-title').should('exist');
      cy.getByCySel('card-title').contains('Test Title');
      cy.getByCySel('card-title').should('have.class', 'small-title-container');

      cy.getByCySel('title-buttons-block').should('exist');
      cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 3);

      cy.getByTestId('collapse-btn').should('exist');
      cy.getByTestId('collapse-btn').find('mat-icon').contains('keyboard_arrow_down');

      cy.getByTestId('additional-btn').should('exist');
      cy.getByTestId('additional-btn').find('mat-icon').contains('help');
      cy.getByTestId('additional-btn').click();
      cy.get('@additionalActionSpy').should('have.been.calledOnce');

      cy.getByTestId('edit-btn').should('exist');
      cy.getByTestId('edit-btn').find('mat-icon').contains('create');
      cy.getByTestId('edit-btn').click();
      cy.get('@editSpy').should('have.been.calledOnce');
    });

    it('should show card content if click on edit button and emit event', () => {
      const onEditSpy = cy.spy().as('editSpy');
      cy.mount(CardComponent, {
        imports: commonImports,
        componentProperties: {
          readonly: false,
          expanded: false,
          title: 'Test Title',
          edit: {
            emit: onEditSpy,
          } as any,
        },
      });
      cy.get('mat-card-content').should('not.exist');

      cy.getByTestId('edit-btn').should('exist');
      cy.getByTestId('edit-btn').find('mat-icon').contains('create');
      cy.getByTestId('edit-btn').click();
      cy.get('@editSpy').should('have.been.calledOnce');

      cy.get('mat-card-content').should('exist');
    });

    it('should show card action buttons and emit events', () => {
      const onSaveSpy = cy.spy().as('saveSpy');
      const onCancelSpy = cy.spy().as('cancelSpy');
      cy.mount(CardComponent, {
        imports: commonImports,
        componentProperties: {
          readonly: false,
          editMode: true,
          saveText: 'Test save',
          cancelText: 'Test cancel',
          save: {
            emit: onSaveSpy,
          } as any,
          cancel: {
            emit: onCancelSpy,
          } as any,
        },
      });

      cy.get('mat-card-actions').should('exist');

      cy.getByTestId('save-btn').should('exist');
      cy.getByTestId('save-btn').contains('Test save');
      cy.getByTestId('save-btn').trigger('throttleClick');
      cy.get('@saveSpy').should('have.been.calledOnce');

      cy.getByTestId('cancel-btn').should('exist');
      cy.getByTestId('cancel-btn').contains('Test cancel');
      cy.getByTestId('cancel-btn').click();
      cy.get('@cancelSpy').should('have.been.calledOnce');
    });
  });

  describe('use cases of CardComponent', () => {
    describe('Readonly', () => {
      it('should properly show CardComponent in readonly mode without expand', () => {
        mountWrapperComponent(ReadonlyWrapperComponent);

        // shows correct header content
        cy.getByCySel('card-title').should('exist');
        cy.getByCySel('card-title').contains('Readonly Card');
        // don't shows buttons in header
        cy.getByCySel('title-buttons-block').should('exist');
        cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 0);
        cy.getByTestId('collapse-btn').should('not.exist');
        cy.getByTestId('additional-btn').should('not.exist');
        cy.getByTestId('edit-btn').should('not.exist');
        // shows content
        cy.get('mat-card-content').should('exist');
        cy.get('mad-readonly-form-field').should('exist');
        cy.get('mad-readonly-form-field').find('mat-form-field').should('exist');
        // don't shows action buttons
        cy.get('mat-card-actions').should('not.exist');
      });

      it('should properly show CardComponent in readonly mode with expand', () => {
        mountWrapperComponent(ReadonlyWrapperComponent, { isExpandable: true });

        // shows correct header content
        cy.getByCySel('card-title').should('exist');
        cy.getByCySel('card-title').contains('Readonly Card');
        // don't shows buttons in header
        cy.getByCySel('title-buttons-block').should('exist');
        cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 1);
        cy.getByTestId('collapse-btn').should('exist');
        cy.getByTestId('additional-btn').should('not.exist');
        cy.getByTestId('edit-btn').should('not.exist');
        // shows content
        cy.get('mat-card-content').should('exist');
        cy.get('mad-readonly-form-field').should('exist');
        cy.get('mad-readonly-form-field').find('mat-form-field').should('exist');
        // don't shows action buttons
        cy.get('mat-card-actions').should('not.exist');
        // click on collapse button to check that content and action buttons are not present
        cy.getByTestId('collapse-btn').click();
        cy.get('mat-card-content').should('not.exist');
        cy.get('mat-card-actions').should('not.exist');
      });
    });

    describe('Editable', () => {
      it('should properly show CardComponent in editable mode', () => {
        mountWrapperComponent(EditableWrapperComponent);

        // shows correct header content
        cy.getByCySel('card-title').should('exist');
        cy.getByCySel('card-title').contains('Editable Card');
        // shows proper buttons in header
        cy.getByCySel('title-buttons-block').should('exist');
        cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 2);
        cy.getByTestId('collapse-btn').should('not.exist');
        cy.getByTestId('additional-btn').should('exist');
        cy.getByTestId('edit-btn').should('exist');
        // shows content
        cy.get('mat-card-content').should('exist');
        cy.get('mad-readonly-form-field').should('exist');
        cy.get('mad-readonly-form-field').find('mat-form-field').should('exist');
        // don't shows action buttons
        cy.get('mat-card-actions').should('not.exist');
      });

      it('should properly show CardComponent when edit mode clicked', () => {
        mountWrapperComponent(EditableWrapperComponent).then((response: MountResponse<EditableWrapperComponent>) => {
          cy.spy(response.component, 'onEditMode').as('editSpy');
        });

        cy.getByCySel('card-title').should('exist');
        // click on edit button
        cy.getByTestId('edit-btn').should('exist').click();
        cy.get('@editSpy').should('have.been.calledOnce');
        // shows correct header content
        cy.getByCySel('card-title').contains('Editable Card');
        cy.getByCySel('title-buttons-block').should('exist');
        cy.getByCySel('title-buttons-block').find('mad-icon-button').should('have.length', 1);
        cy.getByTestId('collapse-btn').should('not.exist');
        cy.getByTestId('additional-btn').should('exist');
        cy.getByTestId('edit-btn').should('not.exist');
        // shows content
        cy.get('mat-card-content').should('exist');
        cy.get('mad-readonly-form-field').should('not.exist');
        // shows correct action buttons
        cy.get('mat-card-actions').should('exist');
        cy.getByTestId('save-btn').should('exist');
        cy.getByTestId('save-btn').contains('Save test');

        cy.getByTestId('cancel-btn').should('exist');
        cy.getByTestId('cancel-btn').contains('Cancel test');
      });

      it('should properly emit additional action in edit mode', () => {
        mountWrapperComponent(EditableWrapperComponent).then((response: MountResponse<EditableWrapperComponent>) => {
          cy.spy(response.component, 'onAdditionalAction').as('additionalActionSpy');
          cy.spy(response.component, 'onEditMode').as('editSpy');
        });

        cy.getByTestId('edit-btn').should('exist').click();
        cy.get('@editSpy').should('have.been.calledOnce');

        cy.getByTestId('additional-btn').should('exist').click();
        cy.get('@additionalActionSpy').should('have.been.calledOnce');
      });

      it('should properly emit save event in edit mode and change mode to readonly', () => {
        mountWrapperComponent(EditableWrapperComponent).then((response: MountResponse<EditableWrapperComponent>) => {
          cy.spy(response.component, 'onEditMode').as('editSpy');
          cy.spy(response.component, 'onSave').as('saveSpy');
        });

        cy.getByTestId('edit-btn').should('exist').click();
        cy.get('@editSpy').should('have.been.calledOnce');

        cy.getByTestId('save-btn').should('exist').click();
        cy.get('@saveSpy').should('have.been.calledOnce');
        // check buttons are disabled when isLoading
        cy.getByTestId('save-btn').should('have.attr', 'ng-reflect-disabled', 'true');
        cy.getByTestId('cancel-btn').should('have.attr', 'ng-reflect-disabled', 'true');
        // shows edit button again
        cy.getByTestId('edit-btn').should('exist');
        // shows readonly content
        cy.get('mat-card-content').should('exist');
        cy.get('mad-readonly-form-field').should('exist');
        cy.get('mad-readonly-form-field').find('mat-form-field').should('exist');

        // don't shows action buttons
        cy.get('mat-card-actions').should('not.exist');
      });

      it('should properly emit cancel event in edit mode and change mode to readonly', () => {
        mountWrapperComponent(EditableWrapperComponent).then((response: MountResponse<EditableWrapperComponent>) => {
          cy.spy(response.component, 'onEditMode').as('editSpy');
          cy.spy(response.component, 'onCancel').as('cancelSpy');
        });

        cy.getByTestId('edit-btn').should('exist').click();
        cy.getByCySel('firstname-input').type(' Test');
        // click cancel
        cy.getByTestId('cancel-btn').should('exist').click();
        cy.get('@cancelSpy').should('have.been.calledOnce');
        // shows edit button again
        cy.getByTestId('edit-btn').should('exist');
        // don't shows action buttons
        cy.get('mat-card-actions').should('not.exist');
      });
    });
  });
});
