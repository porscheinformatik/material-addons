import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FilterComponent } from './data-table-filter.component';

describe('FilterComponent', () => {
  let fixture: ComponentFixture<FilterComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent, NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('renders Tailwind utility classes for the filter icon layout', () => {
    const host = fixture.nativeElement as HTMLElement;
    const container = host.querySelector('.container');
    const overlay = host.querySelector('.overlay');
    const icon = host.querySelector('mat-icon');

    expect(container?.classList.contains('relative')).toBe(true);
    expect(container?.classList.contains('size-4')).toBe(true);
    expect(overlay?.classList.contains('absolute')).toBe(true);
    expect(overlay?.classList.contains('size-4')).toBe(true);
    expect(overlay?.classList.contains('justify-center')).toBe(true);
    expect(icon?.classList.contains('colored-icon')).toBe(true);
    expect(icon?.classList.contains('text-[1.3em]')).toBe(false);
    expect(icon?.hasAttribute('cdkoverlayorigin')).toBe(true);
    expect(host.querySelector('mad-data-table-filter-dialog')).toBeNull();
  });

  it('opens the filter dialog in a CDK overlay and closes it from the backdrop', () => {
    const host = fixture.nativeElement as HTMLElement;
    const icon = host.querySelector('mat-icon') as HTMLElement;

    icon.click();
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('mad-data-table-filter-dialog')).not.toBeNull();

    const backdrop = overlayContainer.getContainerElement().querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    expect(overlayContainer.getContainerElement().querySelector('mad-data-table-filter-dialog')).toBeNull();
  });

  it('sizes the filter icon to visually match the Material sort arrow', () => {
    const host = fixture.nativeElement as HTMLElement;
    const icon = host.querySelector('mat-icon') as HTMLElement;
    const componentStyles = readFileSync(join(__dirname, 'data-table-filter.component.scss'), 'utf-8');

    expect(icon.classList.contains('colored-icon')).toBe(true);
    expect(componentStyles).toContain('.colored-icon.mat-icon');
    expect(componentStyles).toContain('width: 18px');
    expect(componentStyles).toContain('height: 18px');
    expect(componentStyles).toContain('font-size: 18px');
    expect(componentStyles).toContain('line-height: 18px');
  });
});
