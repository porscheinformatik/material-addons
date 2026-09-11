import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  DataTableColumn,
  DataTableColumnDefinition,
  DataTableColumnDefinitionChange,
  DataTableComponent,
  DataTablePersistenceConfiguration,
  DataTableTemplateCellDefinition,
  DataTableTemplateColumnDefinition,
  DataTableTemplateExpandableCellDefinition,
  DataTableTemplateExpandableColumnDefinition,
} from '@porscheinformatik/material-addons';
import {
  dataTableColumnDefinitions,
  dataTableFilterColumns,
  dataTableStoryRows,
  dataTableTemplateColumns,
  DataTableStoryRow,
} from './data-table-story-data';

export interface DataTableAsyncStoryPage {
  data: DataTableStoryRow[];
  page: PageEvent;
}

const dataTableAsyncInitialPage: PageEvent = {
  pageIndex: 0,
  pageSize: 3,
  length: dataTableStoryRows.length,
};

const dataTableAsyncInitialSort: Sort = {
  active: 'name',
  direction: 'asc',
};

export function queryDataTableStoryPage(rows: DataTableStoryRow[], requestedPage: PageEvent, sort: Sort): DataTableAsyncStoryPage {
  const sortedRows = [...rows].sort((first, second) => compareDataTableStoryRows(first, second, sort));
  const start = requestedPage.pageIndex * requestedPage.pageSize;
  const end = start + requestedPage.pageSize;

  return {
    data: sortedRows.slice(start, end),
    page: {
      pageIndex: requestedPage.pageIndex,
      pageSize: requestedPage.pageSize,
      length: rows.length,
    },
  };
}

function compareDataTableStoryRows(first: DataTableStoryRow, second: DataTableStoryRow, sort: Sort): number {
  if (!sort.direction) {
    return 0;
  }

  const firstValue = first[sort.active as keyof DataTableStoryRow];
  const secondValue = second[sort.active as keyof DataTableStoryRow];
  const direction = sort.direction === 'asc' ? 1 : -1;

  if (typeof firstValue === 'number' && typeof secondValue === 'number') {
    return (firstValue - secondValue) * direction;
  }

  return `${firstValue}`.localeCompare(`${secondValue}`) * direction;
}

