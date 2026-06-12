import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableColumn } from '../configuration/data-table-column';
import { DataTableDialogData } from '../configuration/data-table-column-definition';
import { DataTableColumnsModalComponent } from './data-table-columns-modal.component';

const nameColumn: DataTableColumn = {
  id: 'name',
  label: 'Name',
  dataPropertyName: 'name',
};

const emailColumn: DataTableColumn = {
  id: 'email',
  label: 'Email',
  dataPropertyName: 'email',
};

const dialogData: DataTableDialogData = {
  allColumns: [nameColumn, emailColumn],
  definition: {
    id: 'default',
    label: 'Default',
    displayedColumns: [nameColumn],
  },
  deleteDefinitionAllowed: false,
  filterColumnsLabel: 'Filter',
  filterColumnsPlaceHolder: 'Filter available columns',
  noDataText: 'No matching data found',
  titleLabel: 'Column settings',
  selectedLabel: 'Selected columns',
  availableLabel: 'Available columns',
  saveLabel: 'Save',
  deleteLabel: 'Delete',
  cancelLabel: 'Cancel',
  infoTextLabel: 'Drag and drop a column to select or reorder it.',
};

describe('DataTableColumnsModalComponent', () => {
  let fixture: ComponentFixture<DataTableColumnsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableColumnsModalComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableColumnsModalComponent);
    fixture.detectChanges();
  });

  it('applies Material dialog and filter-field directives', () => {
    const component = fixture.componentInstance;
    const modal = fixture.nativeElement as HTMLElement;

    component.searchFilter = 'mail';
    fixture.detectChanges();

    expect(modal.querySelector('[mat-dialog-title]')?.classList.contains('mat-mdc-dialog-title')).toBe(true);
    expect(modal.querySelector('mat-dialog-content')?.classList.contains('mat-mdc-dialog-content')).toBe(true);
    expect(modal.querySelector('mat-dialog-actions')?.classList.contains('mat-mdc-dialog-actions')).toBe(true);
    expect(modal.querySelector('input[matInput]')?.classList.contains('mat-mdc-input-element')).toBe(true);
    expect(modal.querySelector('button[matIconButton]')?.classList.contains('mat-mdc-icon-button')).toBe(true);
  });

  it('renders Tailwind utility classes for static modal layout styles', () => {
    const modal = fixture.nativeElement as HTMLElement;
    const contentLayout = modal.querySelector('mat-dialog-content > div');
    const dragList = modal.querySelector('[cdkDropList]');
    const dragBox = modal.querySelector('[cdkDrag]');

    expect(contentLayout?.classList.contains('grid')).toBe(true);
    expect(contentLayout?.classList.contains('sm:grid-cols-2')).toBe(true);
    expect(dragList?.classList.contains('h-[200px]')).toBe(true);
    expect(dragBox?.classList.contains('cursor-move')).toBe(true);
  });
});
