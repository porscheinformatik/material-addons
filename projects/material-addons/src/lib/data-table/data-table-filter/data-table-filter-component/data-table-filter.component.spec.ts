import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FilterComponent } from './data-table-filter.component';

describe('FilterComponent', () => {
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent, NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    fixture.detectChanges();
  });

  it('renders Tailwind utility classes for the filter icon layout', () => {
    const host = fixture.nativeElement as HTMLElement;
    const container = host.querySelector('.container');
    const overlay = host.querySelector('.overlay');
    const icon = host.querySelector('mat-icon');
    const dialog = host.querySelector('mad-data-table-filter-dialog');

    expect(container?.classList.contains('relative')).toBe(true);
    expect(container?.classList.contains('size-4')).toBe(true);
    expect(overlay?.classList.contains('absolute')).toBe(true);
    expect(overlay?.classList.contains('size-4')).toBe(true);
    expect(overlay?.classList.contains('justify-center')).toBe(true);
    expect(icon?.classList.contains('colored-icon')).toBe(true);
    expect(icon?.classList.contains('text-[1.3em]')).toBe(false);
    expect(dialog?.classList.contains('absolute')).toBe(true);
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
