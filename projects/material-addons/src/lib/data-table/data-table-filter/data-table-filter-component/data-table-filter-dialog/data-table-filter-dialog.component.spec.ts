import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataTableFilterDialogComponent } from './data-table-filter-dialog.component';

describe('DataTableFilterDialogComponent', () => {
  let fixture: ComponentFixture<DataTableFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableFilterDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableFilterDialogComponent);
    fixture.detectChanges();
  });

  it('renders Tailwind utility classes for the filter dialog layout', () => {
    const host = fixture.nativeElement as HTMLElement;
    const dialogBox = host.querySelector('.filter-dialog-box');
    const formField = host.querySelector('mat-form-field');

    expect(dialogBox?.classList.contains('flex')).toBe(true);
    expect(dialogBox?.classList.contains('h-20')).toBe(true);
    expect(dialogBox?.classList.contains('py-3')).toBe(true);
    expect(dialogBox?.classList.contains('pb-0')).toBe(false);
    expect(dialogBox?.classList.contains('mt-[22px]')).toBe(false);
    expect(dialogBox?.classList.contains('bg-(--mat-sys-surface)')).toBe(true);
    expect(formField?.classList.contains('max-w-[180px]')).toBe(true);
    expect(formField?.hasAttribute('subscriptsizing')).toBe(false);
  });

  it('keeps the select filter variant free from local subscript sizing', () => {
    fixture.componentRef.setInput('filterOptions', [{ key: 'active', label: 'Active' }]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const formField = host.querySelector('mat-form-field');

    expect(formField?.hasAttribute('subscriptsizing')).toBe(false);
  });

  it('overrides the global outline form-field margin only inside the filter dialog', () => {
    const componentStyles = readFileSync(join(__dirname, 'data-table-filter-dialog.component.scss'), 'utf-8');

    expect(componentStyles).toContain('.filter-dialog-input.mat-form-field-appearance-outline');
    expect(componentStyles).toContain('margin-top: 0');
  });
});
