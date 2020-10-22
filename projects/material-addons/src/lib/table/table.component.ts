import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ColumnHeader } from './column-header';
import { RowAction } from './row-action';
import { TableAction } from './table-action';

@Component({
  selector: 'mad-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  readonly ACTION_COLUMN_NAME = '__action__';

  @Input() columns: ColumnHeader[] = [];
  @Input() filterLabel = 'NOT SET';
  @Input() filterPlaceholder = 'NOT SET';
  @Input() noDataText: string;
  @Input() pageSizeOptions = [5, 10, 15];
  @Input() defaultPageSize = this.pageSizeOptions[1];
  @Input() rowActions: RowAction[] = [];
  @Input() tableActions: TableAction[] = [];

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
    this.dataSource.paginator._changePageSize(pageSize);
  }

  @Input()
  set filterEnabled(isFilterEnabled: boolean) {
    this.isFilterEnabled = isFilterEnabled;
    this.setFilterValue(undefined);
  }

  @Output() tableAction = new EventEmitter<TableAction>();
  @Output() rowAction = new EventEmitter<RowAction>();
  @Output() sortEvent = new EventEmitter<Sort>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<any[]>;
  columnNames: string[];
  isRowClickable: boolean;
  defaultAction: RowAction;
  isFilterEnabled = false;
  isPaginationEnabled = false;

  ngOnInit(): void {
    this.columnNames = this.columns.map(column => column.name);
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

  onFilter(event: Event): void {
    this.setFilterValue((event.target as HTMLInputElement)?.value);
  }

  onRowEvent(event: MouseEvent, row: any, action?: RowAction): void {
    if (!this.isClickOnRowMenuIcon(event)) {
      this.rowAction.emit({ name: action?.name || this.defaultAction.name, outputRow: row });
    }
  }

  onSortingEvent(sortingParams: Sort): void {
    this.sortEvent.emit(sortingParams);
  }

  onTableAction(tableAction: TableAction): void {
    this.tableAction.emit(tableAction);
  }

  private setFilterValue(value: string): void {
    this.dataSource.filter = value?.trim().toLowerCase();
  }

  private isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains('mat-icon');
  }
}
