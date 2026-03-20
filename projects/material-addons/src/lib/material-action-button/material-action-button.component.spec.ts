import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';

import { MaterialActionButtonComponent } from './material-action-button.component';

describe('MaterialActionButtonComponent', () => {
  let fixture: ComponentFixture<MaterialActionButtonComponent>;
  let component: MaterialActionButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialActionButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getHost(): HTMLElement {
    return fixture.debugElement.query(By.css('.material-action-button')).nativeElement;
  }

  function getAnchorDebugElement() {
    return fixture.debugElement.query(By.css('a'));
  }

  function getAnchor(): HTMLAnchorElement {
    return getAnchorDebugElement().nativeElement;
  }

  function getIcon(): HTMLElement {
    return fixture.debugElement.query(By.css('mat-icon')).nativeElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default icon', () => {
    expect(getIcon().textContent).toContain('add');
  });

  it('should render custom icon', () => {
    fixture.componentRef.setInput('icon', 'edit');
    fixture.detectChanges();

    expect(getIcon().textContent).toContain('edit');
  });

  it('should set id on anchor element', () => {
    fixture.componentRef.setInput('id', 'action-button');
    fixture.detectChanges();

    expect(getAnchor().getAttribute('id')).toBe('action-button');
  });

  it('should not render id attribute when id is empty', () => {
    fixture.componentRef.setInput('id', '');
    fixture.detectChanges();

    expect(getAnchor().hasAttribute('id')).toBe(false);
  });

  it('should set aria-label from actionName', () => {
    fixture.componentRef.setInput('actionName', 'Create item');
    fixture.detectChanges();

    expect(getAnchor().getAttribute('aria-label')).toBe('Create item');
  });

  it('should not render aria-label when actionName is empty', () => {
    fixture.componentRef.setInput('actionName', '');
    fixture.detectChanges();

    expect(getAnchor().hasAttribute('aria-label')).toBe(false);
  });

  it('should apply lift-higher class by default', () => {
    expect(getHost().classList.contains('lift-higher')).toBe(true);
  });

  it('should remove lift-higher class when input is false', () => {
    fixture.componentRef.setInput('liftHigher', false);
    fixture.detectChanges();

    expect(getHost().classList.contains('lift-higher')).toBe(false);
  });

  it('should not apply lift-higher-2 class by default', () => {
    expect(getHost().classList.contains('lift-higher-2')).toBe(false);
  });

  it('should apply lift-higher-2 class when input is true', () => {
    fixture.componentRef.setInput('liftHigher2', true);
    fixture.detectChanges();

    expect(getHost().classList.contains('lift-higher-2')).toBe(true);
  });

  it('should render normal fab anchor when liftHigher2 is false', () => {
    fixture.componentRef.setInput('liftHigher2', false);
    fixture.detectChanges();

    expect(getAnchor().classList.contains('mat-primary')).toBe(true);
  });

  it('should render mini fab anchor when liftHigher2 is true', () => {
    fixture.componentRef.setInput('liftHigher2', true);
    fixture.detectChanges();

    expect(getAnchor().classList.contains('mat-accent')).toBe(true);
  });

  it('should keep both lift-higher and lift-higher-2 classes when both inputs are true', () => {
    fixture.componentRef.setInput('liftHigher', true);
    fixture.componentRef.setInput('liftHigher2', true);
    fixture.detectChanges();

    const host = getHost();
    expect(host.classList.contains('lift-higher')).toBe(true);
    expect(host.classList.contains('lift-higher-2')).toBe(true);
  });

  it('should bind RouterLink directive', () => {
    fixture.componentRef.setInput('routerLink', '/create');
    fixture.detectChanges();

    const routerLink = getAnchorDebugElement().injector.get(RouterLink);
    expect(routerLink).toBeTruthy();
  });

  it('should set href when routerLink value is provided', () => {
    fixture.componentRef.setInput('routerLink', '/create');
    fixture.detectChanges();

    const anchor = getAnchor();
    expect(anchor.getAttribute('href')).toContain('/create');
  });
});
