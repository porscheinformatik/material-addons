import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableAction } from './data-table-action';

@Component({
  selector: 'mad-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  readonly ACTION_COLUMN_NAME = '__action__';

  @Input() columns: DataTableColumnHeader[] = [];
  @Input() filterLabel = 'NOT SET';
  @Input() filterPlaceholder = 'NOT SET';
  @Input() noDataText: string;
  @Input() pageSizeOptions = [5, 10, 15];
  @Input() defaultPageSize = this.pageSizeOptions?.[0] || 10;
  @Input() rowActions: DataTableAction[] = [];
  @Input() tableActions: DataTableAction[] = [];

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

  @Output() tableAction = new EventEmitter<DataTableAction>();
  @Output() rowAction = new EventEmitter<DataTableAction>();
  @Output() sortEvent = new EventEmitter<Sort>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any[]>;
  columnNames: string[];
  isRowClickable: boolean;
  defaultAction: DataTableAction;
  isFilterEnabled = false;
  isPaginationEnabled = false;

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

  onTableAction(tableAction: DataTableAction): void {
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
