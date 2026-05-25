import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent } from './data-table-filter/data-table-filter-component/data-table-filter.component';

describe('DataTable Material 21 compatibility', () => {
  const dataTablePath = join(process.cwd(), 'projects/material-addons/src/lib/data-table');

  type FilterComponentTestApi = FilterComponent & {
    showFilterDialog: WritableSignal<boolean>;
    stopHeaderSort(event: Event): void;
    toggleFilter(event: Event): void;
  };

  function readDataTableFile(path: string): string {
    return readFileSync(join(dataTablePath, path), 'utf8');
  }

  function createFilterComponent(): FilterComponentTestApi {
    TestBed.configureTestingModule({
      imports: [FilterComponent, TranslateModule.forRoot()],
    });

    return TestBed.createComponent(FilterComponent).componentInstance as FilterComponentTestApi;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('uses current Angular Material button directive names in data-table templates', () => {
    const dataTableTemplate = readDataTableFile('data-table.component.html');
    const columnsModalTemplate = readDataTableFile('data-table-columns-modal/data-table-columns-modal.component.html');
    const templates = `${dataTableTemplate}\n${columnsModalTemplate}`;

    expect(templates).toContain('matIconButton');
    expect(templates).not.toContain('mat-icon-button');
    expect(templates).not.toContain('mat-stroked-button');
    expect(templates).not.toContain('mat-raised-button');
  });

  it('does not patch private Angular Material sort header internals', () => {
    const filterHeaderDirective = readDataTableFile('data-table-filter/data-table-filter-header.directive.ts');
    const dataTableStyles = readDataTableFile('data-table.component.scss');

    expect(filterHeaderDirective).not.toContain('_toggleOnInteraction');
    expect(filterHeaderDirective).not.toContain('mat-sort-header-arrow');
    expect(dataTableStyles).not.toContain('::ng-deep');
    expect(dataTableStyles).not.toContain('mat-sort-header-arrow');
  });

  it('stops filter clicks from bubbling to sortable header cells', () => {
    const component = createFilterComponent();
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const event = {
      preventDefault,
      stopPropagation,
    } as unknown as Event;

    component.toggleFilter(event);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(component.showFilterDialog()).toBe(true);
  });

  it('stops filter dialog clicks from bubbling to sortable header cells', () => {
    const component = createFilterComponent();
    const stopPropagation = jest.fn();
    const event = {
      stopPropagation,
    } as unknown as Event;

    component.stopHeaderSort(event);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('stops filter keyboard events from bubbling to sortable header cells', () => {
    const filterComponent = readDataTableFile('data-table-filter/data-table-filter-component/data-table-filter.component.ts');

    expect(filterComponent).toContain("'(keydown)': 'stopHeaderSort($event)'");
  });

  it('uses a responsive column definition modal layout instead of fixed content widths', () => {
    const columnsModalStyles = readDataTableFile('data-table-columns-modal/data-table-columns-modal.component.scss');

    expect(columnsModalStyles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
    expect(columnsModalStyles).not.toContain('width: 544px');
    expect(columnsModalStyles).not.toContain('width: 256px');
  });

  it('uses an element selector for the column definition modal component', () => {
    const columnsModalComponent = readDataTableFile('data-table-columns-modal/data-table-columns-modal.component.ts');

    expect(columnsModalComponent).toContain("selector: 'mad-data-table-columns-modal'");
    expect(columnsModalComponent).not.toContain("selector: 'mad-data-table-columns-modal.component'");
  });
});
