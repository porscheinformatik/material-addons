import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const setInputs = async (
    inputs: Partial<{
      cancelDisabled: boolean;
      cancelText: string;
      readonly: boolean;
      editText: string;
      expandable: boolean;
      saveDisabled: boolean;
      saveText: string;
      title: string | undefined;
      editMode: boolean;
      additionalActionIcon: string | undefined;
      additionalActionText: string;
    }>,
  ) => {
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }

    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create CardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call onEdit when edit button is clicked and expand the card', async () => {
    const onEditSpy = jest.spyOn(component, 'onEdit');
    const editEmitSpy = jest.spyOn(component.edit, 'emit');

    component.expanded.set(false);
    await setInputs({
      readonly: false,
      editMode: false,
    });

    const editButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="edit-btn"]'));
    expect(editButtonDebugElement).toBeTruthy();

    editButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(onEditSpy).toHaveBeenCalledTimes(1);
    expect(editEmitSpy).toHaveBeenCalledTimes(1);
    expect(component.expanded()).toBe(true);
  });

  it('should not render the edit button when readonly and editMode are true', async () => {
    await setInputs({
      readonly: true,
      editMode: true,
    });

    const editButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="edit-btn"]'));
    expect(editButtonDebugElement).toBeNull();
  });

  it('should emit cancel when cancel button is clicked', async () => {
    const cancelEmitSpy = jest.spyOn(component.cancel, 'emit');

    await setInputs({
      readonly: false,
      editMode: true,
    });

    const cancelButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));
    expect(cancelButtonDebugElement).toBeTruthy();

    cancelButtonDebugElement.triggerEventHandler('click', null);

    expect(cancelEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('cancel should be disabled when cancelDisabled is true', async () => {
    await setInputs({
      readonly: false,
      editMode: true,
      cancelDisabled: true,
    });

    const cancelButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));
    expect(cancelButtonDebugElement).toBeTruthy();
    expect(cancelButtonDebugElement.componentInstance.disabled).toBe(true);
  });

  it('should emit save when save button is triggered', async () => {
    const saveEmitSpy = jest.spyOn(component.save, 'emit');

    await setInputs({
      readonly: false,
      editMode: true,
    });

    const saveButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="save-btn"]'));
    expect(saveButtonDebugElement).toBeTruthy();

    saveButtonDebugElement.triggerEventHandler('throttleClick', null);

    expect(saveEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('cancel and save buttons should not be visible', async () => {
    await setInputs({
      readonly: true,
      editMode: false,
    });

    const cardActionsDebugElement = fixture.debugElement.query(By.css('mat-card-actions'));
    expect(cardActionsDebugElement).toBeNull();
  });

  it('cancel and save buttons should be visible', async () => {
    await setInputs({
      readonly: false,
      editMode: true,
    });

    const cardActionsDebugElement = fixture.debugElement.query(By.css('mat-card-actions'));
    const saveButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="save-btn"]'));
    const cancelButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="cancel-btn"]'));

    expect(cardActionsDebugElement).toBeTruthy();
    expect(saveButtonDebugElement).toBeTruthy();
    expect(cancelButtonDebugElement).toBeTruthy();
  });

  it('toggleCollapse method should toggle expanded', async () => {
    const toggleCollapseSpy = jest.spyOn(component, 'toggleCollapse');

    component.expanded.set(false);
    await setInputs({
      expandable: true,
      editMode: false,
    });

    const toggleButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="collapse-btn"]'));
    expect(toggleButtonDebugElement).toBeTruthy();

    toggleButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(toggleCollapseSpy).toHaveBeenCalledTimes(1);
    expect(component.expanded()).toBe(true);
  });

  it('should show mat-card-content when expanded is true', () => {
    component.expanded.set(true);
    fixture.detectChanges();

    const contentDebugElement = fixture.debugElement.query(By.css('mat-card-content'));
    expect(contentDebugElement).toBeTruthy();
  });

  it('should not show mat-card-content when expanded is false', () => {
    component.expanded.set(false);
    fixture.detectChanges();

    const contentDebugElement = fixture.debugElement.query(By.css('mat-card-content'));
    expect(contentDebugElement).toBeNull();
  });

  it('should display additional button when additionalActionIcon is specified', async () => {
    await setInputs({
      additionalActionIcon: 'someIcon',
    });

    const buttonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    expect(buttonDebugElement).toBeTruthy();
  });

  it('should not display additional button when additionalActionIcon is not specified', async () => {
    await setInputs({
      additionalActionIcon: '',
    });

    const buttonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    expect(buttonDebugElement).toBeNull();
  });

  it('should emit additionalAction when additional button is clicked', async () => {
    const additionalActionEmitSpy = jest.spyOn(component.additionalAction, 'emit');

    await setInputs({
      additionalActionIcon: 'someText',
    });

    const additionalButtonDebugElement = fixture.debugElement.query(By.css('[data-testid="additional-btn"]'));
    expect(additionalButtonDebugElement).toBeTruthy();

    additionalButtonDebugElement.triggerEventHandler('click', null);

    expect(additionalActionEmitSpy).toHaveBeenCalledTimes(1);
  });
});
