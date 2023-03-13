import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ColumnHeader } from './column-header';
import { TableAction } from './table-action';

@Component({
  selector: 'mad-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() columns: ColumnHeader[] = [];
  @Input() filterLabel = 'NOT SET';
  @Input() filterPlaceholder = 'NOT SET';
  @Input() noDataText: string;
  @Input() pageSizeOptions = [5, 10, 15];
  @Input() defaultPageSize = this.pageSizeOptions?.[0] || 10;
  @Input() rowActions: TableAction[] = [];
  @Input() tableActions: TableAction[] = [];

  @Output() tableAction = new EventEmitter<TableAction>();
  @Output() rowAction = new EventEmitter<TableAction>();
  @Output() sortEvent = new EventEmitter<Sort>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  readonly ACTION_COLUMN_NAME = '__action__';
  dataSource: MatTableDataSource<any[]>;
  columnNames: string[];
  isRowClickable: boolean;
  defaultAction: TableAction;
  isFilterEnabled = false;
  isPaginationEnabled = false;

  @Input() set displayedData(data: any[]) {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>(data);
    } else {
      this.dataSource.data = data;
    }
  }

  @Input() set paginationEnabled(isPaginationEnabled: boolean) {
    this.isPaginationEnabled = isPaginationEnabled;
    // eslint-disable-next-line
    const pageSize = this.isPaginationEnabled ? this.defaultPageSize : Number.MAX_VALUE;
    if (this.dataSource.paginator) {
      this.dataSource.paginator._changePageSize(pageSize);
    }
  }

  @Input()
  set filterEnabled(isFilterEnabled: boolean) {
    this.isFilterEnabled = isFilterEnabled;
    this.setFilterValue(undefined);
  }

  ngOnInit(): void {
    this.columnNames = this.columns.map(column => column.label);
    this.isRowClickable = this.rowActions.length > 0;
    if (this.isRowClickable) {
      this.columnNames.unshift(this.ACTION_COLUMN_NAME);
      this.defaultAction = this.rowActions[0];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // set custom filter predicate to enable search for multiple search strings:
    // e.g. "one two three"
    this.dataSource.filterPredicate = (data: any, filter: string): any =>
      !filter || filter.split(/\s+/).every(term => !!Object.keys(data).find(key => data[key].includes(term)));
  }

  onFilter(value: string): void {
    this.setFilterValue(value);
  }

  onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    if (!!action && !this.isClickOnRowMenuIcon(event)) {
      this.rowAction.emit({ ...action, outputRow: row });
    }
  }

  onSortingEvent(sortingParams: Sort): void {
    this.sortEvent.emit(sortingParams);
  }

  onTableAction(tableAction: TableAction): void {
    if (!!tableAction) {
      this.tableAction.emit(tableAction);
    }
  }

  private setFilterValue(value: string): void {
    this.dataSource.filter = value?.trim().toLowerCase();
  }

  private isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains('mat-icon');
  }
}
