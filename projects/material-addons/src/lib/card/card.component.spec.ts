import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '../button/button.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent, MatCardModule, MatIconModule, ButtonModule, NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create CardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call onEdit when edit button is clicked', () => {
    jest.spyOn(component, 'onEdit');
    // Set the conditions to enable the button
    component.readonly = false;
    component.editMode = false;
    component.expanded = false;
    fixture.detectChanges();

    const editButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="edit-btn"]'));
    expect(editButtonDebugElement).toBeDefined();
    editButtonDebugElement.triggerEventHandler('click', null);
    expect(component.onEdit).toHaveBeenCalledTimes(1);
    expect(component.expanded).toBeTruthy();
  });

  it('should not render the edit button when readOnly and editMode are true', () => {
    // Set the conditions to disable the button
    component.readonly = true;
    component.editMode = true;
    fixture.detectChanges();

    const editButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="edit-btn"]'));
    expect(editButtonDebugElement).toBeNull();
  });

  it('should call onCancel method when cancel is triggered', () => {
    jest.spyOn(component, 'onCancel');
    // Set the conditions to enable the button
    component.readonly = false;
    component.editMode = true;
    fixture.detectChanges();

    const cancelButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));
    expect(cancelButtonDebugElement).toBeDefined();
    cancelButtonDebugElement.triggerEventHandler('click', null);
    expect(component.onCancel).toHaveBeenCalledTimes(1);
  });

  it('cancel should be disabled when cancelDisabled is true', async () => {
    jest.spyOn(component, 'onCancel');
    // Set the conditions to disable the button
    component.readonly = false;
    component.editMode = true;
    component.cancelDisabled = true;
    fixture.detectChanges();

    const cancelButtonElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));
    expect(cancelButtonElement).toBeDefined();
    expect(cancelButtonElement.nativeElement.getAttribute('ng-reflect-disabled')).toBeTruthy();
  });

  it('should call onSave method when save is triggered', () => {
    jest.spyOn(component, 'onSave');
    // Set the conditions to enable the button
    component.readonly = false;
    component.editMode = true;
    fixture.detectChanges();

    const saveButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="save-btn"]'));
    saveButtonDebugElement.triggerEventHandler('throttleClick', null);
    expect(component.onSave).toHaveBeenCalledTimes(1);
  });

  it('cancel and save buttons should not be visible', () => {
    // Set the conditions to hide the buttons
    component.readonly = true;
    component.editMode = false;
    fixture.detectChanges();

    const cardActionsDebugElement = fixture.debugElement.query(By.css('mat-card-actions'));
    expect(cardActionsDebugElement).toBeNull();
  });

  it('cancel and save buttons should be visible', () => {
    // Set the conditions to show the buttons
    component.readonly = false;
    component.editMode = true;
    fixture.detectChanges();

    const cardActionsDebugElement = fixture.debugElement.query(By.css('mat-card-actions'));
    const saveButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="save-btn"]'));
    const cancelButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));
    expect(cardActionsDebugElement).toBeDefined();
    expect(saveButtonDebugElement).toBeDefined();
    expect(cancelButtonDebugElement).toBeDefined();
  });

  it('toggleCollapse method should toggle the expandable', () => {
    jest.spyOn(component, 'toggleCollapse');
    // Set the conditions to enable the button
    component.expandable = true;
    component.expanded = false;
    component.editMode = false;
    fixture.detectChanges();

    const toggleButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="collapse-btn"]'));
    toggleButtonDebugElement.triggerEventHandler('click', null);
    expect(component.toggleCollapse).toHaveBeenCalledTimes(1);
    expect(component.expanded).toBe(true);
  });

  it('should show mat-card-content when expanded is true', () => {
    // Set expanded as true
    component.expanded = true;
    fixture.detectChanges();

    const contentDebugElement = fixture.debugElement.query(By.css('mat-card-content'));
    expect(contentDebugElement).toBeDefined();
  });

  it('should not show mat-card-content when expanded is false', () => {
    // Set expanded as false
    component.expanded = false;
    fixture.detectChanges();

    const contentDebugElement = fixture.debugElement.query(By.css('mat-card-content'));
    expect(contentDebugElement).toBeNull();
  });

  it('should display additional button when additionalActionIcon is specified', () => {
    // Set value for additionalActionIcon
    component.additionalActionIcon = 'someIcon';
    fixture.detectChanges();

    const buttonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    expect(buttonDebugElement).toBeDefined();
  });

  it('should not display additional button when additionalActionIcon is not specified', () => {
    // Set no value for additionalActionIcon
    component.additionalActionIcon = '';
    fixture.detectChanges();

    const buttonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    expect(buttonDebugElement).toBeNull();
  });

  it('should call additionalActionClicked() when additional button is clicked', () => {
    jest.spyOn(component, 'additionalActionClicked');
    // Set some value for additionalActionIcon
    component.additionalActionIcon = 'someText';
    fixture.detectChanges();

    const additionalButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    additionalButtonDebugElement.triggerEventHandler('click', null);
    expect(component.additionalActionClicked).toHaveBeenCalledTimes(1);
  });
});
