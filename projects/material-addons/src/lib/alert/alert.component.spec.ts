import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent, AlertType } from './alert.component';
import { By } from '@angular/platform-browser';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct icon for each alert type', () => {
    const iconMap: { [key in AlertType]: string } = {
      success: 'check_circle',
      info: 'info',
      warning: 'warning',
      error: 'error',
    };

    for (const [type, icon] of Object.entries(iconMap)) {
      component.type = type as AlertType;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('[data-cy="alert-icon"] mat-icon'));
      expect(iconElement.nativeElement.textContent).toContain(icon);
    }
  });

  it('should display the correct message', () => {
    const testMessage = 'Test message';
    component.message = testMessage;
    fixture.detectChanges();
    const messageElement = fixture.debugElement.query(By.css('[data-cy="alert-message"]'));
    expect(messageElement.nativeElement.textContent).toContain(testMessage);
  });

  it('should emit close event when close button is clicked', () => {
    component.closeable = true;
    fixture.detectChanges();
    jest.spyOn(component.close, 'emit');
    const closeButton = fixture.debugElement.query(By.css('[data-cy="alert-close-btn"]'));
    closeButton.triggerEventHandler('click', null);
    expect(component.close.emit).toHaveBeenCalledTimes(1);
  });

  it('should not display close button when closeable is false', () => {
    component.closeable = false;
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(By.css('[data-cy="alert-close-btn"]'));
    expect(closeButton).toBeNull();
  });

  it('should emit action event when action button is clicked', () => {
    const actionText = 'Action';
    component.actionText = actionText;
    fixture.detectChanges();
    jest.spyOn(component.action, 'emit');
    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    actionButton.triggerEventHandler('click', null);
    expect(component.action.emit).toHaveBeenCalledTimes(1);
  });

  it('should not display action button when actionText is empty', () => {
    component.actionText = '';
    fixture.detectChanges();
    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    expect(actionButton).toBeNull();
  });

  it('should display action button when actionText is provided', () => {
    const actionText = 'Action';
    component.actionText = actionText;
    fixture.detectChanges();
    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    expect(actionButton).not.toBeNull();
    expect(actionButton.nativeElement.textContent).toContain(actionText);
  });
});
