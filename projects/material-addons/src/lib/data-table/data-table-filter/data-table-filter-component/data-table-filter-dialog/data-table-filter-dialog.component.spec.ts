import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
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
    expect(dialogBox?.classList.contains('bg-(--mat-sys-surface)')).toBe(true);
    expect(formField?.classList.contains('max-w-[180px]')).toBe(true);
  });
});