@Component({
  selector: 'mad-data-table-persistence-story-host',
  imports: [DataTableComponent],
  template: `
    <div style="max-width: 1080px;">
      <mad-data-table
        [id]="id"
        [displayedColumns]="displayedColumns"
        [tableData]="tableData"
        [filterMode]="'COLUMN_BASED'"
        [persistenceConfig]="persistenceConfig"
        [paginationEnabled]="true"
        [translateLabels]="false"
        [defaultPageSize]="5"
        [pageSizeOptions]="[5, 10, 15]"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTablePersistenceStoryHostComponent {
  protected readonly id = 'storybook.data-table.persistence';
  protected readonly displayedColumns = dataTableFilterColumns;
  protected readonly tableData = dataTableStoryRows;
  protected readonly persistenceConfig: DataTablePersistenceConfiguration = {
    persistSort: true,
    persistFilter: true,
    persistPageSize: true,
  };
}

@Component({
  selector: 'mad-data-table-custom-templates-story-host',
  imports: [DataTableComponent, DataTableTemplateColumnDefinition, DataTableTemplateCellDefinition, MatIconModule],
  template: `
    <div style="max-width: 1080px;">
      <mad-data-table
        [displayedColumns]="displayedColumns"
        [tableData]="tableData"
        [paginationEnabled]="true"
        [translateLabels]="false"
        [defaultPageSize]="5"
        [pageSizeOptions]="[5, 10, 15]"
      >
        <ng-container madColumnDef="status">
          <span
            *madCellDef="let element"
            class="storybook-status"
            [class.active]="element.status === 'active'"
            [class.pending]="element.status === 'pending'"
            [class.inactive]="element.status === 'inactive'"
          >
            {{ element.status }}
          </span>
        </ng-container>
        <ng-container madColumnDef="email">
          <a *madCellDef="let element" class="storybook-email" [href]="'mailto:' + element.email">
            <mat-icon class="material-icons-outlined">alternate_email</mat-icon>
            {{ element.email }}
          </a>
        </ng-container>
      </mad-data-table>
    </div>
  `,
  styles: `
    .storybook-status {
      border-radius: 4px;
      display: inline-block;
      min-width: 64px;
      padding: 4px 8px;
      text-align: center;
      text-transform: capitalize;
    }

    .storybook-status.active {
      background: #d6f5df;
      color: #0d5b2a;
    }

    .storybook-status.pending {
      background: #fff2bf;
      color: #6b5000;
    }

    .storybook-status.inactive {
      background: #e5e7eb;
      color: #374151;
    }

    .storybook-email {
      align-items: center;
      color: inherit;
      display: inline-flex;
      gap: 6px;
    }

    .storybook-email mat-icon {
      height: 18px;
      width: 18px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableCustomTemplatesStoryHostComponent {
  protected readonly displayedColumns = dataTableTemplateColumns;
  protected readonly tableData = dataTableStoryRows;
}

interface DataTableExpandableStoryRow extends DataTableStoryRow {
  activity: string[];
}

@Component({
  selector: 'mad-data-table-expandable-rows-story-host',
  imports: [DataTableComponent, DataTableTemplateExpandableColumnDefinition, DataTableTemplateExpandableCellDefinition],
  template: `
    <div style="max-width: 1080px;">
      <mad-data-table
        [displayedColumns]="displayedColumns"
        [tableData]="tableData"
        [paginationEnabled]="true"
        [translateLabels]="false"
        [defaultPageSize]="5"
        [pageSizeOptions]="[5, 10, 15]"
        [rowExpandable]="rowExpandable"
      >
        <ng-container madExpandableColumnDef="activity">
          <section *madExpandableCellDef="let element" class="storybook-expanded-row">
            <strong>{{ element.name }}</strong>
            <ul>
              @for (entry of element.activity; track entry) {
                <li>{{ entry }}</li>
              }
            </ul>
          </section>
        </ng-container>
      </mad-data-table>
    </div>
  `,
  styles: `
    .storybook-expanded-row {
      padding: 12px 16px 16px;
    }

    .storybook-expanded-row ul {
      margin: 8px 0 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableExpandableRowsStoryHostComponent {
  protected readonly displayedColumns = dataTableTemplateColumns;
  protected readonly tableData: DataTableExpandableStoryRow[] = dataTableStoryRows.map((row) => ({
    ...row,
    activity: [`${row.name} profile reviewed`, `${row.status} request scheduled`],
  }));
  protected readonly rowExpandable = (row: DataTableExpandableStoryRow) => row.status !== 'inactive';
}

@Component({
  selector: 'mad-data-table-async-external-story-host',
  imports: [DataTableComponent],
  template: `
    <div style="max-width: 1080px;">
      <mad-data-table
        [displayedColumns]="displayedColumns"
        [tableData]="tableData()"
        [loading]="loading()"
        [page]="page()"
        [defaultSort]="sort()"
        [paginationEnabled]="true"
        [pageSizeOptions]="[3, 5, 10]"
        [translateLabels]="false"
        [useAsync]="true"
        (sortEvent)="onSortEvent($event)"
        (pageEvent)="onPageEvent($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableAsyncExternalStoryHostComponent implements OnDestroy {
  protected readonly displayedColumns = dataTableTemplateColumns;
  protected readonly sort = signal<Sort>({ ...dataTableAsyncInitialSort });
  protected readonly page = signal<PageEvent>({ ...dataTableAsyncInitialPage });
  protected readonly loading = signal(false);
  protected readonly tableData = signal(queryDataTableStoryPage(dataTableStoryRows, this.page(), this.sort()).data);

  private requestTimer: ReturnType<typeof setTimeout> | undefined;

  ngOnDestroy(): void {
    if (this.requestTimer) {
      clearTimeout(this.requestTimer);
    }
  }

  protected onSortEvent(sort: Sort): void {
    this.load({ ...this.page(), pageIndex: 0 }, sort);
  }

  protected onPageEvent(page: PageEvent): void {
    this.load(page, this.sort());
  }

  private load(page: PageEvent, sort: Sort): void {
    this.loading.set(true);

    if (this.requestTimer) {
      clearTimeout(this.requestTimer);
    }

    this.requestTimer = setTimeout(() => {
      const result = queryDataTableStoryPage(dataTableStoryRows, page, sort);
      this.page.set(result.page);
      this.sort.set(sort);
      this.tableData.set(result.data);
      this.loading.set(false);
    }, 500);
  }
}

@Component({
  selector: 'mad-data-table-column-definition-story-host',
  imports: [DataTableComponent],
  template: `
    <div style="max-width: 1080px;">
      <mad-data-table
        [displayedColumnDefinition]="displayedDefinition()"
        [allColumns]="allColumns()"
        [columnDefinitions]="columnDefinitions"
        [tableData]="tableData"
        [paginationEnabled]="true"
        [translateLabels]="false"
        [defaultPageSize]="5"
        [pageSizeOptions]="[5, 10, 15]"
        (allColumnsEvent)="loadAllColumns()"
        (viewDefinitionChangeEvent)="onViewDefinitionChange($event)"
        (columnDefinitionChangeEvent)="onColumnDefinitionChange($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableColumnDefinitionStoryHostComponent {
  protected readonly tableData = dataTableStoryRows;
  protected readonly columnDefinitions = dataTableColumnDefinitions.map((definition) => ({
    ...definition,
    displayedColumns: [...definition.displayedColumns],
  }));
  protected readonly displayedDefinition = signal<DataTableColumnDefinition>(this.columnDefinitions[0]);
  protected readonly allColumns = signal<DataTableColumn[] | undefined>(undefined);

  protected loadAllColumns(): void {
    this.allColumns.set(dataTableTemplateColumns);
  }

  protected onViewDefinitionChange(definition: DataTableColumnDefinition): void {
    this.displayedDefinition.set(definition);
  }

  protected onColumnDefinitionChange(change: DataTableColumnDefinitionChange): void {
    if (change.action === 'SAVE') {
      this.displayedDefinition.set({
        ...change.definition,
        displayedColumns: [...change.definition.displayedColumns],
      });
    }
  }
}
