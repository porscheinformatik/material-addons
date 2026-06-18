import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
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
    expect(icon?.classList.contains('hover:text-(--main-primary)')).toBe(true);
    expect(dialog?.classList.contains('absolute')).toBe(true);
  });
});
