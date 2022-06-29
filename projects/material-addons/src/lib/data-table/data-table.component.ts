import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableAction } from "./data-table-action";
import { DataTableActionType } from "./data-table-action-type";
import { SelectionModel } from "@angular/cdk/collections";
import { v4 as uuidV4 } from "uuid";

@Component({
  selector: "mad-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"]
})
export class DataTableComponent implements OnInit, AfterViewInit {
  readonly ACTION_COLUMN_NAME = "__action__";
  readonly SINGLE = DataTableActionType.SINGLE;
  readonly BATCH = DataTableActionType.BATCH;
  readonly NONE = DataTableActionType.NONE;

  @Input() columns: DataTableColumnHeader[] = [];
  @Input() filterLabel = "Filter";
  @Input() filterPlaceholder = "";
  @Input() noDataText = "No matching data found";
  @Input() pageSizeOptions = [5, 10, 15];
  @Input() defaultPageSize = this.pageSizeOptions?.[0] || 10;
  @Input() actions: DataTableAction[] = [];
  @Input() idGenerator: any;

  @Input() set tableData(data: any[]) {
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
    this.createDataMapsAndSetDisplayedDataSourceData(data);
  }

  @Input() set loading(isLoading: boolean) {
    this.isLoading = isLoading;
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

  @Input()
  set forceMode(mode: string) {
    if (mode === this.SINGLE || mode === this.BATCH || mode === this.NONE) {
      this._forceMode = mode;
      this.mode = mode;
      this.setActions();
    }
  }

  @Output() sortEvent = new EventEmitter<Sort>();
  @Output() actionEvent = new EventEmitter<DataTableAction>();
  @Output() pagingEvent = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  tableActions: DataTableAction[] = [];
  rowActions: DataTableAction[] = [];
  allSelected = false;
  selected: [];
  _forceMode: string;
  displayedDataMap = new Map<string, any>();
  actualDataMap = new Map<string, any>();
  dataSource: MatTableDataSource<any[]>;
  selectionModel = new SelectionModel<string>(true);
  columnNames: string[];
  defaultAction: DataTableAction;
  isFilterEnabled = false;
  isPaginationEnabled = false;
  mode = this.NONE;
  isRowClickable = false;
  isLoading = false;

  ngOnInit(): void {
    this.columnNames = this.columns.map(column => column.label);
    this.mode = this.getTableMode();
    this.setActions();
    if (this.mode !== this.NONE) {
      this.isRowClickable = true;
      this.defaultAction = this.rowActions[0];
    }
    this.columnNames.unshift(this.ACTION_COLUMN_NAME);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get selectedCount(): number {
    return this.selectionModel?.selected ? this.selectionModel.selected.length : 0;
  }

  get rowCount(): number {
    return this.dataSource?._pageData(this.dataSource.data) ? this.dataSource._pageData(this.dataSource.data).length : 0;
  }

  public getSelectedCount(actionType: string): string {
    const count = this.selectedCount;
    if (actionType != this.BATCH || count < 2) {
      return "";
    }
    return " (" + count + ")";
  }

  public isDisabled(actionType: string): boolean {
    switch (actionType) {
      case this.SINGLE:
        return this.selectedCount != 1;
      case this.BATCH:
        return this.selectedCount < 1;
      default:
        return false;
    }
  }

  public onToggleSelectAll(): void {
    // clear all selection first
    this.selectionModel.clear();
    // toggle all checkbox
    this.allSelected = !this.allSelected;
    if (this.allSelected) {
      // select all rows of the current page
      this.dataSource._pageData(this.dataSource.data).forEach((row) => {
          const dataRow: any = row as any;
          const rowId = "" + dataRow.rowId;
          this.selectionModel.select(rowId);
        }
      );
    }
  }

  public isSelected(rowId: string): boolean {
    return this.selectionModel.isSelected(rowId);
  }

  public setFilterValue(value: string): void {
    this.dataSource.filter = value?.trim().toLowerCase();
  }

  public onRowCheckbox(event: MouseEvent, row: any): void {
    event.stopPropagation(); // no click event on row
    this.selectionModel.toggle(row.rowId);
  }

  public onRowEvent(event: MouseEvent, row: any, action = this.defaultAction): void {
    switch (this.mode) {
      case this.BATCH:
        this.onRowCheckbox(event, row);
        break;
      case this.SINGLE:
        // emit the default action if the row (not the icon!) was clicked
        if (!!action && !DataTableComponent.isClickOnRowMenuIcon(event)) {
          const selected = [];
          // if ID-generator is provided, return the ID, else return the ACTUAL data
          selected.push(this.idGenerator ? row.rowId : this.actualDataMap.get(row.rowId));
          this.emitTableAction(action, selected);
        }
        break;
      default:
        // do nothing if mode is NONE (or null)
        return;
    }
  }

  public onSortingEvent(sortingParams: Sort): void {
    this.sortEvent.emit(sortingParams);
  }

  public onPaginationEvent(event: any): void {
    this.pagingEvent.emit(event);
  }

  public onTableAction(tableAction: DataTableAction): void {
    if (!!tableAction) {
      const selection: any[] = [];
      for (const selected of this.selectionModel.selected) {
        selection.push(this.idGenerator ? selected : this.actualDataMap.get(selected));
      }
      tableAction.selected = selection;
      this.actionEvent.emit(tableAction);
    }
  }

  private static transformData(value: any, transformer: any, transformerParams: any): any {
    if (!transformer || !(transformer instanceof Function)) {
      return value;
    }
    return transformer(value, transformerParams);
  }

  private static generateRowId(): string {
    return uuidV4();
  }

  private static isClickOnRowMenuIcon(event: MouseEvent): boolean {
    return (event?.target as HTMLElement)?.classList.contains("mat-icon");
  }

  private emitTableAction(action: DataTableAction, selected: any[]): void {
    const emitAction = { ...action };
    if (action.type !== this.NONE) {
      emitAction.selected = [...selected];
    }
    this.actionEvent.emit(emitAction);
  }

  private generateDisplayedDataElement(rowId: string, actualDataElement: any): any {
    const displayedDataElement: { [key: string]: any } = {};
    displayedDataElement["rowId"] = rowId;
    for (const column of this.columns) {
      const actualValue = actualDataElement[column.dataPropertyName];
      displayedDataElement[column.dataPropertyName] = DataTableComponent.transformData(actualValue, column.transformer, column.transformerParams);
    }
    return displayedDataElement;
  }

  private setActions(): void {
    this.rowActions = [];
    this.tableActions = [];
    for (const action of this.actions) {
      if (this.mode !== action.hiddenInMode) {
        switch (action.type) {
          case this.SINGLE:
            if (this.mode === this.SINGLE) {
              this.rowActions.push(action);
            } else {
              this.tableActions.push(action);
            }
            break;
          case this.BATCH:
            if (this.mode !== this.SINGLE) {
              this.tableActions.push(action);
            }
            break;
          default:
            this.tableActions.push(action);
        }
      }
    }
  }

  private createDataMapsAndSetDisplayedDataSourceData(data: any[]) {
    const displayedDataList = [];
    this.actualDataMap.clear();
    this.displayedDataMap.clear();
    for (const dataEntry of data) {
      const rowId = (this.idGenerator) ? this.idGenerator(dataEntry) : DataTableComponent.generateRowId();
      this.actualDataMap.set(rowId, dataEntry);
      const displayedDataElement = this.generateDisplayedDataElement(rowId, dataEntry);
      this.displayedDataMap.set(rowId, displayedDataElement);
      displayedDataList.push(displayedDataElement);
    }
    this.dataSource.data = displayedDataList;
  }


  private getTableMode(): string {
    if (this._forceMode) {
      return this._forceMode;
    }

    if (!this.actions) {
      return this.NONE;
    }
    const distinctActionTypes = new Set<string>();
    for (const rowAction of this.actions) {
      distinctActionTypes.add(rowAction.type);
    }
    if (distinctActionTypes.has(this.BATCH)) {
      return this.BATCH;
    }
    if (distinctActionTypes.has(this.SINGLE)) {
      return this.SINGLE;
    }
    return this.NONE;
  }
}
