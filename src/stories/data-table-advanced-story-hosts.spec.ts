import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { describe, expect, it } from '@jest/globals';
import { dataTableStoryRows } from './data-table-story-data';
import { DataTableColumnDefinitionStoryHostComponent, queryDataTableStoryPage } from './data-table-advanced-story-hosts';

class DataTableColumnDefinitionStoryHostHarness extends DataTableColumnDefinitionStoryHostComponent {
  get definitions() {
    return this.columnDefinitions;
  }
}

describe('queryDataTableStoryPage', () => {
  it('sorts all data before returning the requested page', () => {
    const page: PageEvent = {
      pageIndex: 1,
      pageSize: 2,
      length: 0,
    };
    const sort: Sort = {
      active: 'name',
      direction: 'asc',
    };

    const result = queryDataTableStoryPage(dataTableStoryRows, page, sort);

    expect(result.page).toEqual({
      pageIndex: 1,
      pageSize: 2,
      length: dataTableStoryRows.length,
    });
    expect(result.data.map((row) => row.name)).toEqual(['Jacob Shaw', 'Leo Turner']);
  });

  it('supports numeric descending sorts for async pages', () => {
    const page: PageEvent = {
      pageIndex: 0,
      pageSize: 3,
      length: 0,
    };
    const sort: Sort = {
      active: 'age',
      direction: 'desc',
    };

    const result = queryDataTableStoryPage(dataTableStoryRows, page, sort);

    expect(result.data.map((row) => row.age)).toEqual([42, 38, 35]);
  });
});

describe('DataTableColumnDefinitionStoryHostComponent', () => {
  it('isolates editable definitions per story host instance', () => {
    const firstHost = new DataTableColumnDefinitionStoryHostHarness();
    const secondHost = new DataTableColumnDefinitionStoryHostHarness();
    const originalDisplayedColumns = firstHost.definitions[0].displayedColumns;

    try {
      firstHost.definitions[0].displayedColumns = [];

      expect(secondHost.definitions[0].displayedColumns).toHaveLength(originalDisplayedColumns.length);
    } finally {
      firstHost.definitions[0].displayedColumns = originalDisplayedColumns;
    }
  });
});
