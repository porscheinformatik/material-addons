import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatTooltip } from '@angular/material/tooltip';
import { BreadcrumbComponent, BreadcrumbItem } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let component: BreadcrumbComponent;

  const setInputs = (breadcrumbs: BreadcrumbItem[], showCopy = false, title = 'Copy') => {
    fixture.componentRef.setInput('breadcrumbs', breadcrumbs);
    fixture.componentRef.setInput('showCopy', showCopy);
    fixture.componentRef.setInput('title', title);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([]),

        // Temporary: Angular animation providers are deprecated since v20.2,
        // but Material tooltip still relies on the legacy animation stack in tests.
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setInputs([]);
    expect(component).toBeTruthy();
  });

  it('should not render container when breadcrumbs are empty', () => {
    setInputs([]);

    const container = fixture.debugElement.query(By.css('.container'));
    expect(container).toBeNull();
  });

  it('should render breadcrumb nav when breadcrumbs exist', () => {
    setInputs([{ label: 'Home' }]);

    const nav = fixture.debugElement.query(By.css('[data-cy="breadcrumb-nav"]'));
    expect(nav).toBeTruthy();
  });

  it('should render external href breadcrumb item', () => {
    setInputs([{ label: 'Docs', href: 'https://example.com' }, { label: 'Details' }]);

    const links = fixture.debugElement.queryAll(By.css('[data-cy="breadcrumb-link"]'));
    expect(links).toHaveLength(1);

    const externalLink = links[0].nativeElement as HTMLAnchorElement;

    expect(externalLink.getAttribute('href')).toBe('https://example.com');
    expect(externalLink.getAttribute('target')).toBe('_blank');
    expect(externalLink.textContent?.trim()).toBe('Docs');
  });

  it('should render current breadcrumb item', () => {
    setInputs([{ label: 'Home', route: ['/home'] }, { label: 'Current page' }]);

    const current = fixture.debugElement.query(By.css('[data-cy="breadcrumb-current"]'));

    expect(current).toBeTruthy();
    expect(current.nativeElement.textContent.trim()).toBe('Current page');
  });

  it('should render separators between breadcrumb items except after last', () => {
    setInputs([{ label: 'Home', route: ['/home'] }, { label: 'Library', route: ['/library'] }, { label: 'Details' }]);

    const separators = fixture.debugElement.queryAll(By.css('[data-cy="breadcrumb-separator"]'));

    expect(separators).toHaveLength(2);
    expect(separators.every((el) => el.nativeElement.textContent.trim() === '/')).toBe(true);
  });

  it('should not render separator for single breadcrumb item', () => {
    setInputs([{ label: 'Home' }]);

    const separators = fixture.debugElement.queryAll(By.css('[data-cy="breadcrumb-separator"]'));

    expect(separators).toHaveLength(0);
  });

  it('should render correct number of breadcrumb links', () => {
    setInputs([{ label: 'Home', route: ['/home'] }, { label: 'Docs', href: 'https://example.com' }, { label: 'Current' }]);

    const links = fixture.debugElement.queryAll(By.css('[data-cy="breadcrumb-link"]'));
    expect(links).toHaveLength(2);
  });

  it('should not show copy button by default', () => {
    setInputs([{ label: 'Home' }]);

    const copyButton = fixture.debugElement.query(By.css('[data-cy="breadcrumb-copy"]'));

    expect(copyButton).toBeFalsy();
  });

  it('should not show copy button when showCopy is false', () => {
    setInputs([{ label: 'Home' }], false);

    const copyButton = fixture.debugElement.query(By.css('[data-cy="breadcrumb-copy"]'));

    expect(copyButton).toBeNull();
  });

  it('should emit copy event when copy button is clicked', () => {
    setInputs([{ label: 'Home'}], true);

    const emitSpy = jest.spyOn(component.copy, 'emit');

    const copyButton = fixture.debugElement.query(By.css('[data-cy="breadcrumb-copy"]'));

    copyButton.triggerEventHandler('click');

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should pass title input to tooltip', () => {
    setInputs([{ label: 'Home' }], true, 'Copy breadcrumb');

    const tooltipDebugEl = fixture.debugElement.query(By.directive(MatTooltip));
    const tooltipInstance = tooltipDebugEl.injector.get(MatTooltip);

    expect(tooltipInstance.message).toBe('Copy breadcrumb');
  });

  it('should use default tooltip title when title input is not overridden', () => {
    setInputs([{ label: 'Home' }], true);

    const tooltipDebugEl = fixture.debugElement.query(By.directive(MatTooltip));
    const tooltipInstance = tooltipDebugEl.injector.get(MatTooltip);

    expect(tooltipInstance.message).toBe('Copy');
  });
});
