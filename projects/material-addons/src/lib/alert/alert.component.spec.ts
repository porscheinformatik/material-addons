import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlertComponent, AlertType } from './alert.component';
import { MAD_ALERT_DEFAULT_CONFIGURATION } from './alert-configuration';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
      providers: [
        {
          provide: MAD_ALERT_DEFAULT_CONFIGURATION,
          useValue: {
            type: 'info',
            size: 'medium',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct icon for each alert type', () => {
    const iconMap: Record<AlertType, string> = {
      success: 'check_circle',
      info: 'info',
      warning: 'warning',
      error: 'error',
    };

    (Object.entries(iconMap) as Array<[AlertType, string]>).forEach(([type, icon]) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('[data-cy="alert-icon"] mat-icon'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.textContent).toContain(icon);
    });
  });

  it('should display the correct message', () => {
    const testMessage = 'Test message';

    fixture.componentRef.setInput('message', testMessage);
    fixture.detectChanges();

    const messageElement = fixture.debugElement.query(By.css('[data-cy="alert-message"]'));
    expect(messageElement).toBeTruthy();
    expect(messageElement.nativeElement.textContent).toContain(testMessage);
  });

  it('should emit close event when close button is clicked', () => {
    fixture.componentRef.setInput('closeable', true);
    fixture.detectChanges();

    const spy = jest.spyOn(component.close, 'emit');

    const closeButton = fixture.debugElement.query(By.css('[data-cy="alert-close-btn"]'));
    expect(closeButton).toBeTruthy();

    closeButton.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not display close button when closeable is false', () => {
    fixture.componentRef.setInput('closeable', false);
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('[data-cy="alert-close-btn"]'));
    expect(closeButton).toBeNull();
  });

  it('should emit action event when action button is clicked', () => {
    fixture.componentRef.setInput('actionText', 'Action');
    fixture.detectChanges();

    const spy = jest.spyOn(component.action, 'emit');

    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    expect(actionButton).toBeTruthy();

    actionButton.triggerEventHandler('click', new MouseEvent('click'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not display action button when actionText is empty', () => {
    fixture.componentRef.setInput('actionText', '');
    fixture.detectChanges();

    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    expect(actionButton).toBeNull();
  });

  it('should display action button when actionText is provided', () => {
    const actionText = 'Action';

    fixture.componentRef.setInput('actionText', actionText);
    fixture.detectChanges();

    const actionButton = fixture.debugElement.query(By.css('[data-cy="alert-action-btn"]'));
    expect(actionButton).toBeTruthy();
    expect(actionButton.nativeElement.textContent).toContain(actionText);
  });

  it('should apply computed classes: "{type} {size}"', () => {
    fixture.componentRef.setInput('type', 'warning');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.css('[data-cy="alert"]'));
    expect(host).toBeTruthy();

    // classes() returns "warning large", bound to [class]
    const classAttr: string = host.attributes['class'] ?? '';
    expect(classAttr).toContain('alert'); // base class in template
    expect(classAttr).toContain('warning');
    expect(classAttr).toContain('large');
  });
});
